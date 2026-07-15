// The visual bridge between the score gauge and the category cards: one thin
// horizontal bar whose four segments are the breakdown percentages, in the
// same colors as each category's card below. Without it, the user has to do
// the arithmetic themselves to see that 24+18+25 is the 67 on the gauge.
import { useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";
import { useTheme } from "../../context/ThemeContext";
import { CATEGORIES } from "../../lib/categories";

export default function CompositionBar({ breakdown, style }) {
  const theme = useTheme();
  const styles = useMemo(() => makeStyles(theme), [theme]);

  // First color of each category gradient = the color its card leads with.
  const segmentColor = (key) =>
    (theme.gradients[key] ?? theme.gradients.brand)[0];

  const segments = CATEGORIES.map((category) => ({
    ...category,
    percent: breakdown[category.key] ?? 0,
  })).filter((segment) => segment.percent > 0);

  return (
    <View style={style}>
      <View style={styles.bar}>
        {segments.map((segment) => (
          <View
            key={segment.key}
            style={[
              styles.segment,
              {
                flexGrow: segment.percent,
                backgroundColor: segmentColor(segment.key),
              },
            ]}
          />
        ))}
      </View>
      <View style={styles.legend}>
        {segments.map((segment) => (
          <View key={segment.key} style={styles.legendItem}>
            <View
              style={[
                styles.legendDot,
                { backgroundColor: segmentColor(segment.key) },
              ]}
            />
            <Text style={styles.legendText}>
              {segment.stamp} {segment.percent}%
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

function makeStyles(theme) {
  const { color, font } = theme;
  return StyleSheet.create({
    bar: {
      flexDirection: "row",
      height: 8,
      borderRadius: 4,
      overflow: "hidden",
      backgroundColor: color.surfaceAlt,
      gap: 2,
    },
    segment: {
      flexBasis: 0,
    },
    legend: {
      flexDirection: "row",
      flexWrap: "wrap",
      columnGap: 16,
      rowGap: 4,
      marginTop: 8,
      justifyContent: "center",
    },
    legendItem: {
      flexDirection: "row",
      alignItems: "center",
      gap: 5,
    },
    legendDot: {
      width: 7,
      height: 7,
      borderRadius: 3.5,
    },
    legendText: {
      fontFamily: font.mono,
      fontSize: 11,
      color: color.inkMuted,
    },
  });
}
