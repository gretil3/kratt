import { createContext, useCallback, useContext, useState } from "react";
import { mockAnalyze } from "../lib/mockApi";

const AnalysisContext = createContext(null);

export function AnalysisProvider({ children }) {
  const [videoUrl, setVideoUrl] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const runAnalysis = useCallback(async (url) => {
    setError(null);
    setResult(null);

    const response = await mockAnalyze(url);

    if (response.ok) {
      setResult(response.data);
      return { ok: true };
    }

    setError(response.error);
    return { ok: false };
  }, []);

  const reset = useCallback(() => {
    setVideoUrl("");
    setResult(null);
    setError(null);
  }, []);

  const value = {
    videoUrl,
    setVideoUrl,
    result,
    error,
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
