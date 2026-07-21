"""
YouTube Data API v3 access: parse a URL, fetch the video's metadata (for niche
inference + not-found detection) and its top-level comments.

Quota: videos.list and each commentThreads.list page cost 1 unit — cheap.
"""
from __future__ import annotations

import re

from . import errors
from .config import settings

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
    """Return {'category_id', 'duration_s', 'title'} or raise video_not_found."""
    from googleapiclient.errors import HttpError
    try:
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
    }


def fetch_comments(youtube, video_id: str, limit: int) -> list[dict]:
    """
    Return up to `limit` top-level comments as
    {'text', 'like_count', 'reply_count'}. Raises no_comments if disabled/empty.
    """
    from googleapiclient.errors import HttpError

    comments: list[dict] = []
    page_token = None
    while len(comments) < limit:
        try:
            resp = youtube.commentThreads().list(
                part="snippet",
                videoId=video_id,
                maxResults=100,
                order="relevance",   # the comments a viewer actually sees
                textFormat="plainText",
                pageToken=page_token,
            ).execute()
        except HttpError as e:
            content = e.content.decode("utf-8", "ignore") if hasattr(e, "content") else str(e)
            if "commentsDisabled" in content:
                raise errors.no_comments()
            if _is_quota_error(content):
                raise errors.youtube_quota_exceeded()
            raise errors.internal_error()

        for item in resp.get("items", []):
            snip = item["snippet"]["topLevelComment"]["snippet"]
            comments.append({
                "text": snip.get("textDisplay", ""),
                "like_count": int(snip.get("likeCount", 0) or 0),
                "reply_count": int(item["snippet"].get("totalReplyCount", 0) or 0),
            })
            if len(comments) >= limit:
                break

        page_token = resp.get("nextPageToken")
        if not page_token:
            break

    if not comments:
        raise errors.no_comments()
    return comments
