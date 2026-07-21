import { createContext, useCallback, useContext, useRef, useState } from "react";
import { analyze } from "../lib/api";
import { appendHistoryEntry } from "../lib/history";
import { canonicalUrl, parseVideoId } from "../lib/youtube";

const AnalysisContext = createContext(null);

export function AnalysisProvider({ children }) {
  const [videoUrl, setVideoUrl] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  // The user's pre-reveal estimate of bot_percentage (0–100). null means "not
  // guessed yet", which is what gates the reveal behind the guess step.
  const [guess, setGuess] = useState(null);
  // Controller for the in-flight request, so navigating away (Cancel) can
  // actually stop it instead of letting a stale response navigate later.
  const abortRef = useRef(null);

  const cancelAnalysis = useCallback(() => {
    abortRef.current?.abort();
    abortRef.current = null;
  }, []);

  const runAnalysis = useCallback(
    async (url) => {
      // A new run supersedes any in-flight one (e.g. re-analyze after back).
      cancelAnalysis();
      const controller = new AbortController();
      abortRef.current = controller;

      setError(null);
      setResult(null);
      setGuess(null);

      const response = await analyze(url, controller.signal);

      if (response.cancelled) {
        // cancelAnalysis() fired (e.g. the user navigated away) -- the caller
        // has already moved on, so don't touch state for a stale request.
        return { ok: false, cancelled: true };
      }

      if (response.ok) {
        setResult(response.data);
        // Log to the local verification history (fire-and-forget — a storage
        // hiccup must not fail the analysis). Canonical URL so the same video
        // dedupes regardless of which URL shape was pasted.
        const videoId = parseVideoId(url);
        appendHistoryEntry({
          videoUrl: videoId ? canonicalUrl(videoId) : url.trim(),
          botPercentage: response.data.bot_percentage,
        });
        return { ok: true };
      }

      setError(response.error);
      return { ok: false };
    },
    [cancelAnalysis]
  );

  const reset = useCallback(() => {
    cancelAnalysis();
    setVideoUrl("");
    setResult(null);
    setError(null);
    setGuess(null);
  }, [cancelAnalysis]);

  const value = {
    videoUrl,
    setVideoUrl,
    result,
    error,
    guess,
    setGuess,
    runAnalysis,
    cancelAnalysis,
    reset,
  };

  return (
    <AnalysisContext.Provider value={value}>
      {children}
    </AnalysisContext.Provider>
  );
}

export function useAnalysis() {
  const context = useContext(AnalysisContext);
  if (!context) {
    throw new Error("useAnalysis must be used within an AnalysisProvider");
  }
  return context;
}
