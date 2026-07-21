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

- **BERT** (`geraldadli/Kratt`) splits each comment into `authentic` vs `bot`. It requires the
  exact training input format, built in `app/preprocess.py`:
  `niche <niche> . <likes bucket> . <replies bucket> . <cleaned text>`.
- **Rules** (`app/rules.py`) subdivide the bot comments into `ads_spam` (spam/link/promo regex)
  and `copy_paste` (near-duplicates within the fetched set). Everything else BERT flags is
  `low_effort`; everything BERT calls authentic is `genuine`.
- **Niche** (`app/niche.py`): the model needs a niche the raw video doesn't carry, so it's
  inferred from the video's category + duration. This is a coarse heuristic — force a niche with
  `KRATT_FORCE_NICHE=genuine|copycat|low-effort`, or replace it with an LLM classifier.
- If the model can't load (offline, no torch), the endpoint **falls back to rules-only** rather
  than failing.

## Config

All optional except the API key — see [`.env.example`](.env.example). Notable knobs:
`KRATT_MAX_COMMENTS` (latency vs coverage), `KRATT_ENABLE_BERT`, `KRATT_FORCE_NICHE`,
`KRATT_CORS_ORIGINS`.

## Structure

- `app/main.py` — FastAPI app, CORS, error mapping
- `app/pipeline.py` — orchestrates fetch → niche → preprocess → rules+BERT → aggregate
- `app/youtube.py`, `app/preprocess.py`, `app/rules.py`, `app/model.py`, `app/niche.py`
- `app/llm_pass.py` — optional LLM pattern pass (stub in this build)
- `notebooks/` — labeling + model training notebooks (not production code)

See [`../docs/api-contract.md`](../docs/api-contract.md) for the request/response format.
