---
title: Kratt API
emoji: 🌾
colorFrom: green
colorTo: gray
sdk: docker
app_port: 7860
pinned: false
---

<!--
The frontmatter above is ONLY read by Hugging Face Spaces (it's how a Docker
Space knows what to build/display) -- harmless everywhere else this file is
read (GitHub, local editors). See "Deploying" at the bottom for how this
folder becomes a Space.
-->

# Kratt — backend

FastAPI service that scores a YouTube video's comment section for likely bot activity,
implementing the RUNTIME lane of the pipeline flowchart:

```
POST /analyze  ->  fetch comments (YouTube Data API)  ->  infer niche
              ->  preprocess (identical to the training notebook)
              ->  Rules + trained BERT (geraldadli/Kratt on HF)
              ->  (optional LLM pattern pass)  ->  aggregate bot %  ->  JSON
```

## Setup

```bash
cd backend
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt

cp .env.example .env            # then put your YOUTUBE_API_KEY in .env
```

`.env` is gitignored — never commit your key.

## Run

```bash
uvicorn app.main:app --reload
```

- API docs / try it: http://localhost:8000/docs
- Health: http://localhost:8000/  (also reports whether BERT loaded)

The first `/analyze` call downloads the model from the Hub (~1 GB, cached after). For a
fast rules-only dev loop that skips the model entirely, set `KRATT_ENABLE_BERT=0`.

## How it scores

- **BERT** (`geraldadli/Kratt`) splits each comment into `authentic` vs `bot` (via a tunable
  probability threshold, `KRATT_BOT_THRESHOLD`). It requires the exact training input format,
  built in `app/preprocess.py`: `niche <niche> . <likes bucket> . <replies bucket> . <cleaned text>`.
- **Rules** (`app/rules.py`) subdivide the bot comments into `ads_spam` (spam/link/promo regex)
  and `copy_paste` (near-duplicates within the fetched set). Everything else BERT flags is
  `low_effort`; everything BERT calls authentic is `genuine`.
- **Niche** (`app/niche.py`): the model needs a niche the raw video doesn't carry, so it's
  inferred from title/description keywords first, then the video's category (duration is
  deliberately NOT used — see the fix note in that file for why). Force a niche with
  `KRATT_FORCE_NICHE=genuine|copycat|low-effort`, or replace this with an LLM classifier for
  real accuracy.
- If the model can't load (offline, no torch), the endpoint **falls back to rules-only** rather
  than failing.

## Config

All optional except the API key — see [`.env.example`](.env.example). Notable knobs:
`KRATT_MAX_COMMENTS` (latency vs coverage), `KRATT_ENABLE_BERT`, `KRATT_BOT_THRESHOLD`,
`KRATT_FORCE_NICHE`, `KRATT_CORS_ORIGINS`.

## Structure

- `app/main.py` — FastAPI app, CORS, error mapping
- `app/pipeline.py` — orchestrates fetch → niche → preprocess → rules+BERT → aggregate
- `app/youtube.py`, `app/preprocess.py`, `app/rules.py`, `app/model.py`, `app/niche.py`
- `app/llm_pass.py` — optional LLM pattern pass (stub in this build)
- `notebooks/` — labeling + model training notebooks (not production code)
- `Dockerfile`, `requirements-serve.txt`, `scripts/prefetch_model.py` — deploy image (below)

See [`../docs/api-contract.md`](../docs/api-contract.md) for the request/response format.

## Deploying

The `Dockerfile` bakes the trained model in at build time (see the comments in it), so a
cold container starts instantly with no dependency on the model repo being reachable at
runtime. It's portable — same image works on HF Spaces, Render, Railway, or Fly.io.

### Run it locally in Docker first

```bash
docker build -t kratt-backend .
docker run -p 7860:7860 --env-file .env kratt-backend
```

(`.env` only needs `YOUTUBE_API_KEY` — everything else has a working default baked in.)

### Deploy to Hugging Face Spaces (Docker SDK)

1. Create a new Space at huggingface.co/new-space: **SDK = Docker**, any name (e.g. `kratt-api`).
   Don't add any files through the web UI — we're pushing this folder to it directly.
2. From the repo root, push just this `backend/` subfolder as the Space's root (the Space needs
   `Dockerfile` at ITS top level, not nested inside a monorepo):
   ```bash
   git remote add space https://huggingface.co/spaces/<your-username>/kratt-api
   git subtree push --prefix backend space main
   ```
   (Re-run the same `git subtree push` command after future backend changes to update the Space.)
3. In the Space's **Settings → Repository secrets**, add `YOUTUBE_API_KEY` (never commit it).
4. Wait for the build (~a few minutes — mostly the model prefetch step). Your API is then live at
   `https://<your-username>-kratt-api.hf.space`.
5. Update `docs/api-contract.md`'s "Base URL (deployed)" line, and set that URL as
   `EXPO_PUBLIC_API_BASE_URL` for the mobile app (see `mobile/vercel.json`).

### Alternative hosts

Same Dockerfile works on Render, Railway, or Fly.io — point their "deploy from Dockerfile" flow
at this folder, set `YOUTUBE_API_KEY` as a secret in their dashboard, and skip step 2 above (no
subtree push needed — those hosts build directly from a subdirectory of a normal GitHub repo).
