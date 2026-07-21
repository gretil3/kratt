---
license: mit
language:
- en
base_model: xlm-roberta-base
pipeline_tag: text-classification
tags:
- youtube-comments
- bot-detection
- media-literacy
- xlm-roberta
widget:
- text: "niche low effort . few likes . no replies . first!!"
- text: "niche genuine . many likes . has replies . the part at 3:42 where he almost fell was insane, glad he stuck the landing"
---

# Kratt Comment Authenticity Classifier

Fine-tuned `xlm-roberta-base` that scores a YouTube comment as **`bot`** or **`authentic`**.
Built for Kratt, a media-literacy tool that helps viewers read comment sections more critically —
it flags likely bot activity, it never deletes or hides anything.

## ⚠️ Required input format — read this first

This model was **not** trained on raw comment text. Every input was built as:

```
niche <niche_tag> . <likes bucket> . <replies bucket> . <cleaned comment text>
```

Concrete example:
```
niche low effort . few likes . no replies . first!!
```

| Piece | Values | Rule |
|---|---|---|
| `niche_tag` | `genuine`, `copycat`, `low effort` | property of the **video**, hyphens replaced with spaces |
| likes bucket | `few likes` (<2), `some likes` (2–9), `many likes` (≥10) | from `like_count` |
| replies bucket | `no replies` (0), `has replies` (>0) | from `reply_count` |
| comment text | lowercased **except ALL-CAPS tokens** (shouting is a signal); URLs/@mentions/#hashtags replaced with `<URL>` / `<USER>` / `<TAG>`; emoji kept as-is | see Preprocessing below |

**If you skip this prefix and feed raw comment text, the model will perform far worse than the
reported metrics** — the niche and engagement context are load-bearing, not optional metadata.
This was a deliberate design choice: `niche_tag` is a video-level property that determines a large
part of the label, so the model cannot infer it from the comment text alone.

The three placeholder tokens `<URL>`, `<USER>`, `<TAG>` are registered as tokenizer special tokens
— load the tokenizer from this repo, not a fresh `xlm-roberta-base` tokenizer, or these will be
split into sub-word garbage.

## How to use

```python
import re
from transformers import AutoTokenizer, AutoModelForSequenceClassification
import torch

REPO = "your-username/kratt-comment-authenticity"  # replace with your HF repo id
tokenizer = AutoTokenizer.from_pretrained(REPO)
model = AutoModelForSequenceClassification.from_pretrained(REPO)

INVISIBLE_RE = re.compile('[​‎‏⁠⁡⁢⁣⁤﻿­]')
URL_RE  = re.compile(r'(?:https?://|www\.)\S+', re.IGNORECASE)
USER_RE = re.compile(r'@[\w.\-]+')
TAG_RE  = re.compile(r'#\w+')

def clean_text(text):
    s = INVISIBLE_RE.sub('', str(text))
    s = URL_RE.sub(' <URL> ', s)
    s = USER_RE.sub(' <USER> ', s)
    s = TAG_RE.sub(' <TAG> ', s)
    return ' '.join(t if (len(t) >= 2 and t.isupper()) else t.lower() for t in s.split())

def like_phrase(n):  return 'many likes' if n >= 10 else ('some likes' if n >= 2 else 'few likes')
def reply_phrase(n): return 'has replies' if n > 0 else 'no replies'

def build_input(text, niche_tag, like_count, reply_count):
    return (f"niche {niche_tag.replace('-', ' ')} . {like_phrase(like_count)} . "
            f"{reply_phrase(reply_count)} . {clean_text(text)}")

model_input = build_input(
    text="first!!", niche_tag="low-effort", like_count=0, reply_count=0)

inputs = tokenizer(model_input, truncation=True, max_length=128, return_tensors="pt")
with torch.no_grad():
    probs = torch.softmax(model(**inputs).logits, dim=-1)[0]

print({model.config.id2label[i]: round(p.item(), 3) for i, p in enumerate(probs)})
```

## Labels

| id | label |
|---|---|
| 0 | `bot` |
| 1 | `authentic` |

## Training data

~[FILL IN: total rows after filtering] YouTube comments, per-comment-tagged by a local LLM
(Qwen2.5-7B-Instruct) into `genuine` / `copycat` / `low-effort` / `ads_spam`, combined with each
comment's video-level `niche_tag` (`genuine` / `copycat` / `low-effort`).

**Labels are weak/derived, not human-annotated.** A `(niche_tag, comment_tag)` → authenticity-score
matrix converts the combination into a binary label (`authentic` if score ≥ 0.5) and a per-sample
training weight (`|score − 0.5| × 2`). The core idea: the same comment type means different things
in different niches — e.g. a low-effort comment under a genuine-niche video (tutorial, stunt) is
usually just a casual human (high authenticity), while the same comment type under a low-effort
video (fast-consume clips) matches an observed bot pattern (low authenticity). Ambiguous
combinations (e.g. `copycat` in a `genuine` niche, score 0.5) get a training weight near zero and
barely influence the model.

`ads_spam`-tagged comments were excluded from training — spam detection is handled by a separate
rule engine in the product, not this classifier.

## Training procedure

- Base model: `xlm-roberta-base` (multilingual, cased — casing matters for the ALL-CAPS signal)
- 3 epochs, batch size 16 (grad. accumulation ×2), LR 2e-5, max sequence length 128, `fp16`
- **Grouped split by `video_id`** (no video's comments appear in both train and test) with a
  per-video cap of 500 comments so one large video can't dominate a niche's data or degenerate the
  split, plus a guard requiring ≥2 videos and 15–25% share in the test set
- **Weighted loss**: per-sample weight from the authenticity matrix (above) × class weight,
  where class weights are computed on the **effective weighted mass** per class (not raw row
  counts) so the sample weights and class balance don't fight each other in the loss

## Evaluation

Test set: grouped by video, [FILL IN: N] comments across [FILL IN: N] videos.

```
              precision    recall  f1-score   support

         bot       [FILL IN]
   authentic       [FILL IN]

    accuracy                           [FILL IN]
```

Positive class for the confusion matrix is `bot`; a false positive means an **authentic comment
flagged as bot** — the costlier error for a media-literacy tool, since it wrongly casts doubt on
a real person.

## Limitations

- **Weak labels**: ground truth comes from an LLM's per-comment judgment + a hand-picked
  authenticity matrix, not human annotation. Treat metrics as agreement with that scheme, not
  absolute truth — a hand-checked sample (`handcheck_sample.csv` in the training notebook) is the
  real validation step.
- **English-only**: non-English comments were filtered out of training via language detection;
  behavior on other languages is untested.
- **Requires the exact input format above** — this is not a general-purpose comment classifier.
- Not intended to auto-moderate or delete content — designed to surface a bot-likelihood signal
  for human review, in line with the project's media-literacy (not censorship) goal.

## Intended use

Input to Kratt's `/analyze` pipeline: score each fetched comment, aggregate into a bot-likelihood
percentage and evidence breakdown shown to the end user.
