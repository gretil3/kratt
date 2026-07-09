import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useAnalysis } from "../context/AnalysisContext";

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
      <StatusBar style="light" />
      <View style={styles.content}>
        <Text style={styles.heading}>Paste a YouTube link</Text>
        <Text style={styles.subheading}>
          Kratt reads the comment section and flags likely bot activity.
        </Text>

        <TextInput
          style={styles.input}
          placeholder="https://youtube.com/watch?v=..."
          placeholderTextColor="#5C6478"
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType="url"
          value={videoUrl}
          onChangeText={setVideoUrl}
        />
        {touched && isEmpty ? (
          <Text style={styles.errorHint}>Paste a link before analyzing.</Text>
        ) : null}

        <Pressable
          style={({ pressed }) => [
            styles.button,
            pressed && styles.buttonPressed,
          ]}
          onPress={handleAnalyze}
        >
          <Text style={styles.buttonText}>Analyze</Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0B0F1A",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
    gap: 12,
  },
  heading: {
    fontSize: 24,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  subheading: {
    fontSize: 14,
    color: "#8A93A6",
    marginBottom: 12,
  },
  input: {
    backgroundColor: "#151B2C",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#262E45",
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    color: "#FFFFFF",
  },
  errorHint: {
    color: "#F87171",
    fontSize: 13,
  },
  button: {
    marginTop: 12,
    backgroundColor: "#5B6CFF",
    borderRadius: 12,
    paddingVertical: 16,
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
