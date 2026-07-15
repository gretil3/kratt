// Pre-reveal guess step: before the analysis screen shows Kratt's score, the
// user commits their own estimate of how bot-heavy the comment section is.
// Feeling the gap between instinct and evidence is the point — so this panel
// must never leak the real result. `status` is a plain process caption
// ("Pulling comments…") passed in from the analyzing screen; the panel never
// receives the analysis result itself.
import { useMemo, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import Slider from "@react-native-community/slider";
import { useTheme } from "../../context/ThemeContext";
import { accent } from "../../theme/themes";
import PillButton from "./PillButton";
import GradientBlob from "./GradientBlob";

export default function GuessPanel({ onSubmit, status = null }) {
  const theme = useTheme();
  const styles = useMemo(() => makeStyles(theme), [theme]);
  const [value, setValue] = useState(50);

  return (
    <View style={styles.panel}>
      <GradientBlob
        colors={theme.gradients.brand}
        seed={1}
        radius={theme.radius.md}
        style={styles.blob}
      />
      <Text style={theme.type.monoLabel}>BEFORE YOU SEE THE SCORE</Text>
      <Text style={styles.title}>What&apos;s your guess?</Text>
      <Text style={styles.body}>
        Kratt is reading the comment section right now. Before you see its
        number — how much of this comment section do you think is bot activity?
      </Text>

      <Text style={styles.value}>{value}%</Text>
      <Slider
        style={styles.slider}
        minimumValue={0}
        maximumValue={100}
        step={1}
        value={value}
        onValueChange={setValue}
        minimumTrackTintColor={accent.violet}
        maximumTrackTintColor={theme.color.border}
        thumbTintColor={theme.color.ink}
        accessibilityLabel="Your estimate of the bot percentage"
      />
      <View style={styles.scaleRow}>
        <Text style={styles.scaleText}>0% — all human</Text>
        <Text style={styles.scaleText}>100% — all bots</Text>
      </View>

      {/* Fixed-height slot so the caption never reflows the button. */}
      <View style={styles.statusRow}>
        {status ? (
          <>
            <ActivityIndicator size="small" color={theme.color.inkFaint} />
            <Text style={styles.statusText}>{status}</Text>
          </>
        ) : null}
      </View>

      <PillButton
        label="Lock in my guess"
        onPress={() => onSubmit(value)}
        style={styles.button}
      />
    </View>
  );
}

function makeStyles(theme) {
  const { color, font, type } = theme;
  return StyleSheet.create({
    panel: {
      width: "100%",
      maxWidth: 560,
      alignSelf: "center",
    },
    blob: {
      height: 120,
      marginBottom: 24,
    },
    title: {
      ...type.h2,
      marginTop: 10,
      marginBottom: 10,
    },
    body: {
      ...type.body,
      marginBottom: 28,
    },
    value: {
      fontFamily: font.monoBold,
      fontSize: 44,
      lineHeight: 50,
      color: color.ink,
      textAlign: "center",
      marginBottom: 8,
      // Mono digits are fixed-width, so the number doesn't jitter the layout
      // while sliding.
    },
    slider: {
      width: "100%",
      height: 40,
    },
    scaleRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginTop: 4,
      marginBottom: 16,
    },
    scaleText: {
      ...type.small,
    },
    statusRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 8,
      minHeight: 24,
      marginBottom: 16,
    },
    statusText: {
      ...type.small,
    },
    button: {
      alignSelf: "stretch",
    },
  });
}
