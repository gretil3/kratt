"""
Infer a video's niche (genuine / copycat / low-effort) for the BERT input.

KNOWN LIMITATION: niche is a video-level label that was hand-assigned when the
training set was built. A freshly-pasted video has no such label, and the model
depends on it. This is a heuristic from title/description keywords + video
category; force one niche via KRATT_FORCE_NICHE for testing, or replace this
with an LLM classifier over the title/description for real accuracy.

FIXED BUG: this used to force EVERY video <=60s into "low-effort" regardless of
its actual content. Since Kratt's whole product targets YouTube Shorts (which
are ALL <=60s by definition), that meant almost every real video analyzed got
shoved into the harshest niche no matter how good the content actually was --
BERT never got a fair shot at the comments before the niche context alone
biased it toward "bot". Duration is no longer used as a niche signal at all.
"""
from .config import settings, VALID_NICHES

# Checked FIRST: specific, high-precision phrases in the title/description that
# strongly indicate actual content type, regardless of category or duration.
# Kept as a short list of unambiguous phrases (not broad word lists) so this
# doesn't become its own source of bias -- no match just falls through to the
# category mapping below, it never forces a guess.
_GENUINE_PHRASES = (
    "tutorial", "how to", "how-to", "step by step", "walkthrough",
    "full guide", "explained:", "lecture", "documentary", "in-depth review",
)
_COPYCAT_PHRASES = (
    "recap", "reaction to", "react to", "top 10", "top 5", "ranked",
    "tier list", "compilation", "movie explained", "story explained",
)

# YouTube videoCategory IDs -> our niches, used when no keyword match fires.
#   informative / how-to  -> genuine    (tutorials, science, education)
#   reaction / entertainment-> copycat  (recaps, commentary, vlogs)
#   short fast-consume     -> low-effort (comedy shorts, memes, gaming clips)
_CATEGORY_TO_NICHE = {
    "27": "genuine",     # Education
    "28": "genuine",     # Science & Technology
    "26": "genuine",     # Howto & Style
    "25": "genuine",     # News & Politics
    "24": "copycat",     # Entertainment
    "22": "copycat",     # People & Blogs
    "23": "copycat",     # Comedy
    "20": "low-effort",  # Gaming
    "10": "low-effort",  # Music
    "1":  "low-effort",  # Film & Animation
}


def _keyword_niche(title: str, description: str) -> str | None:
    text = f"{title} {description}".lower()
    if any(p in text for p in _GENUINE_PHRASES):
        return "genuine"
    if any(p in text for p in _COPYCAT_PHRASES):
        return "copycat"
    return None


def determine_niche(video_meta: dict) -> str:
    if settings.force_niche in VALID_NICHES:
        return settings.force_niche

    niche = _keyword_niche(video_meta.get("title", ""), video_meta.get("description", ""))
    if niche:
        return niche

    niche = _CATEGORY_TO_NICHE.get(str(video_meta.get("category_id", "")))
    if niche in VALID_NICHES:
        return niche

    return settings.default_niche if settings.default_niche in VALID_NICHES else "genuine"
