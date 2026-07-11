// Client-side analysis history + streak, persisted via lib/storage.js. No
// backend involvement: entries hold just what the history screen shows
// (video URL, when, bot_percentage).
import { STORAGE_KEYS, getStored, setStored } from "./storage";

// Newest first. Capped so storage can't grow unbounded.
const MAX_ENTRIES = 50;

// A deep link or web refresh re-runs the analysis for the same video; within
// this window that re-run is recovery, not a new verification worth logging.
const DUPLICATE_WINDOW_MS = 5 * 60 * 1000;

export async function getHistory() {
  const entries = await getStored(STORAGE_KEYS.history, []);
  return Array.isArray(entries) ? entries : [];
}

/**
 * @param {{videoUrl: string, botPercentage: number, timestamp?: number}} entry
 */
export async function appendHistoryEntry({ videoUrl, botPercentage, timestamp = Date.now() }) {
  const entries = await getHistory();

  const latest = entries[0];
  if (
    latest &&
    latest.videoUrl === videoUrl &&
    timestamp - latest.timestamp < DUPLICATE_WINDOW_MS
  ) {
    return entries;
  }

  const next = [{ videoUrl, botPercentage, timestamp }, ...entries].slice(
    0,
    MAX_ENTRIES
  );
  await setStored(STORAGE_KEYS.history, next);
  return next;
}

// Local calendar-day key, so a streak follows the user's clock, not UTC.
function dayKey(timestamp) {
  const d = new Date(timestamp);
  return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
}

/**
 * Consecutive days (ending today, or yesterday if today has no analysis yet)
 * with at least one analysis. 0 means the chain is broken.
 */
export function computeStreak(entries, now = Date.now()) {
  const days = new Set(entries.map((e) => dayKey(e.timestamp)));
  const DAY_MS = 24 * 60 * 60 * 1000;

  // A streak is still alive if the last analysis was yesterday.
  let cursor = now;
  if (!days.has(dayKey(cursor))) {
    cursor -= DAY_MS;
    if (!days.has(dayKey(cursor))) return 0;
  }

  let streak = 0;
  while (days.has(dayKey(cursor))) {
    streak += 1;
    cursor -= DAY_MS;
  }
  return streak;
}
