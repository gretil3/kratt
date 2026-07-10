import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useAnalysis } from "../context/AnalysisContext";
import AppButton from "../components/ui/AppButton";
import { color, font, hairline, radius, type } from "../theme/tokens";

export default function HomeScreen() {
  const router = useRouter();
  const { videoUrl, setVideoUrl } = useAnalysis();
  const [touched, setTouched] = useState(false);

  const isEmpty = videoUrl.trim().length === 0;

  const handleAnalyze = () => {
    setTouched(true);
    if (isEmpty) return;
    router.push("/analyzing");
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <StatusBar style="dark" />
      <View style={styles.content}>
        <View style={styles.brandRow}>
          <View style={styles.brandMark} />
          <Text style={styles.brand}>Kratt</Text>
        </View>

        <Text style={styles.heading}>Tempel link video YouTube</Text>
        <Text style={styles.subheading}>
          Kratt membaca kolom komentarnya dan menandai kemungkinan aktivitas
          bot.
        </Text>

        <TextInput
          style={styles.input}
          placeholder="https://youtube.com/watch?v=..."
          placeholderTextColor="rgba(28, 27, 24, 0.35)"
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType="url"
          value={videoUrl}
          onChangeText={setVideoUrl}
        />
        {touched && isEmpty ? (
          <Text style={styles.errorHint}>
            Tempel link dulu sebelum menganalisis.
          </Text>
        ) : null}

        <AppButton
          label="Analisis"
          onPress={handleAnalyze}
          style={styles.button}
        />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: color.bg,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
    gap: 12,
    width: "100%",
    maxWidth: 560,
    alignSelf: "center",
  },
  brandRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 12,
  },
  brandMark: {
    width: 8,
    height: 8,
    backgroundColor: color.straw,
  },
  brand: {
    fontFamily: font.slab,
    fontSize: 18,
    color: color.ink,
  },
  heading: {
    ...type.h2,
  },
  subheading: {
    ...type.body,
    color: color.inkMuted,
    marginBottom: 12,
  },
  input: {
    backgroundColor: color.surface,
    borderRadius: radius.md,
    borderWidth: hairline,
    borderColor: color.hairline,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontFamily: font.mono,
    fontSize: 14,
    color: color.ink,
  },
  errorHint: {
    ...type.small,
    color: color.rustInk,
  },
  button: {
    marginTop: 12,
    alignSelf: "stretch",
  },
});
