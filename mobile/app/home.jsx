import { useEffect, useMemo, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  useWindowDimensions,
} from "react-native";
import { useRouter } from "expo-router";
import * as Clipboard from "expo-clipboard";
import { useAnalysis } from "../context/AnalysisContext";
import { useTheme } from "../context/ThemeContext";
import PillButton from "../components/ui/PillButton";
import GradientBlob from "../components/ui/GradientBlob";
import ThemeToggle from "../components/ui/ThemeToggle";
import ThemedStatusBar from "../components/ui/ThemedStatusBar";
import { accent } from "../theme/themes";
import { STORAGE_KEYS, getStored } from "../lib/storage";
import { isValidYouTubeUrl } from "../lib/youtube";

export default function HomeScreen() {
  const router = useRouter();
  const theme = useTheme();
  const styles = useMemo(() => makeStyles(theme), [theme]);
  const { videoUrl, setVideoUrl } = useAnalysis();
  const [touched, setTouched] = useState(false);
  const [focused, setFocused] = useState(false);
  // Clipboard read can be denied (Safari/Firefox want a gesture they
  // recognize); this carries the "paste manually" fallback message.
  const [pasteNotice, setPasteNotice] = useState(null);
  // null = still reading the flag; render a bg-colored frame instead of
  // flashing the form at someone who's about to be redirected to onboarding.
  const [onboarded, setOnboarded] = useState(null);
  const { width, height } = useWindowDimensions();

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
  // Validated on every keystroke so a bad link is caught here, inline —
  // not after mockApi's 2.2s delay on a separate error screen.
  const isValid = isValidYouTubeUrl(videoUrl);

  // On a tall desktop viewport, dead-centering leaves the form floating in
  // empty space; anchor it ~12% from the top instead. Phones stay centered.
  const isWide = width >= theme.layout.breakpoint;

  const handleChange = (text) => {
    setPasteNotice(null);
    setVideoUrl(text);
  };

  const handlePaste = async () => {
    try {
      const text = await Clipboard.getStringAsync();
      if (text) {
        setPasteNotice(null);
        setVideoUrl(text.trim());
      } else {
        setPasteNotice("Clipboard is empty — copy a YouTube link first.");
      }
    } catch {
      setPasteNotice("Couldn't read your clipboard — paste the link manually.");
    }
  };

  const handleAnalyze = () => {
    setTouched(true);
    if (!isValid) return;
    router.push("/analyzing");
  };

  // The hint lives in a fixed-height slot so its appearance never shifts the
  // Analyze button up and down under the user's thumb.
  let hint = null;
  if (pasteNotice) {
    hint = <Text style={styles.errorHint}>{pasteNotice}</Text>;
  } else if (!isEmpty && isValid) {
    hint = <Text style={styles.validHint}>Link looks good.</Text>;
  } else if (!isEmpty) {
    hint = (
      <Text style={styles.errorHint}>
        That doesn&apos;t look like a YouTube video link.
      </Text>
    );
  } else if (touched) {
    hint = <Text style={styles.errorHint}>Paste a link before analyzing.</Text>;
  }

  if (!onboarded) {
    return <View style={styles.container} />;
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ThemedStatusBar />
      <PillButton
        label="← Home"
        variant="secondary"
        size="sm"
        onPress={() => router.push("/")}
        style={styles.homeButton}
      />
      <ThemeToggle style={styles.toggle} />
      <View
        style={[
          styles.content,
          isWide
            ? { justifyContent: "flex-start", paddingTop: height * 0.12 }
            : { justifyContent: "center" },
        ]}
      >
        <View style={styles.brandRow}>
          {/* Soft glow behind the mark — same pattern as the analyzing
              screen's halo, so the two screens read as one product. */}
          <View style={styles.glow} pointerEvents="none">
            <GradientBlob
              colors={theme.gradients.brand}
              style={StyleSheet.absoluteFill}
            />
          </View>
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

        <View style={[styles.inputRow, focused && styles.inputRowFocused]}>
          <TextInput
            accessibilityLabel="YouTube video link"
            style={styles.input}
            placeholder="https://youtube.com/watch?v=..."
            placeholderTextColor={theme.color.inkFaint}
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="url"
            value={videoUrl}
            onChangeText={handleChange}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
          />
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Paste a link from your clipboard"
            onPress={handlePaste}
            hitSlop={8}
            style={({ pressed }) => [
              styles.pasteButton,
              pressed && styles.pastePressed,
            ]}
          >
            <Text style={styles.pasteLabel}>PASTE</Text>
          </Pressable>
        </View>
        <View style={styles.hintSlot}>{hint}</View>

        <PillButton
          label="Analyze"
          onPress={handleAnalyze}
          style={styles.button}
        />

        <View style={styles.footerRow}>
          <PillButton
            label="What is manufactured consensus?"
            variant="secondary"
            size="sm"
            onPress={() => router.push("/onboarding")}
          />
          <PillButton
            label="History"
            variant="secondary"
            size="sm"
            onPress={() => router.push("/history")}
          />
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

function makeStyles(theme) {
  const { color, font, radius, type, risk } = theme;
  return StyleSheet.create({
    // Transparent: the shared bg + constellation live in app/_layout.jsx.
    container: {
      flex: 1,
    },
    toggle: {
      position: "absolute",
      top: 20,
      right: 20,
      zIndex: 10,
    },
    // Mirrors the theme toggle in the opposite corner — the way back to the
    // landing page.
    homeButton: {
      position: "absolute",
      top: 20,
      left: 20,
      zIndex: 10,
    },
    content: {
      flex: 1,
      paddingHorizontal: 24,
      gap: 12,
      width: "100%",
      maxWidth: 560,
      alignSelf: "center",
    },
    brandRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
      marginBottom: 12,
    },
    glow: {
      position: "absolute",
      width: 260,
      height: 260,
      borderRadius: 130,
      top: -110,
      left: -70,
      overflow: "hidden",
      opacity: 0.28,
    },
    brandMark: {
      width: 34,
      height: 34,
    },
    brand: {
      fontFamily: font.display,
      fontSize: 26,
      color: color.ink,
    },
    heading: {
      ...type.h2,
    },
    subheading: {
      ...type.body,
      marginBottom: 12,
    },
    inputRow: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: color.surface,
      borderRadius: radius.md,
      borderWidth: 1,
      borderColor: color.border,
    },
    inputRowFocused: {
      borderColor: accent.violet,
    },
    input: {
      flex: 1,
      paddingHorizontal: 16,
      paddingVertical: 14,
      fontFamily: font.mono,
      fontSize: 14,
      color: color.ink,
    },
    pasteButton: {
      paddingHorizontal: 14,
      paddingVertical: 8,
      marginRight: 6,
      borderRadius: radius.sm,
      backgroundColor: color.surfaceAlt,
    },
    pastePressed: {
      opacity: 0.7,
    },
    pasteLabel: {
      fontFamily: font.monoBold,
      fontSize: 11,
      letterSpacing: 1.2,
      color: color.inkMuted,
    },
    // Fixed height whether or not a hint is showing (small type line height),
    // so validation feedback never nudges the Analyze button.
    hintSlot: {
      minHeight: 20,
      justifyContent: "center",
    },
    errorHint: {
      ...type.small,
      color: risk.high.text,
    },
    validHint: {
      ...type.small,
      color: risk.low.text,
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
      columnGap: 12,
      rowGap: 8,
    },
  });
}
