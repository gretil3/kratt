import { StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useAnalysis } from "../context/AnalysisContext";
import PillButton from "../components/ui/PillButton";
import { color, font, radius, risk, type } from "../theme/darkTokens";

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

  const title = error
    ? ERROR_TITLES[error.error] ?? FALLBACK_TITLE
    : FALLBACK_TITLE;
  // Message body comes from the API response as-is (docs/api-contract.md).
  const message = error?.message ?? FALLBACK_MESSAGE;

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <View style={styles.stamp}>
        <Text style={styles.stampText}>ERROR</Text>
      </View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.message}>{message}</Text>

      <PillButton
        label="Try again"
        onPress={() => {
          reset();
          router.replace("/home");
        }}
        style={styles.button}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: color.bg,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
    gap: 8,
  },
  stamp: {
    backgroundColor: risk.high.tint,
    borderRadius: radius.sm,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginBottom: 10,
  },
  stampText: {
    fontFamily: font.monoBold,
    fontSize: 12,
    letterSpacing: 1.5,
    color: risk.high.text,
  },
  title: {
    ...type.h2,
    textAlign: "center",
  },
  message: {
    ...type.body,
    textAlign: "center",
    marginBottom: 24,
    maxWidth: 420,
  },
  button: {
    paddingHorizontal: 32,
  },
});
