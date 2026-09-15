# Kratt

> An autonomous machine, eternally bound to one task: exposing the bots that inflate the internet.

Kratt is a media literacy tool built for **UNESCO Youth Hackathon 2026** (theme: *Play Your Part — Youth Designing the Future of Media and Information Literacy*). Paste a YouTube video link, and Kratt returns an estimate of how much of the comment section is likely bot activity — broken down into four categories (ads & spam, copy-paste, low-effort filler, genuine) so the score comes with a reason, not just a number.

The point isn't the number. Kratt is built to *train the reader*: it makes you guess before it reveals, shows you the actual comments it flagged, and hands you a checklist for evaluating the source yourself.

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
├── backend/               # FastAPI + ML pipeline (deployable as a Docker image)
│   ├── app/               # main, pipeline, youtube, preprocess, rules, model, niche, llm_pass
│   ├── notebooks/         # labeling + BERT training (not production code)
│   ├── scripts/           # prefetch_model.py (build-time), scrape_comments.py, Launch Kratt.bat
│   ├── Dockerfile         # bakes the model in at build time — see backend/README.md
│   ├── requirements.txt / requirements-serve.txt
│   └── README.md
├── mobile/                # React Native (Expo) — app + web landing page
│   ├── app/               # screens (expo-router): index/landing, onboarding, home,
│   │                      #   analyzing, analysis/[videoId], history, error, +html
│   ├── components/        # landing/ sections + ui/ shared pieces (gauge, cards, guess panel)
│   ├── context/           # AnalysisContext (run/cancel/guess), ThemeContext (dark/light)
│   ├── theme/             # design tokens — single source of truth for color/type
│   ├── lib/               # api.js (real backend), mockApi.js, categories, riskLevels,
│   │                      #   youtube, oembed, storage, history  (+ __tests__/)
│   ├── vercel.json        # web deploy config (static export + SPA rewrites)
│   └── README.md
├── docs/
│   ├── api-contract.md    # source of truth for request/response format
│   └── decisions/         # short notes on why a decision was made
├── .github/workflows/     # mobile-ci.yml — lint, format, tests, web export on PRs
└── README.md              # you are here
```

## Architecture

The mobile app never runs BERT on-device. It sends a video URL to the backend; the backend does everything and returns one JSON result.

```
mobile (Expo)  --POST /analyze-->  backend (FastAPI)
                                     ├─ fetch comments   (YouTube Data API v3)
                                     ├─ infer niche      (title/description keywords → category)
                                     ├─ preprocess       (identical format to the training notebook)
                                     ├─ Rules + BERT     (geraldadli/Kratt on the HF Hub)
                                     ├─ (optional LLM pattern pass — stub in this build)
                                     └─ aggregate bot %  → JSON
```

### How a comment gets categorized

Every comment lands in **exactly one** of the four contract categories, by priority:

1. `ads_spam` — spam/link/promo regex (`app/rules.py`)
2. `copy_paste` — near-duplicate of another comment *within this video's fetched set*
3. BERT decides the rest: `P(authentic) >= KRATT_BOT_THRESHOLD` → `genuine`, else `low_effort`

Percentages use largest-remainder rounding so the four always sum to exactly 100, and `bot_percentage = 100 - genuine`.

**Key behaviors worth knowing:**

- **BERT needs a niche the raw video doesn't carry.** `app/niche.py` infers it from title/description keywords, then falls back to the video category. Duration is deliberately *not* used (see the note in that file). This is the single biggest accuracy lever — if bot% looks wrong, check niche inference before touching the threshold.
- **Rules-only fallback.** If the model can't load (offline, no torch, cold host), `/analyze` still answers using rules alone rather than failing. The health endpoint `GET /` reports whether BERT actually loaded — check it before blaming the model for a bad score.
- **`sample_flagged_comments` carries the backend's category.** The UI renders it directly and must never re-derive it from text.
- **The `low`/`medium`/`high` risk framing is UI-side only** (`mobile/lib/riskLevels.js`). The API returns percentages, nothing else.

## Getting started

### Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env            # then put your YOUTUBE_API_KEY in .env
uvicorn app.main:app --reload
```

Backend runs at `http://localhost:8000`. Interactive API docs at `/docs`, health at `/`.

> First `/analyze` downloads the ~1 GB model from the Hub (cached afterwards). For a fast dev loop that skips it entirely, set `KRATT_ENABLE_BERT=0` — you get rules-only scoring in exchange.

### Mobile app

```bash
cd mobile
npm install
cp .env.example .env            # then point EXPO_PUBLIC_API_BASE_URL at your backend
npx expo start                  # native — scan the QR code with Expo Go
npx expo start --web            # web — landing page + app at http://localhost:8081
```

The web build serves the public landing page at `/` and the same analyzer flow behind it.

## Environment variables

Both halves have their own `.env`. Neither is committed — `.env` is gitignored, and `.env.example` must stay free of real values.

**`backend/.env`** — only `YOUTUBE_API_KEY` is required; everything else has a working default. Notable knobs (full list in [`backend/.env.example`](backend/.env.example)):

| Variable | Default | What it's for |
|---|---|---|
| `YOUTUBE_API_KEY` | — | **Required.** YouTube Data API v3 key |
| `KRATT_ENABLE_BERT` | `1` | `0` = rules-only, skips the ~1 GB download |
| `KRATT_BOT_THRESHOLD` | `0.5` | Lower = catch more bots + more false positives |
| `KRATT_MAX_COMMENTS` | `300` | Bounds latency — BERT on CPU is slow |
| `KRATT_MODEL_CACHE_DIR` | *(HF default)* | Set to a **persistent** volume on hosts that wipe disk, or you re-download 1 GB every cold start |
| `KRATT_FORCE_NICHE` | *(empty)* | Pin every video to one niche for testing/demos |
| `KRATT_CORS_ORIGINS` | `*` | Comma-separated allowlist for production |

**`mobile/.env`**:

| Variable | Notes |
|---|---|
| `EXPO_PUBLIC_API_BASE_URL` | Backend base URL. **On a physical device this must be your machine's LAN IP** (`http://192.168.x.x:8000`) — `localhost` on a phone points at the phone, not your dev machine. |
| `EXPO_PUBLIC_USE_MOCK` | `1` to keep using `lib/mockApi.js` for offline UI work. Leave empty to hit the real backend. |

`EXPO_PUBLIC_*` values are **inlined at build time** — restart the Expo dev server after editing `.env`, a hot reload won't pick them up.

## Media-literacy features

These are what make Kratt a literacy tool rather than a score readout. All client-side; none need a backend endpoint.

- **Onboarding explainer** — 4-card intro to manufactured consensus, shown once, re-openable any time.
- **Guess before reveal** — the result stays hidden until you commit your own estimate, then shows "Your guess: X% — Kratt: Y%".
- **Evidence, not just a number** — the flagged comments the score was built from, each stamped with its category.
- **Source-evaluation checklist** — four actionable "before you trust this video" checks.
- **Verification history + day streak** — every analysis saved locally, with a streak on `/home`.

Details in [`mobile/README.md`](mobile/README.md).

## Deployment

- **Backend** — `backend/Dockerfile` bakes the trained model in at build time, so a cold container starts instantly and doesn't depend on the HF Hub being reachable at runtime. Same image runs on Hugging Face Spaces (Docker SDK), Render, Railway, or Fly.io. Step-by-step in [`backend/README.md`](backend/README.md).
- **Web app** — `npx expo export -p web` produces a static `dist/`. `mobile/vercel.json` configures the Vercel build plus the SPA rewrite that dynamic routes like `/analysis/<id>` need. Set `EXPO_PUBLIC_API_BASE_URL` in the host's env, and add that origin to `KRATT_CORS_ORIGINS` on the backend.

After deploying the backend, update the **Base URL (deployed)** line in [`docs/api-contract.md`](docs/api-contract.md) so both tracks agree on where the API lives.

## Contributing

### Branching

- `main` — always in a demo-able state. Don't commit directly.
- Feature branches: `feature/bert-finetune`, `feature/result-screen`, `fix/api-timeout`.
- Open a PR into `main`, get at least one review before merging.

### CI

[`.github/workflows/mobile-ci.yml`](.github/workflows/mobile-ci.yml) runs on every PR touching `mobile/`: format check → lint → unit tests → **web export**. The export is not optional — the deployed web build is the primary demo surface, so a PR that breaks it must not merge.

```bash
cd mobile && npm test        # jest (jest-expo)
npm run format && npm run lint
```

### Changing the API contract

[`docs/api-contract.md`](docs/api-contract.md) is the source of truth. Update it **first**, add a row to its change log, then update both sides — don't let the two drift silently. The last change (2026-07-26, `sample_flagged_comments`: `string[]` → `{ text, category }[]`) is exactly why `mobile/lib/api.js` carries a normalizing shim: a backend on the old shape renders empty quote marks while the percentages stay perfectly correct, so the UI looks broken for a reason nothing in the numbers reveals.

## Troubleshooting

| Symptom | Likely cause |
|---|---|
| App shows mock data | `EXPO_PUBLIC_USE_MOCK=1`, or `.env` edited without restarting the dev server |
| Network error on a physical device | `EXPO_PUBLIC_API_BASE_URL` is `localhost` — use your LAN IP |
| Web build blocked by CORS | Add the site's origin to `KRATT_CORS_ORIGINS` |
| bot% looks implausibly high | Check niche inference first (`KRATT_FORCE_NICHE` to test), then `KRATT_BOT_THRESHOLD` |
| Score seems crude, no categories from the model | BERT didn't load — check `GET /` (`bert_enabled`) |
| `youtube_quota_exceeded` | Daily YouTube Data API quota; keys are per-project and reset daily |
| Empty quotes in the evidence list | Backend on the pre-2026-07-26 contract — see the shim note above |

Error codes the app handles: `invalid_url`, `video_not_found`, `no_comments`, `youtube_quota_exceeded`, `internal_error`. Against the mock, paste a URL containing `notfound`, `nocomments`, `quota`, or `internal` to preview each state.

## Docs

- [`docs/api-contract.md`](docs/api-contract.md) — request/response format between mobile and backend
- [`docs/decisions/001-youtube-vs-tiktok.md`](docs/decisions/001-youtube-vs-tiktok.md) — why the YouTube Data API over TikTok
- [`docs/decisions/002-mobile-design-revamp.md`](docs/decisions/002-mobile-design-revamp.md) — token system, contract-first categories, deep-link recovery
- [`backend/README.md`](backend/README.md) · [`mobile/README.md`](mobile/README.md) — per-track setup and internals

## Known limitations

Stated openly in the pitch, not hidden.

- Bot/human labels are **weak-supervised** (heuristic-based), not ground truth.
- **Niche inference is keyword/category-based**, not learned — the model's input niche is a best guess, and it's the biggest source of score error. An LLM classifier here is the obvious upgrade.
- Only the **first ~300 comments** are fetched and scored (`KRATT_MAX_COMMENTS`), and reply threads with fewer than 2 replies are skipped — YouTube charges one full API call per thread regardless of reply count. So the sample skews toward top-level and popular comments.
- `copy_paste` detection only sees **within one video's fetched set** — a template copy-pasted across many videos won't register.
- The **LLM pattern pass is a stub** (`app/llm_pass.py`); the flowchart lane exists but does nothing yet.
- Subject to **daily YouTube Data API quota** — a heavy demo day can exhaust it.
