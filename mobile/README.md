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
  - `onboarding.jsx` — first-run "manufactured consensus" explainer (4 cards, each with a line-art figure or a sourced statistic over its gradient); gated by an `AsyncStorage` flag and re-openable from `/home` and the landing page
  - `home.jsx` — paste-link screen with inline URL validation and a paste button; links to the explainer and history
  - `analyzing.jsx` — runs the analysis while the user locks in their own bot-% guess (guess-before-reveal happens here, during the wait); cancellable
  - `analysis/[videoId].jsx` — result screen: video header (oEmbed title/thumbnail), score gauge, composition bar, guess-vs-Kratt comparison, evidence-category grid, flagged comments with category chips, the source-evaluation checklist, and the "why this score can be wrong" card. Results live only in memory (the API is POST-only), so on a deep link or web refresh this screen re-runs the analysis for its id.
  - `history.jsx` — client-side verification history; the day streak lives here (not on `/home`)
  - `error.jsx` — error states from the contract
  - `+html.jsx` — custom web HTML shell carrying share/OG metadata, including the `og:image` link-preview card (web only)
- `components/ui/` — reusable pieces: `PillButton`, `GradientBlob`, `ScoreGauge`, `CategoryCard`, `CompositionBar`, `VideoHeader`, `GuessPanel`, `SourceChecklist`, `LimitationsCard`, `OnboardingFigure`, `ConstellationBackground`, `ThemeToggle`, `ThemedStatusBar`
- `components/landing/` — landing page sections (hero, why-it-matters, evidence categories, how-it-works, why-Kratt + limits + sources, closing)
- `theme/themes.js` — the design system (dark/light palettes, type, risk colors, gradients). **Single source of truth** — read it via `useTheme()` instead of hardcoding colors/fonts in screens. `theme/tokens.js` only holds the font-family names it consumes.
- `lib/` — `mockApi.js` (implements the contract until the backend is live), `categories.js` (breakdown keys → display copy plus each category's `example` and teaching `tell`), `riskLevels.js` (gauge tier thresholds), `flagReasons.js` (client-side category chip for flagged samples — stopgap until the contract carries one), `oembed.js` (video title/thumbnail lookup), `youtube.js` (video-id parsing), `storage.js` (safe `AsyncStorage` JSON wrapper + keys), `history.js` (history entries + streak logic)
- `context/AnalysisContext.jsx` — in-memory analysis state (video URL, result, and the user's pre-reveal guess)
- `context/ThemeContext.jsx` — dark/light mode state; exposes `useTheme()` / `useThemeMode()`

## Design system

Everything visual lives in `theme/themes.js` and reaches components through `useTheme()` from `context/ThemeContext.jsx`. It defines a dark theme (default) and a light theme sharing one shape: surface/ink color scales, type styles (Zilla Slab headlines, Archivo body, Space Mono labels/scores), radii, the brand gradient (violet → teal → pink) plus one gradient trio per evidence category, and per-theme risk colors (low = teal, medium = amber, high = red, each with a matching tint). The gauge tier is a **UI heuristic** derived in `lib/riskLevels.js` — the API contract only returns percentages, so retune thresholds there. Category cards show a proportional mini bar instead of a Low/Medium/High badge (a categorical verdict is an authority claim the model can't back).

Result-screen cards carry a left border accent that says what _kind_ of statement each one is: violet = algorithmic evidence, pink = the user's own manual checks, amber = a caution about the measurement itself, teal/amber tint = guess calibration. On the landing page, the "What Kratt can't see" block is deliberately a dashed, unfilled card — a limitation should not dress like a feature.

The reasoning behind the revamp (token system, contract-first categories, the `/analysis/[videoId]` route and its deep-link recovery, English copy) is written up in [`../docs/decisions/002-mobile-design-revamp.md`](../docs/decisions/002-mobile-design-revamp.md).

## Media-literacy features

Kratt isn't just a bot-score readout — it's built to teach the reader to spot manufactured consensus. These behaviours are layered on top of the analysis flow and are all **client-side**; none of them need a backend endpoint.

- **Onboarding explainer** (`app/onboarding.jsx`, figures in `components/ui/OnboardingFigure.jsx`) — a 4-card intro (astroturfing → why social proof works → the scale of the problem → Kratt's role as a literacy trainer, not a judge). Each card's gradient blob carries its concept as thin line art; card 3 instead shows a verified statistic — Varol et al. 2017's estimate that 9–15% of active Twitter accounts were bots, cited as `[1]` into the landing page's Sources list and scoped honestly (one platform, one year, accounts — not YouTube comments). Shown once on first visit to `/home` and then re-openable any time; "seen" state is persisted with `AsyncStorage` via `lib/storage.js`.
- **Guess before reveal** (`components/ui/GuessPanel.jsx`, hosted by `app/analyzing.jsx`) — the wait is thinking time: while the analysis runs, the user commits their own estimate of the bot %, and the result only shows once both exist. The result screen then shows "Your guess: X% — Kratt: Y%" plus a neutral reflection. The guess lives in `AnalysisContext` and resets on every run, so deep-link/refresh re-runs always pass through it.
- **Category "tells"** (`lib/categories.js`, rendered by `CategoryCard` in explainer mode) — each evidence category ships a realistic example comment and the concrete thing a human should look for (e.g. genuine comments refer to something that only happens in _this_ video). Landing page only; the result screen shows measurements, not lessons — a split enforced by a test.
- **Stated limits** — the landing page's "What Kratt can't see" block (`GapSection`) says plainly that Kratt reads comment content, not posting times, account age, or cross-video account networks; the result screen's `LimitationsCard` ("Why this score can be wrong") covers short/second-language comments, copied-but-genuine text, and score-as-starting-point. Teaching that a detector has known failure modes _is_ the media literacy.
- **Source-evaluation checklist** (`components/ui/SourceChecklist.jsx`) — four actionable checks ("before you trust this video") with local-only interactive checkboxes, rendered after the flagged-comment examples.
- **Verification history + streak** (`app/history.jsx`, `lib/history.js`) — every completed analysis is saved locally (URL, timestamp, bot %). The history screen lists them newest-first with a risk-tinted score chip and the current consecutive-day streak. A short dedupe window keeps deep-link recovery re-runs from double-logging.
- **"Why Kratt" + verified sources** (`components/landing/GapSection.jsx`) — landing section contrasting score-only detectors with Kratt's show-the-evidence approach, followed by the "What Kratt can't see" block and a numbered reading list ([1] Varol et al. 2017, [2] Ferrara et al. 2016, [3] Civic Online Reasoning, [4] UNESCO's MIL Curriculum). Every URL was opened and verified against the actual page; every "researchers found…" claim in the app traces to this list.

## Web deployment

The web build is a static export configured for shareable links:

```bash
npx expo export -p web       # → dist/ (static HTML per route + JS bundle)
```

- `app.json` sets `web.output: "static"`, so each route gets its own HTML file and `app/+html.jsx` is used as the document shell.
- `app/+html.jsx` carries the page title, description, and Open Graph / Twitter card meta for link previews, including the `og:image` share card (`public/og-image.png`).
- Serving `dist/` on a static host needs an SPA-style rewrite so dynamic routes (e.g. `/analysis/<id>`) fall back to `index.html`. Locally: `npx serve dist` with a `serve.json` rewriting `**` → `/index.html`. `vercel.json` carries the same rewrite for Vercel deploys.

## Quality checks

```bash
npm run lint            # expo lint (eslint)
npm test                # jest — lib unit tests + component render smoke tests
npm run format:check    # prettier
```

CI (`.github/workflows/mobile-ci.yml`) runs format check, lint, tests, and the web export on every PR that touches `mobile/` — the deployed web build is the primary demo surface, so a PR that breaks it must not merge.

## Backend

Calls the backend per [`../docs/api-contract.md`](../docs/api-contract.md). `lib/mockApi.js` stands in until `POST /analyze` is live — swap it inside `context/AnalysisContext.jsx`. The backend base URL is documented in [`.env.example`](.env.example) (`EXPO_PUBLIC_API_BASE_URL`); copy it to `.env` when wiring the real API. Test-error keywords work against the mock: paste a URL containing `notfound`, `nocomments`, `quota`, or `internal` to preview each error state.
