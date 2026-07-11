# 002 — Mobile design revamp, landing page, and analysis screen

**Status:** Shipped (branch `feature/mobile-design-revamp`)
**Date:** 2026-07-10

> **Update 2026-07-11 — Decision 1 superseded by the themed system.**
> The visual direction shipped after this ADR is **not** the flat "evidence
> board" look described in Decision 1. The live source of truth is
> `mobile/theme/themes.js`: a dark/light theme pair (dark is the default,
> toggled via `context/ThemeContext.jsx` and read everywhere through
> `useTheme()`), a brand gradient trio (violet `#7C5CFF` / teal `#2FE6C8` /
> pink `#FF3EA5`) plus per-category evidence gradients, and per-theme risk
> colors (low = teal, medium = amber, high = red — tuned separately for each
> mode's contrast). Gradients and soft glows are in — "no shadows/gradients"
> no longer applies. The sage/moss/straw/rust palette is retired;
> `mobile/theme/tokens.js` now only carries the font families (Zilla Slab +
> Archivo + Space Mono, which did survive) for `themes.js` to consume.
> Decisions 2–5 (contract-first categories, client-side risk thresholds,
> routing, web landing, English copy) still stand.

## Context

The scaffolded app (PR #1) had five working screens in ad-hoc dark-navy styling with no theme file, and the web build was configured but not runnable. For the hackathon we needed a public landing page and a result screen that presents the bot score as readable evidence — sharing one codebase and one design system across web and native.

## Decisions

### 1. One token file, "evidence board" design system

All color/type/spacing lives in `mobile/theme/tokens.js`; screens import tokens instead of hardcoding styles. Direction leans on the kratt folklore (a creature assembled from straw and old tools): sage off-white board `#EEF0EA`, warm charcoal ink, deep moss green as the only general accent, straw amber used sparingly, rust red **reserved for high-risk states only**. Type is Zilla Slab (headlines) + Archivo (body/UI) + Space Mono (scores, counts, stamp chips), two weights each, loaded via `@expo-google-fonts`. Flat surfaces, hairline borders, small radii, no shadows/gradients. One signature "woven straw" divider, used once per screen.

### 2. The API contract beats the design brief

The design brief described four *evidence-signal* categories (linguistic / timing / account / network) and a response shape with `videoTitle`, per-comment `username`/`score`/`reason`, and server-sent risk levels. None of that exists in `docs/api-contract.md`, and the backend classifies comment *types*. Decision: **everything follows the contract** — the landing page and analysis screen both use ads & spam / copy-paste / low effort / genuine, the header shows the canonical video URL instead of a title, and flagged comments render as plain quoted strings.

Consequence: low/medium/high framing is a **client-side reading aid**, not API data. Thresholds live in `mobile/lib/riskLevels.js` (gauge tiers at 40/70 of `bot_percentage`; category levels at 10/25 of share) and are deliberately easy to retune. If the team wants `videoTitle` or per-comment metadata later, that's a contract change — update `docs/api-contract.md` first, per its own rules.

### 3. Routing: `/results` → `/analysis/[videoId]` with self-recovery

The result screen moved to a dynamic route so web URLs are meaningful and shareable-ish. Because the API is POST-only, results exist only in memory: if the screen mounts without a matching result (web refresh, deep link, stale context), it re-enters the `/analyzing` flow for that id instead of rendering nothing or the wrong video's data. This required gating the redirect on `useRootNavigationState()` — navigating before the root layout mounts crashes on cold loads (found by driving the web build headless).

### 4. Landing page is a web route, not a native screen

`app/index.jsx` branches on platform: web renders the landing page (sticky nav, hero, why-it-matters, evidence categories, how-to steps, closing callout/CTA); native keeps the splash → `/home` redirect. Landing sections are RN primitives consuming the same tokens, so styling isn't forked.

### 5. UI language: English

The original brief said to keep the Indonesian copy; the team switched everything to English mid-review (2026-07-10). Error message *bodies* still come from the API verbatim per the contract.

## Repairs made along the way

- **Web deps were missing** — `react-native-web`, `react-dom`, `@expo/metro-runtime` installed; `expo start --web` / `expo export -p web` now work.
- **Root `.gitignore` was swallowing `mobile/lib/`** via the Python template's `lib/` rule — `mockApi.js` had never actually been committed, so fresh clones crashed on a missing import. The rule is now negated for `mobile/lib/` and the file is tracked.

## Verification

Headless-browser drive of the web build through the full flow (landing → anchors → CTA → paste link → analyzing → result), cold deep-link recovery, error states via the mock's test keywords, and 390px mobile widths — zero console/page errors. `expo export` bundles web, iOS, and Android cleanly. Physical-device spot-check via Expo Go still recommended after pulling the branch.
