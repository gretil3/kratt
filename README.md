# Kratt

> An autonomous machine, eternally bound to one task: exposing the bots that inflate the internet.

Kratt is a media literacy tool built for **UNESCO Youth Hackathon 2026** (theme: *Play Your Part — Youth Designing the Future of Media and Information Literacy*). Paste a YouTube video link, and Kratt returns an estimate of how much of the comment section is likely bot activity — broken down into four categories (ads & spam, copy-paste, low-effort filler, genuine) so the score comes with a reason, not just a number.

The app teaches while it scores: the user commits their own guess before seeing the result, each evidence category comes with the concrete "tell" a human can look for, and the app states its own blind spots out loud — what Kratt can't see (landing page) and why the score can be wrong (result screen). Every research claim in the app traces to a numbered, verified source.

## Team

| Name | Role |
|---|---|
| David | Backend & ML / Mobile App |
| Fiko | Backend & ML / Mobile App |
| Gerald | Backend & ML / Mobile App |
| Kevin | Backend & ML / Mobile App |


## Project structure

```
kratt/
├── .github/workflows/     # mobile CI: format, lint, tests, web export on every PR
├── backend/              # FastAPI + ML pipeline
│   ├── app/
│   ├── notebooks/        # labeling experiments, EDA
│   ├── requirements.txt
│   └── README.md
├── mobile/                # React Native (Expo) — app + web landing page
│   ├── app/               # screens (expo-router): home, onboarding, analyzing, analysis/[videoId], history, error
│   ├── components/        # landing sections + shared UI (score gauge, category cards)
│   ├── theme/             # design tokens — single source of truth for color/type
│   ├── lib/               # mock API per the contract, category/risk helpers
│   ├── package.json
│   └── README.md
├── docs/
│   ├── api-contract.md    # source of truth for request/response format
│   ├── decisions/          # short notes on why a decision was made
│   └── meeting-notes/
└── README.md               # you are here
```

## Architecture (short version)

The mobile app never runs BERT on-device. It sends a video URL to the backend; the backend fetches comments via the YouTube Data API, scores them with a fine-tuned BERT model + a rule engine, and returns a JSON result. 

## Getting started

### Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

Backend runs at `http://localhost:8000`. Interactive API docs at `http://localhost:8000/docs`.

### Mobile app

```bash
cd mobile
npm install
npx expo start          # native
npx expo start --web    # web build — landing page + app at http://localhost:8081
```

Scan the QR code with the **Expo Go** app on your phone to run it on a real device. The web build serves the public landing page at `/` and the same analyzer flow behind it.

### Environment variables

Copy `.env.example` to `.env` in `backend/` and fill in:

```
YOUTUBE_API_KEY=your_key_here
```

Never commit `.env` — it's already in `.gitignore`.

## Branching

- `main` — always in a demo-able state. Don't commit directly.
- Feature branches: `feature/bert-finetune`, `feature/result-screen`, `fix/api-timeout`.
- Open a PR into `main`, get at least one review before merging.

## Docs

- [`docs/api-contract.md`](docs/api-contract.md) — request/response format between mobile and backend
- [`docs/decisions/`](docs/decisions/) — why we chose YouTube over TikTok, why BERT, the mobile design revamp, etc.

## Known limitations

These are stated openly — in the pitch *and* inside the app itself (the landing page's "What Kratt can't see" block and the result screen's "Why this score can be wrong" card).

- Bot/human labels are weak-supervised (heuristic-based), not ground truth.
- The four evidence categories are **content signals** — they read what comments say, not who posted them or when. Coordination signals (posting-time bursts, account age, cross-video account networks) are not measured in this build.
- The low-effort heuristic can over-flag real people whose genuine style is short and enthusiastic — especially second-language writers and fandom idiom. The score is a starting point for looking, not a verdict on any individual commenter.
- Demo dataset is a fixed pull from the YouTube Data API, not a live scraper.
