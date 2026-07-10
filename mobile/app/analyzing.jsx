import { useEffect, useRef, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useAnalysis } from "../context/AnalysisContext";
import { parseVideoId } from "../lib/youtube";
import { color, type } from "../theme/tokens";

const STATUS_MESSAGES = [
  "Mengambil komentar",
  "Membaca pola",
  "Menghitung skor",
];
const STATUS_INTERVAL_MS = 1100;

export default function AnalyzingScreen() {
  const router = useRouter();
  const { videoUrl, runAnalysis } = useAnalysis();
  const [statusIndex, setStatusIndex] = useState(0);
  const hasStarted = useRef(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setStatusIndex((current) => (current + 1) % STATUS_MESSAGES.length);
    }, STATUS_INTERVAL_MS);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (hasStarted.current) return;
    hasStarted.current = true;

    runAnalysis(videoUrl).then((outcome) => {
      if (!outcome.ok) {
        router.replace("/error");
        return;
      }
      const videoId = parseVideoId(videoUrl);
      router.replace(videoId ? `/analysis/${videoId}` : "/home");
    });
  }, [videoUrl, runAnalysis, router]);

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <ActivityIndicator size="large" color={color.moss} />
      <Text style={styles.status}>{STATUS_MESSAGES[statusIndex]}…</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: color.bg,
    alignItems: "center",
    justifyContent: "center",
    gap: 16,
  },
  status: {
    ...type.body,
    color: color.inkMuted,
  },
});
