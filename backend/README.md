# Kratt — backend

FastAPI service that scores a YouTube video's comment section for likely bot activity.

## Setup

```bash
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt
```

Copy `.env.example` to `.env` and fill in `YOUTUBE_API_KEY`.

## Run

```bash
uvicorn app.main:app --reload
```

API docs: http://localhost:8000/docs

## Structure

- `app/` — FastAPI application code (endpoints, model loading, rule engine)
- `notebooks/` — labeling experiments, EDA, model training notebooks (not for production code)

See [`../docs/api-contract.md`](../docs/api-contract.md) for the request/response format.
