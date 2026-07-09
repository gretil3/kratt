import { useEffect, useRef, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useAnalysis } from "../context/AnalysisContext";

const STATUS_MESSAGES = [
  "Pulling comments",
  "Reading patterns",
  "Finishing the count",
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
      router.replace(outcome.ok ? "/results" : "/error");
    });
  }, [videoUrl, runAnalysis, router]);

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <ActivityIndicator size="large" color="#5B6CFF" />
      <Text style={styles.status}>{STATUS_MESSAGES[statusIndex]}…</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0B0F1A",
    alignItems: "center",
    justifyContent: "center",
    gap: 16,
  },
  status: {
    fontSize: 16,
    color: "#C7CCDA",
  },
});
