"""
The "Rules" half of the flowchart's "Rules + trained BERT" step. BERT decides
genuine-vs-bot; these rules subdivide the bot comments into ads_spam / copy_paste,
and provide a bot heuristic for the fallback path when BERT isn't loaded.
"""
import re
from collections import Counter

# ads/spam: links, contact handles, crypto/earnings pitches, self-promo.
_SPAM_PATTERNS = [
    r"https?://",
    r"\bwww\.",
    r"\bt\.me/",
    r"\b(telegram|whats?app|onlyfans)\b",
    r"\b(free\s+crypto|crypto\s+giveaway|bitcoin|forex|binary\s+option)\b",
    r"\b(earn|make|win)\s*\$?\s*\d",
    r"\b(promo|coupon|discount)\s*code\b",
    r"\bcheck\s+(out\s+)?my\s+(page|channel|profile|bio|link)\b",
    r"\b(dm|inbox|message)\s+me\b",
    r"\bsub(scribe)?\s+(to\s+)?my\b",
]
SPAM_RE = re.compile("|".join(_SPAM_PATTERNS), re.IGNORECASE)

# generic/low-effort filler used only in the BERT-unavailable fallback.
_LOW_EFFORT_PATTERNS = [
    r"^\W*first\W*$",
    r"who'?s\s+watching",
    r"^\W*(nice|great|good|love|amazing|wow|lol|lmao|cool)\W*$",
]
LOW_EFFORT_RE = re.compile("|".join(_LOW_EFFORT_PATTERNS), re.IGNORECASE)

_EMOJI_OR_SYMBOL = re.compile(r"[\w]", re.UNICODE)  # any word char -> has "content"


def is_ads_spam(raw_text: str) -> bool:
    return bool(SPAM_RE.search(str(raw_text)))


def normalize_for_dup(text: str) -> str:
    """Collapse whitespace + lowercase so near-identical comments cluster."""
    return re.sub(r"\s+", " ", str(text)).strip().lower()


def duplicate_counts(texts) -> Counter:
    return Counter(normalize_for_dup(t) for t in texts)


def is_copy_paste(text: str, counts: Counter, threshold: int = 2) -> bool:
    # near-duplicate WITHIN this video's fetched comments (the cross-video signal
    # from training isn't available at request time — we only have one video).
    return counts[normalize_for_dup(text)] >= threshold


def is_low_effort_fallback(text: str) -> bool:
    s = str(text).strip()
    if not _EMOJI_OR_SYMBOL.search(s):
        return True                      # emoji/punctuation only
    if len(s) <= 4:
        return True                      # extremely short
    return bool(LOW_EFFORT_RE.search(s))
