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
  - `home.jsx` — paste-link screen
  - `analyzing.jsx` — progress screen; runs the analysis and routes to the result
  - `analysis/[videoId].jsx` — result screen (score gauge, evidence-category grid, flagged comments). Results live only in memory (the API is POST-only), so on a deep link or web refresh this screen re-runs the analysis for its id.
  - `error.jsx` — error states from the contract
- `components/ui/` — reusable pieces: `ScoreGauge`, `CategoryCard`, `WovenDivider`, `AppButton`
- `components/landing/` — landing page sections
- `theme/tokens.js` — design tokens (color, type, spacing). **Single source of truth** — import from here instead of hardcoding colors/fonts in screens.
- `lib/` — `mockApi.js` (implements the contract until the backend is live), `categories.js` (breakdown keys → display copy), `riskLevels.js` (tier/level thresholds), `youtube.js` (video-id parsing)
- `context/AnalysisContext.jsx` — in-memory analysis state

## Design system

Sage board background, moss/straw/rust risk palette (rust is reserved for high-risk states), Zilla Slab + Archivo + Space Mono, flat surfaces with hairline borders. The low/medium/high framing on cards and the gauge tier are **UI heuristics** derived in `lib/riskLevels.js` — the API contract only returns percentages, so retune thresholds there.

The reasoning behind the revamp (token system, contract-first categories, the `/analysis/[videoId]` route and its deep-link recovery, English copy) is written up in [`../docs/decisions/002-mobile-design-revamp.md`](../docs/decisions/002-mobile-design-revamp.md).

## Backend

Calls the backend per [`../docs/api-contract.md`](../docs/api-contract.md). `lib/mockApi.js` stands in until `POST /analyze` is live — swap it inside `context/AnalysisContext.jsx`. Test-error keywords work against the mock: paste a URL containing `notfound`, `nocomments`, `quota`, or `internal` to preview each error state.
