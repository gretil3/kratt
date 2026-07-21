"""
The /analyze pipeline (matches the flowchart's RUNTIME lane):

    fetch comments -> infer niche -> preprocess -> Rules + trained BERT
    -> (optional LLM pattern pass) -> aggregate bot % -> response

Bucketing: every comment lands in exactly ONE of the four contract categories,
by priority. BERT provides the genuine-vs-bot split; rules subdivide the bots.
"""
from __future__ import annotations

from . import errors, rules
from .config import settings
from .llm_pass import refine_ambiguous
from .model import classifier
from .niche import determine_niche
from .preprocess import build_model_text
from .schemas import AnalyzeResponse, Breakdown
from .youtube import _client, fetch_comments, fetch_video_meta, parse_video_id

CATEGORIES = ("ads_spam", "copy_paste", "low_effort", "genuine")


def _bucket_of(idx, comment, dup_counts, bert_labels) -> str:
    text = comment["text"]
    if rules.is_ads_spam(text):
        return "ads_spam"
    if rules.is_copy_paste(text, dup_counts):
        return "copy_paste"
    if bert_labels is not None:
        return "genuine" if bert_labels[idx] == "authentic" else "low_effort"
    # BERT unavailable -> heuristic genuine/low_effort split
    return "low_effort" if rules.is_low_effort_fallback(text) else "genuine"


def _pick_samples(comments, buckets, limit) -> list[str]:
    """A few flagged (non-genuine) comments, spread across buckets, de-duped."""
    seen: set[str] = set()
    picks: list[str] = []
    # round-robin the flagged categories so evidence is varied
    for cat in ("ads_spam", "copy_paste", "low_effort"):
        for c, b in zip(comments, buckets):
            if b != cat:
                continue
            text = (c["text"] or "").strip()
            key = text.lower()
            if not text or key in seen:
                continue
            seen.add(key)
            picks.append(text if len(text) <= 200 else text[:197] + "...")
            break
    # top up to the limit with any remaining flagged comments
    for c, b in zip(comments, buckets):
        if len(picks) >= limit:
            break
        if b == "genuine":
            continue
        text = (c["text"] or "").strip()
        key = text.lower()
        if not text or key in seen:
            continue
        seen.add(key)
        picks.append(text if len(text) <= 200 else text[:197] + "...")
    return picks[:limit]


def analyze(video_url: str) -> AnalyzeResponse:
    video_id = parse_video_id(video_url)
    if not video_id:
        raise errors.invalid_url()

    youtube = _client()
    meta = fetch_video_meta(youtube, video_id)          # -> video_not_found / quota
    niche = determine_niche(meta)
    comments = fetch_comments(youtube, video_id, settings.max_comments)  # -> no_comments / quota

    # Rules: duplicate clustering across the fetched set
    dup_counts = rules.duplicate_counts(c["text"] for c in comments)

    # BERT: score each comment (None if the model couldn't load -> rules-only)
    bert_labels = None
    if settings.enable_bert:
        model_texts = [
            build_model_text(c["text"], niche, c["like_count"], c["reply_count"])
            for c in comments
        ]
        bert_labels = classifier.predict(model_texts)

    buckets = [
        _bucket_of(i, c, dup_counts, bert_labels)
        for i, c in enumerate(comments)
    ]
    buckets = refine_ambiguous(comments, buckets, None)  # optional LLM pass (stub)

    total = len(comments)
    counts = {cat: 0 for cat in CATEGORIES}
    for b in buckets:
        counts[b] += 1

    # percentages that sum to 100 (largest-remainder rounding)
    breakdown = _percentages(counts, total)
    bot_percentage = 100 - breakdown["genuine"]

    return AnalyzeResponse(
        bot_percentage=bot_percentage,
        breakdown=Breakdown(**breakdown),
        total_comments_analyzed=total,
        sample_flagged_comments=_pick_samples(comments, buckets, settings.max_samples),
    )


def _percentages(counts: dict, total: int) -> dict:
    if total == 0:
        return {c: 0 for c in CATEGORIES}
    raw = {c: counts[c] / total * 100 for c in CATEGORIES}
    floors = {c: int(raw[c]) for c in CATEGORIES}
    remainder = 100 - sum(floors.values())
    # hand out the leftover points to the largest fractional parts
    order = sorted(CATEGORIES, key=lambda c: raw[c] - floors[c], reverse=True)
    for c in order[:remainder]:
        floors[c] += 1
    return floors
