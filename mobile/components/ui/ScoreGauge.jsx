import { StyleSheet, Text, View } from "react-native";
import Svg, { Circle } from "react-native-svg";
import { color, font, radius, risk } from "../../theme/darkTokens";
import { TIER_LABELS, tierForScore } from "../../lib/riskLevels";

// Ring gauge for bot_percentage (0–100), colored by risk tier. Sizes scale
// from the `size` prop so the same component works on the result screen and
// in denser contexts (e.g. a future history list).
export default function ScoreGauge({ value, size = 180, strokeWidth = 12, caption = "likely bot activity" }) {
  const clamped = Math.max(0, Math.min(100, value));
  const tier = tierForScore(clamped);
  const palette = risk[tier];
  const center = size / 2;
  const r = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * r;

  return (
    <View style={styles.wrap}>
      <View style={{ width: size, height: size }}>
        <Svg width={size} height={size}>
          <Circle
            cx={center}
            cy={center}
            r={r}
            stroke={color.border}
            strokeWidth={strokeWidth}
            fill="none"
          />
          <Circle
            cx={center}
            cy={center}
            r={r}
            stroke={palette.main}
            strokeWidth={strokeWidth}
            fill="none"
            strokeDasharray={`${circumference} ${circumference}`}
            strokeDashoffset={circumference * (1 - clamped / 100)}
            transform={`rotate(-90 ${center} ${center})`}
          />
        </Svg>
        <View style={styles.center}>
          <View style={styles.valueRow}>
            <Text
              style={[
                styles.value,
                {
                  color: palette.text,
                  fontSize: Math.round(size * 0.24),
                  lineHeight: Math.round(size * 0.27),
                },
              ]}
            >
              {Math.round(clamped)}
            </Text>
            <Text
              style={[
                styles.percentSign,
                { color: palette.text, fontSize: Math.round(size * 0.12) },
              ]}
            >
              %
            </Text>
          </View>
          {caption ? <Text style={styles.caption}>{caption}</Text> : null}
        </View>
      </View>
      <View style={[styles.tierChip, { backgroundColor: palette.tint }]}>
        <View style={[styles.tierDot, { backgroundColor: palette.main }]} />
        <Text style={[styles.tierLabel, { color: palette.text }]}>
          {TIER_LABELS[tier]}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: "center",
  },
  center: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
  },
  valueRow: {
    flexDirection: "row",
    alignItems: "flex-end",
  },
  value: {
    fontFamily: font.monoBold,
  },
  percentSign: {
    fontFamily: font.monoBold,
    marginBottom: 4,
  },
  caption: {
    fontFamily: font.sans,
    fontSize: 12,
    color: color.inkMuted,
    marginTop: 2,
  },
  tierChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    marginTop: 14,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: radius.sm,
  },
  tierDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
  },
  tierLabel: {
    fontFamily: font.sansBold,
    fontSize: 13,
  },
});
