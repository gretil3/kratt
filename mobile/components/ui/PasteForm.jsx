// The link input + Analyze action. Shared by the /home screen and the
// landing page's "Try it now" panel, so both validate and submit the same way:
// the URL lives in AnalysisContext and submitting opens /analyzing.
import { useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { useRouter } from "expo-router";
import * as Clipboard from "expo-clipboard";
import { useAnalysis } from "../../context/AnalysisContext";
import { useTheme } from "../../context/ThemeContext";
import { isValidYouTubeUrl } from "../../lib/youtube";
import { webStyle } from "../../theme/webStyle";
import Button from "./Button";

export default function PasteForm({ style }) {
  const router = useRouter();
  const theme = useTheme();
  const { color, font, risk } = theme;
  const { videoUrl, setVideoUrl } = useAnalysis();
  const [touched, setTouched] = useState(false);
  const [focused, setFocused] = useState(false);
  // Clipboard read can be denied (Safari/Firefox want a gesture they
  // recognize); this carries the "paste manually" fallback message.
  const [pasteNotice, setPasteNotice] = useState(null);

  const isEmpty = videoUrl.trim().length === 0;
  // Validated on every keystroke so a bad link is caught here, inline —
  // not after the request on a separate error screen.
  const isValid = isValidYouTubeUrl(videoUrl);

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

  let hint = null;
  let hintColor = risk.high.text;
  if (pasteNotice) {
    hint = pasteNotice;
  } else if (!isEmpty && isValid) {
    hint = "Link looks good.";
    hintColor = risk.low.text;
  } else if (!isEmpty) {
    hint = "That doesn't look like a YouTube video link.";
  } else if (touched) {
    hint = "Paste a link before analyzing.";
  }

  return (
    <View style={style}>
      <View>
        <TextInput
          accessibilityLabel="YouTube video link"
          style={[
            styles.input,
            {
              backgroundColor: color.surface,
              borderColor: focused ? color.accent : "rgba(241,234,219,0.14)",
              color: color.ink,
              fontFamily: font.mono,
            },
            webStyle({
              outlineStyle: "none",
              boxShadow: focused ? "0 0 0 4px rgba(233,185,73,0.14)" : "none",
            }),
          ]}
          placeholder="https://youtube.com/watch?v=..."
          placeholderTextColor={color.inkGhost}
          autoCapitalize="none"
          autoCorrect={false}
          spellCheck={false}
          keyboardType="url"
          returnKeyType="go"
          value={videoUrl}
          onChangeText={handleChange}
          onSubmitEditing={handleAnalyze}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
        />
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Paste a link from your clipboard"
          onPress={handlePaste}
          hitSlop={6}
          style={({ hovered, pressed }) => [
            styles.pasteButton,
            {
              backgroundColor:
                hovered || pressed ? color.wellHover : color.well,
            },
          ]}
        >
          {({ hovered }) => (
            <Text
              style={[
                styles.pasteLabel,
                {
                  fontFamily: font.monoBold,
                  color: hovered ? color.ink : color.inkMuted,
                },
              ]}
            >
              PASTE
            </Text>
          )}
        </Pressable>
      </View>

      {/* Fixed-height slot: feedback appearing never shifts the button. */}
      <View style={styles.hintSlot}>
        {hint ? (
          <Text
            style={[styles.hint, { color: hintColor, fontFamily: font.sans }]}
          >
            {hint}
          </Text>
        ) : null}
      </View>

      <Button label="Analyze" size="xl" onPress={handleAnalyze} />

      <View style={styles.footerRow}>
        <Button
          label="History"
          variant="secondary"
          size="sm"
          onPress={() => router.push("/history")}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  input: {
    height: 60,
    borderRadius: 12,
    borderWidth: 1,
    paddingLeft: 18,
    paddingRight: 100,
    fontSize: 14.5,
  },
  pasteButton: {
    position: "absolute",
    right: 9,
    top: 10,
    height: 40,
    paddingHorizontal: 14,
    borderRadius: 8,
    justifyContent: "center",
  },
  pasteLabel: {
    fontSize: 11,
    letterSpacing: 1.3,
  },
  hintSlot: {
    minHeight: 22,
    justifyContent: "center",
    marginTop: 10,
    marginBottom: 14,
  },
  hint: {
    fontSize: 13.5,
    lineHeight: 18,
  },
  footerRow: {
    flexDirection: "row",
    justifyContent: "center",
    flexWrap: "wrap",
    gap: 10,
    marginTop: 22,
  },
});
