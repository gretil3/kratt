"""
Comment preprocessing — MUST stay byte-for-byte identical to the training
notebook (backend/notebooks/kratt_bert_training.ipynb), or the model sees an
input distribution it was never trained on and quality collapses.

model input format:
    niche <niche> . <likes bucket> . <replies bucket> . <cleaned text>
e.g.
    niche low effort . few likes . no replies . first!!
"""
import re

# Invisible chars: ZWSP, directional marks, word-joiner family, BOM, soft hyphen.
# NOT stripped: U+200D (ZWJ glues family/skin-tone emoji) and U+FE0F (emoji
# variation selector) — "keep emojis" includes their invisible glue.
INVISIBLE_RE = re.compile("[​‎‏⁠⁡⁢⁣⁤﻿­]")
URL_RE = re.compile(r"(?:https?://|www\.)\S+", re.IGNORECASE)
USER_RE = re.compile(r"@[\w.\-]+")
TAG_RE = re.compile(r"#\w+")


def clean_text(text) -> str:
    s = INVISIBLE_RE.sub("", str(text))
    s = URL_RE.sub(" <URL> ", s)   # URLs first: they can contain '#' and '@' fragments
    s = USER_RE.sub(" <USER> ", s)
    s = TAG_RE.sub(" <TAG> ", s)
    # lowercase everything EXCEPT all-caps tokens (shouting is a signal); the
    # <URL>/<USER>/<TAG> placeholders are all-caps so they survive untouched.
    return " ".join(
        tok if (len(tok) >= 2 and tok.isupper()) else tok.lower()
        for tok in s.split()
    )


def like_phrase(n: int) -> str:
    return "many likes" if n >= 10 else ("some likes" if n >= 2 else "few likes")


def reply_phrase(n: int) -> str:
    return "has replies" if n > 0 else "no replies"


def build_model_text(text, niche_tag: str, like_count: int, reply_count: int) -> str:
    return (
        f"niche {niche_tag.replace('-', ' ')} . "
        f"{like_phrase(like_count)} . {reply_phrase(reply_count)} . {clean_text(text)}"
    )
