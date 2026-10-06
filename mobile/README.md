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
  - `index.jsx` — the landing page (its "Try it now" panel embeds the paste form)
  - `home.jsx` — paste-link screen; links to history
  - `analyzing.jsx` — progress screen (bucket head with scanning eyes); runs the analysis and routes to the result
  - `analysis/[videoId].jsx` — result screen: the score with its tier, the 100-straw breakdown bar, evidence-category cards, flagged comments, and the source-evaluation checklist. Results live only in memory (the API is POST-only), so on a deep link or web refresh this screen re-runs the analysis for its id.
  - `history.jsx` — client-side verification history + day streak
  - `error.jsx` — error states from the contract
  - `+html.jsx` — custom web HTML shell carrying share/OG metadata (web only)
- `components/ui/` — reusable pieces: `Button`, `PasteForm` (shared by `/home` and the landing panel), `Stamp` (category tag), `StrawBar`, `CategoryCard`, `VideoHeader`, `SourceChecklist`, `ThemedStatusBar`
- `components/kratt/` — the Kratt illustrations: `KrattFigure` (hero), `BucketHead` (scalable logo/mascot), `KrattEyes` (blink/scan animation), `Stripes` (straw and twine textures as SVG patterns, so they render on native too)
- `components/landing/` — landing page sections (hero, who-is-Kratt, why-it-matters, evidence categories, how-it-works, why-Kratt + sources, about + try-it panel + footer)
- `theme/themes.js` — the design system (palette, category colors, type, risk colors, material swatches). **Single source of truth** — read it via `useTheme()` instead of hardcoding colors/fonts in screens. `theme/tokens.js` only holds the font-family names it consumes; `theme/webStyle.js` gates web-only CSS (box shadows, backdrop blur).
- `lib/` — `mockApi.js` (implements the contract until the backend is live), `categories.js` (breakdown keys → display copy), `riskLevels.js` (tier/level thresholds), `youtube.js` (video-id parsing), `storage.js` (safe `AsyncStorage` JSON wrapper + keys), `history.js` (history entries + streak logic)
- `context/AnalysisContext.jsx` — in-memory analysis state (video URL, result)
- `context/ThemeContext.jsx` — provides the theme via `useTheme()` and opts the web page out of browser "force dark" repainting

## Design system

Everything visual lives in `theme/themes.js` and reaches components through `useTheme()` from `context/ThemeContext.jsx`. It's a single warm, dark "straw and tin" theme: surface/ink color scales, straw-gold accent and ember highlight, type styles (Bricolage Grotesque headlines, Schibsted Grotesk body, Space Mono labels/scores), one color per evidence category (spam = ember, copy-paste = blue, low effort = pink, genuine = green), risk colors (low = green, medium = gold, high = ember, each with a matching tint), and the straw/twine/tin swatches the illustrations are drawn from. The low/medium/high framing on cards and the gauge tier are **UI heuristics** derived in `lib/riskLevels.js` — the API contract only returns percentages, so retune thresholds there.

The reasoning behind the revamp (token system, contract-first categories, the `/analysis/[videoId]` route and its deep-link recovery, English copy) is written up in [`../docs/decisions/002-mobile-design-revamp.md`](../docs/decisions/002-mobile-design-revamp.md).

## Media-literacy features

Kratt isn't just a bot-score readout — it's built to teach the reader to spot manufactured consensus. These behaviours are layered on top of the analysis flow and are all **client-side**; none of them need a backend endpoint.

- **Source-evaluation checklist** (`components/ui/SourceChecklist.jsx`) — four actionable checks ("before you trust this video") with local-only interactive checkboxes, rendered after the flagged-comment examples.
- **Verification history + streak** (`app/history.jsx`, `lib/history.js`) — every completed analysis is saved locally (URL, timestamp, bot %). The history screen lists them newest-first with a risk-tinted score chip, under the current consecutive-day streak. A short dedupe window keeps deep-link recovery re-runs from double-logging.
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
