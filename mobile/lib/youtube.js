// Mirrors the URL shapes accepted by lib/mockApi.js (watch?v= and youtu.be).
const VIDEO_ID_PATTERN =
  /(?:youtube\.com\/watch\?(?:.*&)?v=|youtu\.be\/)([\w-]+)/i;

export function parseVideoId(url) {
  const match = (url ?? "").trim().match(VIDEO_ID_PATTERN);
  return match ? match[1] : null;
}

export function canonicalUrl(videoId) {
  return `https://youtube.com/watch?v=${videoId}`;
}
