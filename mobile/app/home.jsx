import { useCallback, useEffect, useMemo, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useFocusEffect, useRouter } from "expo-router";
import { useAnalysis } from "../context/AnalysisContext";
import { useTheme } from "../context/ThemeContext";
import PillButton from "../components/ui/PillButton";
import GradientBlob from "../components/ui/GradientBlob";
import ThemeToggle from "../components/ui/ThemeToggle";
import ThemedStatusBar from "../components/ui/ThemedStatusBar";
import { accent } from "../theme/themes";
import { STORAGE_KEYS, getStored } from "../lib/storage";
import { computeStreak, getHistory } from "../lib/history";

export default function HomeScreen() {
  const router = useRouter();
  const theme = useTheme();
  const styles = useMemo(() => makeStyles(theme), [theme]);
  const { videoUrl, setVideoUrl } = useAnalysis();
  const [touched, setTouched] = useState(false);
  const [focused, setFocused] = useState(false);
  // null = still reading the flag; render a bg-colored frame instead of
  // flashing the form at someone who's about to be redirected to onboarding.
  const [onboarded, setOnboarded] = useState(null);
  const [streak, setStreak] = useState(0);

  // Re-read on focus so finishing an analysis bumps the streak on return.
  useFocusEffect(
    useCallback(() => {
      let active = true;
      getHistory().then((entries) => {
        if (active) setStreak(computeStreak(entries));
      });
      return () => {
        active = false;
      };
    }, [])
  );

  useEffect(() => {
    let active = true;
    getStored(STORAGE_KEYS.onboardingSeen, false).then((seen) => {
      if (!active) return;
      if (seen) setOnboarded(true);
      else router.replace("/onboarding");
    });
    return () => {
      active = false;
    };
  }, [router]);

  const isEmpty = videoUrl.trim().length === 0;

  const handleAnalyze = () => {
    setTouched(true);
    if (isEmpty) return;
    router.push("/analyzing");
  };

  if (!onboarded) {
    return <View style={styles.container} />;
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ThemedStatusBar />
      <ThemeToggle style={styles.toggle} />
      <View style={styles.content}>
        <View style={styles.brandRow}>
          <GradientBlob
            colors={theme.gradients.brand}
            radius={theme.radius.sm}
            style={styles.brandMark}
          />
          <Text style={styles.brand}>Kratt</Text>
        </View>

        <Text style={styles.heading}>Paste a YouTube link</Text>
        <Text style={styles.subheading}>
          Kratt reads the comment section and flags likely bot activity.
        </Text>

        <TextInput
          accessibilityLabel="YouTube video link"
          style={[styles.input, focused && styles.inputFocused]}
          placeholder="https://youtube.com/watch?v=..."
          placeholderTextColor={theme.color.inkFaint}
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType="url"
          value={videoUrl}
          onChangeText={setVideoUrl}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
        />
        {touched && isEmpty ? (
          <Text style={styles.errorHint}>Paste a link before analyzing.</Text>
        ) : null}

        <PillButton
          label="Analyze"
          onPress={handleAnalyze}
          style={styles.button}
        />

        <View style={styles.footerRow}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Reopen the manufactured consensus introduction"
            onPress={() => router.push("/onboarding")}
            hitSlop={8}
          >
            <Text style={styles.explainerText}>
              What is manufactured consensus? →
            </Text>
          </Pressable>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Open your verification history"
            onPress={() => router.push("/history")}
            hitSlop={8}
          >
            <Text style={styles.explainerText}>History →</Text>
          </Pressable>
        </View>

        {streak > 0 ? (
          <Text style={styles.streakText}>
            {streak}-DAY VERIFICATION STREAK
          </Text>
        ) : null}
      </View>
    </KeyboardAvoidingView>
  );
}

function makeStyles(theme) {
  const { color, font, radius, type, risk } = theme;
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: color.bg,
    },
    toggle: {
      position: "absolute",
      top: 20,
      right: 20,
      zIndex: 10,
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
      borderColor: accent.violet,
    },
    errorHint: {
      ...type.small,
      color: risk.high.text,
    },
    button: {
      marginTop: 12,
      alignSelf: "stretch",
    },
    footerRow: {
      marginTop: 16,
      flexDirection: "row",
      justifyContent: "center",
      flexWrap: "wrap",
      columnGap: 24,
      rowGap: 8,
    },
    explainerText: {
      ...type.small,
      color: color.inkMuted,
    },
    streakText: {
      ...type.monoLabel,
      textAlign: "center",
      marginTop: 14,
      // risk.low.text, not accent.teal: the accent fails contrast on white.
      color: risk.low.text,
    },
  });
}
