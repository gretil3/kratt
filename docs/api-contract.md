# API contract — Kratt

This is the source of truth for the format exchanged between `mobile/` and `backend/`. Update this file first if the format needs to change, then update both sides to match — don't let the two drift apart silently.

**Base URL (local dev):** `http://localhost:8000`
**Base URL (deployed):** _fill in once backend is deployed, e.g. Render/Railway URL_

---

## `POST /analyze`

Analyzes the comment section of a YouTube video and returns a bot-likelihood breakdown.

### Request

```json
{
  "video_url": "https://youtube.com/watch?v=dQw4w9WgXcQ"
}
```

| Field | Type | Required | Notes |
|---|---|---|---|
| `video_url` | string | yes | Full YouTube video URL |

### Response — `200 OK`

```json
{
  "bot_percentage": 67,
  "breakdown": {
    "ads_spam": 24,
    "copy_paste": 18,
    "low_effort": 25,
    "genuine": 33
  },
  "total_comments_analyzed": 1214,
  "sample_flagged_comments": [
    { "text": "Great content sir, check my page for free crypto", "category": "ads_spam" },
    { "text": "First!!!!", "category": "low_effort" }
  ]
}
```

| Field | Type | Notes |
|---|---|---|
| `bot_percentage` | number (0–100) | `100 - breakdown.genuine`, rounded |
| `breakdown` | object | Four percentages, should sum to ~100 |
| `breakdown.ads_spam` | number (0–100) | Promotional/spam links, scam patterns |
| `breakdown.copy_paste` | number (0–100) | Near-duplicate comments within this video's comment section |
| `breakdown.low_effort` | number (0–100) | Generic/templated short phrases |
| `breakdown.genuine` | number (0–100) | Comments not flagged by any bot heuristic |
| `total_comments_analyzed` | integer | How many comments were pulled and scored |
| `sample_flagged_comments` | object[] | A few example flagged comments for the UI to display as evidence. Each is `{ text, category }` — see below |
| `sample_flagged_comments[].text` | string | The comment text |
| `sample_flagged_comments[].category` | string | The category the backend assigned to this comment during scoring — one of `ads_spam`, `copy_paste`, `low_effort` (never `genuine`; only flagged comments appear here). The UI displays this directly and must not re-derive it. |

### Error responses

```json
{
  "error": "invalid_url",
  "message": "The provided URL is not a valid YouTube video link."
}
```

| `error` code | Meaning | Suggested HTTP status |
|---|---|---|
| `invalid_url` | URL isn't a valid YouTube video link | 400 |
| `video_not_found` | Video doesn't exist or is private | 404 |
| `no_comments` | Video has comments disabled or zero comments | 422 |
| `youtube_quota_exceeded` | YouTube Data API quota hit | 503 |
| `internal_error` | Unhandled server error | 500 |

---

## Change log

| Date | Change | Author |
|---|---|---|
| _fill in_ | Initial draft | David |
| 2026-07-26 | `sample_flagged_comments` changed from `string[]` to `{ text, category }[]`, carrying the backend's computed per-comment category so the UI stops re-guessing it client-side | David |

When you change this contract, add a row here so the other track knows what shifted.
