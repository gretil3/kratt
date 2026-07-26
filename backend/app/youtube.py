"""
YouTube Data API v3 access: parse a URL, fetch the video's metadata (for niche
inference + not-found detection) and its comments (top-level + replies).

Quota: videos.list and each commentThreads.list / comments.list page cost 1 unit.
"""
from __future__ import annotations

import logging
import re
import threading
from concurrent.futures import ThreadPoolExecutor, as_completed

log = logging.getLogger("kratt.youtube")

from . import errors
from .config import settings


class _CallCounter:
    """
    Tracks actual YouTube API calls made for ONE /analyze request, so "are we
    really making one call per comment?" is a number in the logs, not a guess.
    Created fresh per fetch_comments() call (never a module-level global) --
    FastAPI can serve requests concurrently, and a shared counter would let
    two in-flight requests corrupt each other's counts. Thread-safe because
    Phase 3 increments it from multiple worker threads at once.
    """
    def __init__(self):
        self._n = 0
        self._lock = threading.Lock()

    def inc(self) -> None:
        with self._lock:
            self._n += 1

    @property
    def count(self) -> int:
        return self._n


class _PaginationExhausted(Exception):
    """
    Internal signal (never leaves this module): a page fetch failed with an
    error that is NOT quota/comments-disabled -- most commonly YouTube's
    undocumented depth limit on relevance/time-ordered pagination (their API
    stops serving pages past a certain depth with a generic error instead of
    just omitting nextPageToken). Caught locally so the CALLING phase can move
    on to the next strategy instead of failing the whole request.
    """

VIDEO_ID_RE = re.compile(
    r"(?:youtube\.com/(?:watch\?(?:.*&)?v=|shorts/|embed/)|youtu\.be/)([A-Za-z0-9_-]{11})"
)
# ISO-8601 duration, e.g. PT1M30S
_DURATION_RE = re.compile(r"PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?")


def parse_video_id(url_or_id: str) -> str | None:
    s = (url_or_id or "").strip()
    if len(s) == 11 and re.fullmatch(r"[A-Za-z0-9_-]{11}", s):
        return s
    m = VIDEO_ID_RE.search(s)
    return m.group(1) if m else None


def duration_seconds(iso: str) -> int:
    m = _DURATION_RE.fullmatch(iso or "")
    if not m:
        return 0
    h, mi, s = (int(x) if x else 0 for x in m.groups())
    return h * 3600 + mi * 60 + s


def _client():
    if not settings.youtube_api_key:
        raise errors.KrattError(
            "internal_error",
            "Server is missing YOUTUBE_API_KEY.",
            500,
        )
    from googleapiclient.discovery import build
    return build("youtube", "v3", developerKey=settings.youtube_api_key,
                 cache_discovery=False)


def _is_quota_error(content: str) -> bool:
    return "quotaExceeded" in content or "dailyLimitExceeded" in content


def fetch_video_meta(youtube, video_id: str) -> dict:
    """Return {'category_id', 'duration_s', 'title', 'description'} or raise
    video_not_found. description is fetched for niche keyword matching (see
    app/niche.py) -- 'snippet' already includes it, so this is zero extra cost."""
    from googleapiclient.errors import HttpError
    try:  # 1 call, regardless of comment count -- not part of the per-comment cost
        resp = youtube.videos().list(
            part="snippet,contentDetails", id=video_id
        ).execute()
    except HttpError as e:
        content = e.content.decode("utf-8", "ignore") if hasattr(e, "content") else str(e)
        if _is_quota_error(content):
            raise errors.youtube_quota_exceeded()
        raise errors.internal_error()

    items = resp.get("items", [])
    if not items:
        raise errors.video_not_found()
    snip = items[0].get("snippet", {})
    details = items[0].get("contentDetails", {})
    return {
        "category_id": snip.get("categoryId", ""),
        "duration_s": duration_seconds(details.get("duration", "")),
        "title": snip.get("title", ""),
        "description": snip.get("description", ""),
    }


def _fetch_page(youtube, video_id: str, order: str, page_token: str | None,
                counter: _CallCounter):
    """Single commentThreads.list call -- fetches up to 100 comments (YouTube's
    hard per-call maximum; there is no way to request more in one call).
    Returns the raw API response."""
    from googleapiclient.errors import HttpError
    counter.inc()
    try:
        return youtube.commentThreads().list(
            part="snippet",
            videoId=video_id,
            maxResults=100,
            order=order,
            textFormat="plainText",
            pageToken=page_token,
        ).execute()
    except HttpError as e:
        content = e.content.decode("utf-8", "ignore") if hasattr(e, "content") else str(e)
        if "commentsDisabled" in content:
            raise errors.no_comments()
        if _is_quota_error(content):
            raise errors.youtube_quota_exceeded()
        # NOT a hard failure -- see _PaginationExhausted docstring. Deep
        # pagination (large max_comments) hits this routinely and legitimately.
        raise _PaginationExhausted(content[:200]) from e


def _collect_from_response(resp, seen_ids: set, comments: list,
                            reply_threads: list, limit: int) -> str | None:
    """Append new (non-duplicate) top-level comments. Track threads with replies.
    Returns nextPageToken."""
    for item in resp.get("items", []):
        comment_id = item["snippet"]["topLevelComment"]["id"]
        if comment_id in seen_ids:
            continue
        seen_ids.add(comment_id)
        snip = item["snippet"]["topLevelComment"]["snippet"]
        reply_count = int(item["snippet"].get("totalReplyCount", 0) or 0)
        comments.append({
            "text": snip.get("textDisplay", ""),
            "like_count": int(snip.get("likeCount", 0) or 0),
            "reply_count": reply_count,
        })
        if reply_count > 0:
            reply_threads.append((comment_id, reply_count))
        if len(comments) >= limit:
            break
    return resp.get("nextPageToken")


def _fetch_replies(parent_id: str, limit: int, counter: _CallCounter) -> list[dict]:
    """
    Fetch up to `limit` replies for a single comment thread. Builds its OWN
    client -- called concurrently from a thread pool (see Phase 3 below), and
    googleapiclient's transport (httplib2) is not guaranteed thread-safe when
    a single client/Http object is shared across threads. Reply comment IDs
    are globally unique per-thread on YouTube, so no cross-thread dedup set is
    needed (unlike top-level comments in phase 1/2, which do share one).

    Costs exactly one API call per PAGE of this thread's replies (YouTube's
    comments.list takes a single parentId -- there is no way to fetch replies
    for multiple parents in one call, regardless of how few replies each has).
    """
    from googleapiclient.errors import HttpError
    youtube = _client()
    seen_ids: set[str] = set()
    replies: list[dict] = []
    page_token = None
    while len(replies) < limit:
        counter.inc()
        try:
            resp = youtube.comments().list(
                part="snippet",
                parentId=parent_id,
                maxResults=100,
                textFormat="plainText",
                pageToken=page_token,
            ).execute()
        except HttpError as e:
            content = e.content.decode("utf-8", "ignore") if hasattr(e, "content") else str(e)
            if _is_quota_error(content):
                raise errors.youtube_quota_exceeded()
            break  # skip this thread on other errors

        for item in resp.get("items", []):
            reply_id = item["id"]
            if reply_id in seen_ids:
                continue
            seen_ids.add(reply_id)
            snip = item["snippet"]
            replies.append({
                "text": snip.get("textDisplay", ""),
                "like_count": int(snip.get("likeCount", 0) or 0),
                "reply_count": 0,  # replies don't have sub-replies
            })
            if len(replies) >= limit:
                break
        page_token = resp.get("nextPageToken")
        if not page_token:
            break
    return replies


# Cap the number of threads we'll fetch replies from to keep latency bounded.
_MAX_REPLY_THREADS = 200
# Reply threads are independent HTTP calls (different parentId each) -> safe
# to run concurrently. This is what makes Phase 3 fast enough at large limits
# instead of taking one full request round-trip per thread, sequentially.
_REPLY_FETCH_WORKERS = 10


def fetch_comments(youtube, video_id: str, limit: int) -> list[dict]:
    """
    Return up to `limit` comments as
    {'text', 'like_count', 'reply_count'}. Raises no_comments if disabled/empty.

    Uses a three-phase strategy:
      1. Fetch top-level comments by *relevance* (the ones viewers see first).
         YouTube caps relevance pagination at ~1-2k results.
      2. Backfill with *time*-ordered top-level comments to reach deeper.
      3. Fetch *replies* for threads that have them (highest reply-count
         threads first, fetched concurrently) until the limit is reached.

    Phases 1/2 dedupe by comment ID via a shared set. If a phase's pagination
    fails with an unexpected (non-quota, non-disabled) error -- which happens
    routinely once you page deep enough, see _PaginationExhausted -- that
    phase just stops early instead of failing the whole request; the next
    phase picks up the slack.
    """
    comments: list[dict] = []
    seen_ids: set[str] = set()
    reply_threads: list[tuple[str, int]] = []  # (parent_id, reply_count)
    counter = _CallCounter()  # request-scoped -- see _CallCounter docstring

    # --- Phase 1: relevance-ordered (most visible comments) ---
    # Each call below returns up to 100 comments -- YouTube's hard per-call
    # maximum. There is no request that returns more in one call, so this is
    # already the fewest calls possible for however many top-level comments
    # the video actually has.
    print(f"[kratt] Phase 1: fetching top-level comments by relevance ...")
    page_token = None
    while len(comments) < limit:
        try:
            resp = _fetch_page(youtube, video_id, "relevance", page_token, counter)
        except _PaginationExhausted as e:
            print(f"[kratt] Phase 1 stopped early ({e}) -- moving to phase 2")
            break
        page_token = _collect_from_response(resp, seen_ids, comments,
                                            reply_threads, limit)
        if not page_token:
            break
    print(f"[kratt] Phase 1 done: {len(comments)} comments ({counter.count} calls so far)")

    # --- Phase 2: time-ordered backfill (reaches much deeper) ---
    if len(comments) < limit:
        print(f"[kratt] Phase 2: backfilling with time-ordered comments ...")
        page_token = None
        while len(comments) < limit:
            try:
                resp = _fetch_page(youtube, video_id, "time", page_token, counter)
            except _PaginationExhausted as e:
                print(f"[kratt] Phase 2 stopped early ({e}) -- moving to phase 3")
                break
            page_token = _collect_from_response(resp, seen_ids, comments,
                                                reply_threads, limit)
            if not page_token:
                break
        print(f"[kratt] Phase 2 done: {len(comments)} comments ({counter.count} calls so far)")

    # --- Phase 3: fetch replies concurrently (highest reply-count threads first) ---
    # Unlike phases 1/2, this genuinely costs ~1 call per THREAD: comments.list
    # takes a single parentId, and YouTube has no endpoint to batch-fetch
    # replies across multiple parents. Skip threads too small to be worth a
    # full call, and don't bother once we already have enough comments.
    if len(comments) < limit and reply_threads:
        reply_threads = [t for t in reply_threads if t[1] >= settings.min_replies_to_fetch]
        reply_threads.sort(key=lambda t: t[1], reverse=True)
        threads_to_fetch = reply_threads[:_MAX_REPLY_THREADS]
        total_threads = len(threads_to_fetch)
        print(f"[kratt] Phase 3: fetching replies from {total_threads} threads "
              f"(of {len(reply_threads)} with >= {settings.min_replies_to_fetch} replies), "
              f"{_REPLY_FETCH_WORKERS} at a time ...")

        # Each worker gets a generous per-thread cap rather than a precisely
        # shrinking shared budget (hard to coordinate safely once concurrent);
        # the combined result is hard-trimmed back down to `limit` afterward.
        per_thread_cap = max(20, limit - len(comments))
        done_count = 0
        with ThreadPoolExecutor(max_workers=_REPLY_FETCH_WORKERS) as pool:
            futures = {
                pool.submit(_fetch_replies, parent_id, per_thread_cap, counter): parent_id
                for parent_id, _ in threads_to_fetch
            }
            for future in as_completed(futures):
                comments.extend(future.result())  # re-raises youtube_quota_exceeded, if any
                done_count += 1
                if done_count % 50 == 0:
                    print(f"[kratt]   ... {done_count}/{total_threads} threads, "
                          f"{len(comments)} comments so far")
        comments[:] = comments[:limit]
        print(f"[kratt] Phase 3 done: {len(comments)} comments total ({counter.count} calls so far)")

    if not comments:
        raise errors.no_comments()

    print(f"[kratt] fetch_comments summary: {counter.count} YouTube API calls -> "
          f"{len(comments)} comments ({len(comments) / max(counter.count, 1):.1f} comments/call)")
    return comments
