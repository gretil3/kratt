import { StyleSheet, Text, View } from "react-native";
import { color, font, hairline, radius, risk, type } from "../../theme/tokens";
import { LEVEL_LABELS } from "../../lib/riskLevels";

// One comment category as an item pinned to the evidence board.
// With `percent` (+ optional `level`) it's a result card on the analysis
// screen; without them it's the compact explainer used on the landing page.
export default function CategoryCard({
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
        <View
          style={[
            styles.stampChip,
            { backgroundColor: palette ? palette.tint : color.neutralTint },
          ]}
        >
          <Text
            style={[
              styles.stampText,
              { color: palette ? palette.text : color.inkMuted },
            ]}
          >
            {stamp}
          </Text>
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
    borderWidth: hairline,
    borderColor: color.hairline,
    borderRadius: radius.sm,
    padding: 16,
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  stampChip: {
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: radius.sm,
  },
  stampText: {
    fontFamily: font.monoBold,
    fontSize: 11,
    letterSpacing: 1,
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
  },
  levelText: {
    fontFamily: font.sansBold,
    fontSize: 13,
  },
});
