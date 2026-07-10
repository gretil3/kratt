import { StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useAnalysis } from "../context/AnalysisContext";
import AppButton from "../components/ui/AppButton";
import { color, font, radius, type } from "../theme/tokens";

const ERROR_TITLES = {
  invalid_url: "Link tidak valid",
  video_not_found: "Video tidak ditemukan",
  no_comments: "Tidak ada komentar untuk dianalisis",
  youtube_quota_exceeded: "Kuota YouTube sedang habis",
  internal_error: "Ada gangguan di server",
};

const FALLBACK_TITLE = "Terjadi kesalahan";
const FALLBACK_MESSAGE = "Silakan coba lagi.";

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
      <StatusBar style="dark" />
      <View style={styles.stamp}>
        <Text style={styles.stampText}>GAGAL</Text>
      </View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.message}>{message}</Text>

      <AppButton
        label="Coba lagi"
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
    backgroundColor: color.rustTint,
    borderRadius: radius.sm,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginBottom: 10,
  },
  stampText: {
    fontFamily: font.monoBold,
    fontSize: 12,
    letterSpacing: 1.5,
    color: color.rustInk,
  },
  title: {
    ...type.h2,
    textAlign: "center",
  },
  message: {
    ...type.body,
    color: color.inkMuted,
    textAlign: "center",
    marginBottom: 24,
    maxWidth: 420,
  },
  button: {
    paddingHorizontal: 32,
  },
});
