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
import PillButton from "../components/ui/PillButton";
import GradientBlob from "../components/ui/GradientBlob";
import { color, font, gradients, radius, type } from "../theme/darkTokens";

export default function HomeScreen() {
  const router = useRouter();
  const { videoUrl, setVideoUrl } = useAnalysis();
  const [touched, setTouched] = useState(false);
  const [focused, setFocused] = useState(false);

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
      <StatusBar style="light" />
      <View style={styles.content}>
        <View style={styles.brandRow}>
          <GradientBlob colors={gradients.brand} radius={radius.sm} style={styles.brandMark} />
          <Text style={styles.brand}>Kratt</Text>
        </View>

        <Text style={styles.heading}>Paste a YouTube link</Text>
        <Text style={styles.subheading}>
          Kratt reads the comment section and flags likely bot activity.
        </Text>

        <TextInput
          style={[styles.input, focused && styles.inputFocused]}
          placeholder="https://youtube.com/watch?v=..."
          placeholderTextColor="rgba(245,245,247,0.35)"
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType="url"
          value={videoUrl}
          onChangeText={setVideoUrl}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
        />
        {touched && isEmpty ? (
          <Text style={styles.errorHint}>
            Paste a link before analyzing.
          </Text>
        ) : null}

        <PillButton
          label="Analyze"
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
    gap: 10,
    marginBottom: 12,
  },
  brandMark: {
    width: 22,
    height: 22,
  },
  brand: {
    fontFamily: font.display,
    fontSize: 18,
    color: color.ink,
  },
  heading: {
    ...type.h2,
  },
  subheading: {
    ...type.body,
    marginBottom: 12,
  },
  input: {
    backgroundColor: color.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: color.border,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontFamily: font.mono,
    fontSize: 14,
    color: color.ink,
  },
  inputFocused: {
    borderColor: "#7C5CFF",
  },
  errorHint: {
    ...type.small,
    color: "#FF9A9A",
  },
  button: {
    marginTop: 12,
    alignSelf: "stretch",
  },
});
