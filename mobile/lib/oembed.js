// YouTube oEmbed lookup for the result header: title, channel name, thumb.
// Free, no API key, no quota, CORS-friendly — safe to call straight from the
// client. Callers MUST treat failure as normal (offline, private video, rate
// limit) and fall back to showing the raw URL; the result page must never
// break because this endpoint didn't answer.
export async function fetchOEmbed(videoUrl) {
  const endpoint = `https://www.youtube.com/oembed?url=${encodeURIComponent(
    videoUrl
  )}&format=json`;
  const response = await fetch(endpoint);
  if (!response.ok) {
    throw new Error(`oEmbed lookup failed: ${response.status}`);
  }
  const data = await response.json();
  return {
    title: data.title,
    authorName: data.author_name,
    thumbnailUrl: data.thumbnail_url,
  };
}
