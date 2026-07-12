import { useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";
import GradientBlob from "./GradientBlob";
import { useTheme } from "../../context/ThemeContext";

// One comment category, shown two ways from the same component:
// with `percent` it's a result card on the analysis screen; without it, the
// compact explainer used on the landing page. `categoryKey` always drives the
// stamp chip's holographic color so the same category reads consistently in
// both places.
//
// The share is shown as a proportional mini bar, not a Low/Medium/High badge:
// almost every real video landed in the old 10–25% "Medium" band, so three of
// four cards said the same word — and a categorical verdict ("HIGH") is an
// authority claim the weak-supervised model can't back. A bar just shows the
// proportion; 18% vs 25% becomes visible without Kratt pronouncing judgment.
export default function CategoryCard({
  categoryKey,
  seed = 0,
  stamp,
  label,
  description,
  example,
  tell,
  percent,
  neutral = false,
  style,
}) {
  const theme = useTheme();
  const styles = useMemo(() => makeStyles(theme), [theme]);
  const showData = typeof percent === "number";

  // Genuine keeps a muted bar + caption: a healthy share, not a bot signal.
  const barColor = neutral
    ? theme.risk.neutral.main
    : (theme.gradients[categoryKey] ?? theme.gradients.brand)[0];

  return (
    <View style={[styles.card, style]}>
      <View style={styles.topRow}>
        <View style={styles.stampChip}>
          <GradientBlob
            colors={theme.gradients[categoryKey] ?? theme.gradients.brand}
            seed={seed}
            style={StyleSheet.absoluteFill}
          />
          <Text style={styles.stampText}>{stamp}</Text>
        </View>
        {showData ? <Text style={styles.percent}>{percent}%</Text> : null}
      </View>

      <Text style={styles.label}>{label}</Text>
      <Text style={styles.description}>{description}</Text>

      {/* Teaching material — explainer (landing) mode only. The result screen
          shows measurements; the landing page teaches the spotting skill. */}
      {!showData && example ? (
        <Text style={styles.example}>“{example}”</Text>
      ) : null}
      {!showData && tell ? (
        <View style={styles.tellBlock}>
          <Text style={styles.tellLabel}>THE TELL</Text>
          <Text style={styles.tellText}>{tell}</Text>
        </View>
      ) : null}

      {showData ? (
        <View style={styles.shareBlock}>
          <View style={styles.track}>
            <View
              style={[
                styles.fill,
                {
                  width: `${Math.min(percent, 100)}%`,
                  backgroundColor: barColor,
                },
              ]}
            />
          </View>
          {neutral ? (
            <Text style={styles.neutralNote}>Not a bot signal</Text>
          ) : null}
        </View>
      ) : null}
    </View>
  );
}

function makeStyles(theme) {
  const { color, font, radius, type } = theme;
  return StyleSheet.create({
    card: {
      backgroundColor: color.surface,
      borderWidth: 1,
      borderColor: color.border,
      borderRadius: radius.md,
      padding: 16,
    },
    topRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 12,
    },
    stampChip: {
      alignSelf: "flex-start",
      overflow: "hidden",
      borderRadius: radius.sm,
      paddingHorizontal: 10,
      paddingVertical: 5,
    },
    stampText: {
      fontFamily: font.monoBold,
      fontSize: 11,
      letterSpacing: 1,
      color: "#FFFFFF",
    },
    percent: {
      fontFamily: font.monoBold,
      fontSize: 21,
      color: color.ink,
    },
    label: {
      ...type.h3,
      marginBottom: 4,
    },
    description: {
      ...type.small,
    },
    // A realistic specimen of the category, set like a quoted comment.
    example: {
      ...type.body,
      color: color.ink,
      marginTop: 12,
      paddingLeft: 12,
      borderLeftWidth: 2,
      borderLeftColor: color.borderStrong,
    },
    tellBlock: {
      marginTop: 12,
      gap: 4,
    },
    tellLabel: {
      ...type.monoLabel,
      fontSize: 10,
    },
    tellText: {
      ...type.small,
    },
    shareBlock: {
      marginTop: "auto",
      paddingTop: 14,
      gap: 6,
    },
    track: {
      height: 6,
      borderRadius: 3,
      backgroundColor: color.surfaceAlt,
      overflow: "hidden",
    },
    fill: {
      height: "100%",
      borderRadius: 3,
    },
    neutralNote: {
      ...type.small,
      color: color.inkFaint,
    },
  });
}
