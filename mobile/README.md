# Kratt — mobile app

React Native (Expo) app: paste a YouTube link, get a bot% score with a breakdown. The same codebase ships the web build, including the public landing page.

## Setup

```bash
npm install
```

## Run

```bash
npx expo start          # native — scan the QR code with Expo Go
npx expo start --web    # web — landing page + app at http://localhost:8081
```

## Structure

- `app/` — screens (Expo Router file-based routing)
  - `index.jsx` — web: landing page; native: splash → `/home`
  - `onboarding.jsx` — first-run "manufactured consensus" explainer (4 cards); gated by an `AsyncStorage` flag and re-openable from `/home` and the landing page
  - `home.jsx` — paste-link screen; also shows the verification streak and links to the explainer and history
  - `analyzing.jsx` — progress screen; runs the analysis and routes to the result
  - `analysis/[videoId].jsx` — result screen. First asks the user to guess the bot % (guess-before-reveal), then shows the score gauge, guess-vs-Kratt comparison, evidence-category grid, flagged comments, and the source-evaluation checklist. Results live only in memory (the API is POST-only), so on a deep link or web refresh this screen re-runs the analysis for its id.
  - `history.jsx` — client-side verification history + day streak
  - `error.jsx` — error states from the contract
  - `+html.jsx` — custom web HTML shell carrying share/OG metadata (web only)
- `components/ui/` — reusable pieces: `PillButton`, `GradientBlob`, `ScoreGauge`, `CategoryCard`, `GuessPanel`, `SourceChecklist`, `ThemeToggle`, `ThemedStatusBar`
- `components/landing/` — landing page sections (hero, why-it-matters, evidence categories, how-it-works, why-Kratt + sources, closing)
- `theme/themes.js` — the design system (dark/light palettes, type, risk colors, gradients). **Single source of truth** — read it via `useTheme()` instead of hardcoding colors/fonts in screens. `theme/tokens.js` only holds the font-family names it consumes.
- `lib/` — `mockApi.js` (implements the contract until the backend is live), `categories.js` (breakdown keys → display copy), `riskLevels.js` (tier/level thresholds), `youtube.js` (video-id parsing), `storage.js` (safe `AsyncStorage` JSON wrapper + keys), `history.js` (history entries + streak logic)
- `context/AnalysisContext.jsx` — in-memory analysis state (video URL, result, and the user's pre-reveal guess)
- `context/ThemeContext.jsx` — dark/light mode state; exposes `useTheme()` / `useThemeMode()`

## Design system

Everything visual lives in `theme/themes.js` and reaches components through `useTheme()` from `context/ThemeContext.jsx`. It defines a dark theme (default) and a light theme sharing one shape: surface/ink color scales, type styles (Zilla Slab headlines, Archivo body, Space Mono labels/scores), radii, the brand gradient (violet → teal → pink) plus one gradient trio per evidence category, and per-theme risk colors (low = teal, medium = amber, high = red, each with a matching tint). The low/medium/high framing on cards and the gauge tier are **UI heuristics** derived in `lib/riskLevels.js` — the API contract only returns percentages, so retune thresholds there.

The reasoning behind the revamp (token system, contract-first categories, the `/analysis/[videoId]` route and its deep-link recovery, English copy) is written up in [`../docs/decisions/002-mobile-design-revamp.md`](../docs/decisions/002-mobile-design-revamp.md).

## Media-literacy features

Kratt isn't just a bot-score readout — it's built to teach the reader to spot manufactured consensus. These behaviours are layered on top of the analysis flow and are all **client-side**; none of them need a backend endpoint.

- **Onboarding explainer** (`app/onboarding.jsx`) — a 4-card intro (astroturfing → why social proof works → the scale of the problem → Kratt's role as a literacy trainer, not a judge). Shown once on first visit to `/home` and then re-openable any time. "Seen" state is persisted with `AsyncStorage` via `lib/storage.js`.
- **Guess before reveal** (`components/ui/GuessPanel.jsx`) — after analysis finishes, the result stays hidden until the user commits their own estimate of the bot %. The result screen then shows "Your guess: X% — Kratt: Y%" plus a neutral reflection. The guess lives in `AnalysisContext` and resets on every run, so deep-link/refresh re-runs always pass through it.
- **Source-evaluation checklist** (`components/ui/SourceChecklist.jsx`) — four actionable checks ("before you trust this video") with local-only interactive checkboxes, rendered after the flagged-comment examples.
- **Verification history + streak** (`app/history.jsx`, `lib/history.js`) — every completed analysis is saved locally (URL, timestamp, bot %). The history screen lists them newest-first with a risk-tinted score chip; `/home` shows the current consecutive-day streak. A short dedupe window keeps deep-link recovery re-runs from double-logging.
- **"Why Kratt" + sources** (`components/landing/GapSection.jsx`) — landing section contrasting score-only detectors with Kratt's show-the-evidence approach, plus a short paraphrased reading list (links only).

## Web deployment

The web build is a static export configured for shareable links:

```bash
npx expo export -p web       # → dist/ (static HTML per route + JS bundle)
```

- `app.json` sets `web.output: "static"`, so each route gets its own HTML file and `app/+html.jsx` is used as the document shell.
- `app/+html.jsx` carries the page title, description, and Open Graph / Twitter card meta for link previews. `og:image` is intentionally omitted until a real share asset exists (see the comment in that file for how to add it).
- Serving `dist/` on a static host needs an SPA-style rewrite so dynamic routes (e.g. `/analysis/<id>`) fall back to `index.html`. Locally: `npx serve dist` with a `serve.json` rewriting `**` → `/index.html`.

## Backend

Calls the backend per [`../docs/api-contract.md`](../docs/api-contract.md). `lib/mockApi.js` stands in until `POST /analyze` is live — swap it inside `context/AnalysisContext.jsx`. The backend base URL is documented in [`.env.example`](.env.example) (`EXPO_PUBLIC_API_BASE_URL`); copy it to `.env` when wiring the real API. Test-error keywords work against the mock: paste a URL containing `notfound`, `nocomments`, `quota`, or `internal` to preview each error state.
