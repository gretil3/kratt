# 001 — YouTube Data API over TikTok

**Status:** Decided
**Date:** _fill in_

## Context

Kratt's original concept targeted TikTok, framed around the Dead Internet Theory and TikTok's volatility in audience growth. During planning, the team weighed TikTok against YouTube as the data source for the hackathon build.

## Decision

Use the **YouTube Data API** as the comment data source instead of TikTok.

## Reasoning

- **Official access**: YouTube Data API v3 is legal, documented, and has a workable quota. TikTok has no official public comment API — third-party access means scraping, which risks blocks and ToS violations.
- **Research precedent**: Google/Jigsaw's Perspective API and Tune already tackle toxic/spam comment detection on YouTube, Twitter, Reddit, and Facebook — giving a mature reference point for heuristic design. No comparable public research infrastructure exists for TikTok.
- **Text quality**: YouTube comments tend to be longer and more varied, which suits BERT's strength at reading sentence-level context. TikTok comments are often too short (emoji, a few words) to classify as reliably.
- **Scale**: Pulling a large comment volume (tens to hundreds of thousands) is realistic through an official API; scraping TikTok at that scale is fragile.

## Consequences

- The pitch narrative shifts from "TikTok slips in bots" to a platform-agnostic framing: comment-section manipulation is a problem across major platforms, and Kratt demonstrates the solution on YouTube.
- Dataset collection can start immediately in week 1 without building/maintaining a scraper.
