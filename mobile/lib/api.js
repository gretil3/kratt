// Real `POST /analyze` client. Mirrors mockApi's interface exactly, so the only
// change needed elsewhere is which module AnalysisContext imports `analyze` from.
//
// Config (Expo inlines EXPO_PUBLIC_* at build time; put these in mobile/.env):
//   EXPO_PUBLIC_API_BASE_URL    backend base URL (default http://localhost:8000)
//   EXPO_PUBLIC_USE_MOCK        "1"/"true" to keep using the local mock instead
import { Platform } from "react-native";
import { mockAnalyze, ERROR_MESSAGES } from "./mockApi";

// The raw env value is logged too: a stray leading space or trailing slash in
// mobile/.env is invisible in the file but changes the URL that gets called.
const RAW_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;
const API_URL = (RAW_BASE_URL ?? "http://localhost:8000").trim().replace(/\/+$/, "");
const USE_MOCK = ["1", "true", "yes"].includes(
  String(process.env.EXPO_PUBLIC_USE_MOCK ?? "").toLowerCase()
);
// BERT on CPU can take a while, especially with many comments (20k+ takes ~8 min).
const REQUEST_TIMEOUT_MS = 600_000; // 10 minutes

function errorResponse(code) {
  return {
    ok: false,
    error: { error: code, message: ERROR_MESSAGES[code] ?? ERROR_MESSAGES.internal_error },
  };
}

// Compatibility shim for the 2026-07-26 contract change (see the changelog in
// docs/api-contract.md): `sample_flagged_comments` went from `string[]` to
// `{ text, category }[]`. A backend still on the old shape hands the UI bare
// strings, `comment.text` reads back undefined, and the evidence rows render as
// a pair of empty quotes with a blank category chip — the screen looks broken
// while the percentages stay perfectly correct, because that change touched
// nothing else. Normalising here keeps that failure legible instead of silent.
// The real fix is to point EXPO_PUBLIC_API_BASE_URL at a current backend; this
// only decides how the app behaves when it isn't.
function normalizeFlaggedComments(samples) {
  if (!Array.isArray(samples)) return [];
  const normalized = samples
    .map((sample) => {
      // Current shape: already an object with a usable text field.
      if (sample && typeof sample === "object") {
        const text = typeof sample.text === "string" ? sample.text : "";
        return { text, category: sample.category };
      }
      // Pre-2026-07-26 shape: a bare string, with no category to render.
      if (typeof sample === "string") return { text: sample, category: undefined };
      return { text: "", category: undefined };
    })
    // An empty row is worse than no row: it reads as a bug, not as evidence.
    .filter((sample) => sample.text.trim().length > 0);

  const dropped = samples.length - normalized.length;
  if (dropped > 0) {
    debugLog(
      `WARNING: dropped ${dropped}/${samples.length} flagged comment(s) with no text — ` +
        `the backend at ${API_URL} is likely on the pre-2026-07-26 string[] contract`
    );
  }
  return normalized;
}

// `externalSignal` lets a caller (AnalysisContext's cancelAnalysis) cancel the
// request early, e.g. when the user navigates away mid-analysis.
// Temporary platform-comparison instrumentation. Every line is prefixed
// [kratt-api] so it can be filtered in the browser console and in the Expo /
// device logs, and the two platforms can be diffed line for line.
const DEBUG = true;
function debugLog(...args) {
  if (DEBUG) console.log(`[kratt-api][${Platform.OS}]`, ...args);
}

export async function analyze(videoUrl, externalSignal) {
  if (USE_MOCK) {
    debugLog("USE_MOCK is on -> returning lib/mockApi.js data, NOT the backend");
    return mockAnalyze(videoUrl);
  }

  const url = (videoUrl ?? "").trim();
  // No client-side URL validation on purpose: the backend is the single source
  // of truth and accepts watch / youtu.be / shorts / bare-id shapes. Doing a
  // stricter check here would wrongly reject valid Shorts links.

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  const onExternalAbort = () => controller.abort();
  externalSignal?.addEventListener("abort", onExternalAbort);
  const endpoint = `${API_URL}/analyze`;
  const startedAt = Date.now();
  debugLog("REQUEST", {
    endpoint,
    rawEnvValue: JSON.stringify(RAW_BASE_URL), // quoted so whitespace is visible
    useMock: USE_MOCK,
    videoUrl: url,
  });
  try {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({ video_url: url }),
      signal: controller.signal,
    });

    // Read as text first so the RAW bytes can be logged: a JSON-parse
    // difference between platforms is invisible once res.json() has run.
    const raw = await res.text();
    let body = null;
    try {
      body = JSON.parse(raw);
    } catch (parseError) {
      debugLog("RESPONSE BODY IS NOT JSON", {
        status: res.status,
        first300Chars: raw.slice(0, 300),
        parseError: String(parseError),
      });
    }

    const samples = body?.sample_flagged_comments;
    debugLog("RESPONSE", {
      status: res.status,
      ok: res.ok,
      elapsedMs: Date.now() - startedAt,
      contentType: res.headers?.get?.("content-type"),
      rawLength: raw.length,
      bot_percentage: body?.bot_percentage,
      breakdown: body?.breakdown,
      total_comments_analyzed: body?.total_comments_analyzed,
      sampleCount: Array.isArray(samples) ? samples.length : `NOT AN ARRAY (${typeof samples})`,
    });
    // Logged separately and one per line: nested arrays get collapsed to
    // "[Object]" in the Expo/Metro console, which is exactly the field in
    // question here.
    if (Array.isArray(samples)) {
      samples.forEach((sample, i) => {
        debugLog(
          `SAMPLE ${i + 1}/${samples.length}`,
          `category=${sample?.category}`,
          `len=${sample?.text?.length}`,
          `text=${JSON.stringify(sample?.text)}`
        );
      });
    } else {
      debugLog("SAMPLES MISSING — raw tail:", raw.slice(-500));
    }

    if (res.ok && body) {
      return {
        ok: true,
        data: { ...body, sample_flagged_comments: normalizeFlaggedComments(samples) },
      };
    }
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
    if (externalSignal?.aborted) {
      // caller cancelled on purpose -- not a real failure, don't show an error
      return { ok: false, cancelled: true };
    }
    // network failure, timeout, or unparseable response
    debugLog("REQUEST FAILED", {
      endpoint,
      elapsedMs: Date.now() - startedAt,
      name: _e?.name,
      message: _e?.message,
    });
    console.error("[lib/api] analyze request failed:", _e);
    return errorResponse("internal_error");
  } finally {
    clearTimeout(timer);
    externalSignal?.removeEventListener("abort", onExternalAbort);
  }
}
