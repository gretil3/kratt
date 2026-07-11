import { createContext, useCallback, useContext, useState } from "react";
import { mockAnalyze } from "../lib/mockApi";
import { appendHistoryEntry } from "../lib/history";
import { canonicalUrl, parseVideoId } from "../lib/youtube";

const AnalysisContext = createContext(null);

export function AnalysisProvider({ children }) {
  const [videoUrl, setVideoUrl] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  // The user's pre-reveal estimate of bot_percentage (0–100). null means "not
  // guessed yet", which is what gates the result screen behind the guess step.
  const [guess, setGuess] = useState(null);

  const runAnalysis = useCallback(async (url) => {
    setError(null);
    setResult(null);
    setGuess(null);

    const response = await mockAnalyze(url);

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
  }, []);

  const reset = useCallback(() => {
    setVideoUrl("");
    setResult(null);
    setError(null);
    setGuess(null);
  }, []);

  const value = {
    videoUrl,
    setVideoUrl,
    result,
    error,
    guess,
    setGuess,
    runAnalysis,
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
