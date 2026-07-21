"""
Infer a video's niche (genuine / copycat / low-effort) for the BERT input.

KNOWN LIMITATION: niche is a video-level label that was hand-assigned when the
training set was built. A freshly-pasted video has no such label, and the model
depends on it. This is a coarse heuristic from the video's category + duration;
tune the mapping, force one niche via KRATT_FORCE_NICHE, or replace this with an
LLM classifier over the title/description for better accuracy.
"""
from .config import settings, VALID_NICHES

# YouTube videoCategory IDs -> our niches.
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


def determine_niche(video_meta: dict) -> str:
    if settings.force_niche in VALID_NICHES:
        return settings.force_niche

    # Very short clips are the "fast-consume" pattern regardless of category.
    if 0 < video_meta.get("duration_s", 0) <= 60:
        return "low-effort"

    niche = _CATEGORY_TO_NICHE.get(str(video_meta.get("category_id", "")))
    if niche in VALID_NICHES:
        return niche

    return settings.default_niche if settings.default_niche in VALID_NICHES else "genuine"
