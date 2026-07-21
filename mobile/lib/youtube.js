// The single source of truth for YouTube URL parsing. mockApi (and later the
// real API client) and every screen validate through here — the launch bug
// where home accepted a URL that mockApi then rejected came from two regexes
// drifting apart, so no other file may define its own YouTube pattern.
//
// Regex-based on purpose: React Native's URL polyfill doesn't implement
// searchParams, so new URL() isn't a portable option across native and web.

// A YouTube video ID is exactly 11 base64url characters. Enforcing the length
// here is what rejects junk like "?v=abc" instead of passing it to the API.
const ID = "([A-Za-z0-9_-]{11})";

// Hosts we accept: youtube.com bare or with the www/m/music subdomains.
// m.youtube.com matters most — it's what the YouTube app's Share button
// produces, i.e. the most common way a phone user copies a link.
const HOST = "(?:https?:\\/\\/)?(?:(?:www|m|music)\\.)?";

// Each pattern is anchored at the start and ends with a lookahead instead of
// $, so trailing params (?si=, &t=, &list=, ?app=desktop, #fragment) are
// ignored while an ID longer than 11 chars still fails to match.
const URL_PATTERNS = [
  // watch?v=ID — v may come after other params (e.g. watch?app=desktop&v=ID)
  new RegExp(
    `^${HOST}youtube\\.com\\/watch\\?(?:[^#]*&)?v=${ID}(?![A-Za-z0-9_-])`,
    "i"
  ),
  // shorts/, embed/, and live/ path forms
  new RegExp(
    `^${HOST}youtube\\.com\\/(?:shorts|embed|live)\\/${ID}(?![A-Za-z0-9_-])`,
    "i"
  ),
  // youtu.be short links never carry a subdomain
  new RegExp(`^(?:https?:\\/\\/)?youtu\\.be\\/${ID}(?![A-Za-z0-9_-])`, "i"),
];

export function parseVideoId(url) {
  const trimmed = (url ?? "").trim();
  for (const pattern of URL_PATTERNS) {
    const match = trimmed.match(pattern);
    if (match) return match[1];
  }
  return null;
}

export function isValidYouTubeUrl(url) {
  return parseVideoId(url) !== null;
}

export function canonicalUrl(videoId) {
  return `https://youtube.com/watch?v=${videoId}`;
}

// hqdefault exists for every video (maxresdefault doesn't), so this URL is
// safe to render immediately without checking availability first.
export function thumbnailUrl(videoId) {
  return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
}
