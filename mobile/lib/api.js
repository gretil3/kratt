// Real `POST /analyze` client. Mirrors mockApi's interface exactly, so the only
// change needed elsewhere is which module AnalysisContext imports `analyze` from.
//
// Config (Expo inlines EXPO_PUBLIC_* at build time; put these in mobile/.env):
//   EXPO_PUBLIC_API_BASE_URL    backend base URL (default http://localhost:8000)
//   EXPO_PUBLIC_USE_MOCK        "1"/"true" to keep using the local mock instead
import { mockAnalyze, ERROR_MESSAGES } from "./mockApi";

const API_URL = (process.env.EXPO_PUBLIC_API_BASE_URL ?? "http://localhost:8000").replace(
  /\/+$/,
  ""
);
const USE_MOCK = ["1", "true", "yes"].includes(
  String(process.env.EXPO_PUBLIC_USE_MOCK ?? "").toLowerCase()
);
// BERT on CPU can take a while; the analyzing screen is built for a real wait.
const REQUEST_TIMEOUT_MS = 120000;

function errorResponse(code) {
  return {
    ok: false,
    error: { error: code, message: ERROR_MESSAGES[code] ?? ERROR_MESSAGES.internal_error },
  };
}

export async function analyze(videoUrl) {
  if (USE_MOCK) return mockAnalyze(videoUrl);

  const url = (videoUrl ?? "").trim();
  // No client-side URL validation on purpose: the backend is the single source
  // of truth and accepts watch / youtu.be / shorts / bare-id shapes. Doing a
  // stricter check here would wrongly reject valid Shorts links.

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  try {
    const res = await fetch(`${API_URL}/analyze`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({ video_url: url }),
      signal: controller.signal,
    });

    const body = await res.json().catch(() => null);

    if (res.ok && body) return { ok: true, data: body };
    if (body && body.error) {
      return {
        ok: false,
        error: {
          error: body.error,
          message: body.message ?? ERROR_MESSAGES[body.error] ?? ERROR_MESSAGES.internal_error,
        },
      };
    }
    return errorResponse("internal_error");
  } catch (_e) {
    // network failure, timeout/abort, or unparseable response
    return errorResponse("internal_error");
  } finally {
    clearTimeout(timer);
  }
}
