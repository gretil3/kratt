import { useEffect, useMemo, useRef, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { useAnalysis } from "../context/AnalysisContext";
import { useTheme } from "../context/ThemeContext";
import { parseVideoId } from "../lib/youtube";
import GradientBlob from "../components/ui/GradientBlob";
import ThemedStatusBar from "../components/ui/ThemedStatusBar";

const STATUS_MESSAGES = [
  "Pulling comments",
  "Reading patterns",
  "Finishing the count",
];
const STATUS_INTERVAL_MS = 1100;

export default function AnalyzingScreen() {
  const router = useRouter();
  const theme = useTheme();
  const styles = useMemo(() => makeStyles(theme), [theme]);
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
      <ThemedStatusBar />
      <View style={styles.glow}>
        <GradientBlob colors={theme.gradients.brand} style={StyleSheet.absoluteFill} />
      </View>
      <ActivityIndicator size="large" color={theme.color.ink} />
      <Text style={styles.status}>{STATUS_MESSAGES[statusIndex]}…</Text>
    </View>
  );
}

function makeStyles(theme) {
  const { color, type } = theme;
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: color.bg,
      alignItems: "center",
      justifyContent: "center",
      gap: 16,
    },
    glow: {
      position: "absolute",
      width: 420,
      height: 420,
      borderRadius: 210,
      overflow: "hidden",
      opacity: 0.35,
    },
    status: {
      ...type.body,
      color: color.inkMuted,
    },
  });
}
