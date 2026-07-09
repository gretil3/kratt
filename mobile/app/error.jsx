import { Pressable, StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useAnalysis } from "../context/AnalysisContext";

const ERROR_TITLES = {
  invalid_url: "That's not a valid link",
  video_not_found: "Video not found",
  no_comments: "No comments to analyze",
  youtube_quota_exceeded: "YouTube quota hit",
  internal_error: "Something broke",
};

const FALLBACK_TITLE = "Something went wrong";
const FALLBACK_MESSAGE = "Please try again.";

export default function ErrorScreen() {
  const router = useRouter();
  const { error, reset } = useAnalysis();

  const title = error ? ERROR_TITLES[error.error] ?? FALLBACK_TITLE : FALLBACK_TITLE;
  const message = error?.message ?? FALLBACK_MESSAGE;

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <Text style={styles.icon}>⚠️</Text>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.message}>{message}</Text>

      <Pressable
        style={({ pressed }) => [
          styles.button,
          pressed && styles.buttonPressed,
        ]}
        onPress={() => {
          reset();
          router.replace("/home");
        }}
      >
        <Text style={styles.buttonText}>Try again</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0B0F1A",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
    gap: 8,
  },
  icon: {
    fontSize: 40,
    marginBottom: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#FFFFFF",
    textAlign: "center",
  },
  message: {
    fontSize: 14,
    color: "#8A93A6",
    textAlign: "center",
    marginBottom: 24,
  },
  button: {
    backgroundColor: "#5B6CFF",
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 32,
    alignItems: "center",
  },
  buttonPressed: {
    opacity: 0.85,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
});
