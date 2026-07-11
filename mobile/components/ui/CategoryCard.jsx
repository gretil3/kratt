import { StyleSheet, Text, View } from "react-native";
import GradientBlob from "./GradientBlob";
import { color, font, gradients, radius, risk, type } from "../../theme/darkTokens";
import { LEVEL_LABELS } from "../../lib/riskLevels";

// One comment category, shown two ways from the same component:
// with `percent` (+ optional `level`) it's a result card on the analysis
// screen; without them it's the compact explainer used on the landing page.
// `categoryKey` always drives the stamp chip's holographic color so the same
// category reads consistently in both places.
export default function CategoryCard({
  categoryKey,
  seed = 0,
  stamp,
  label,
  description,
  percent,
  level,
  style,
}) {
  const palette = level ? risk[level] : null;
  const showData = typeof percent === "number";

  return (
    <View style={[styles.card, style]}>
      <View style={styles.topRow}>
        <View style={styles.stampChip}>
          <GradientBlob
            colors={gradients[categoryKey] ?? gradients.brand}
            seed={seed}
            style={StyleSheet.absoluteFill}
          />
          <Text style={styles.stampText}>{stamp}</Text>
        </View>
        {showData ? <Text style={styles.percent}>{percent}%</Text> : null}
      </View>

      <Text style={styles.label}>{label}</Text>
      <Text style={styles.description}>{description}</Text>

      {showData && level ? (
        <View style={styles.levelRow}>
          <View style={[styles.levelDot, { backgroundColor: palette.main }]} />
          <Text style={[styles.levelText, { color: palette.text }]}>
            {LEVEL_LABELS[level]}
          </Text>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
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
  levelRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    marginTop: "auto",
    paddingTop: 14,
  },
  levelDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
  },
  levelText: {
    fontFamily: font.sansBold,
    fontSize: 13,
  },
});
