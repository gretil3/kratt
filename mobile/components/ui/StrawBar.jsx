// The breakdown as 100 straws — one straw per 1% of comments, colored by
// category — with a legend underneath. Reads as a count of comments rather
// than an abstract proportion bar.
import { StyleSheet, Text, View } from "react-native";
import { useTheme } from "../../context/ThemeContext";
import { CATEGORIES } from "../../lib/categories";

const STRAW_COUNT = 100;

export default function StrawBar({ breakdown, narrow = false, style }) {
  const theme = useTheme();

  const straws = [];
  CATEGORIES.forEach(({ key }) => {
    const count = Math.max(0, Math.round(breakdown[key] ?? 0));
    for (let i = 0; i < count && straws.length < STRAW_COUNT; i += 1) {
      straws.push(theme.category[key]);
    }
  });
  // A breakdown that rounds short of 100 leaves empty slots, not a short bar.
  while (straws.length < STRAW_COUNT) straws.push(theme.color.well);

  const summary = CATEGORIES.map(
    ({ key, label }) => `${label} ${breakdown[key] ?? 0}%`
  ).join(", ");

  return (
    <View style={style}>
      <View
        accessible
        accessibilityRole="image"
        accessibilityLabel={`Comment breakdown: ${summary}`}
        style={[styles.straws, { gap: narrow ? 1 : 2 }]}
      >
        {straws.map((fill, index) => (
          <View key={index} style={[styles.straw, { backgroundColor: fill }]} />
        ))}
      </View>
      <View style={styles.legend}>
        {CATEGORIES.map(({ key, stamp }) => (
          <View key={key} style={styles.legendItem}>
            <View
              style={[styles.swatch, { backgroundColor: theme.category[key] }]}
            />
            <Text
              style={[
                styles.legendText,
                { fontFamily: theme.font.mono, color: theme.color.inkMuted },
              ]}
            >
              {stamp} {breakdown[key] ?? 0}%
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  straws: {
    flexDirection: "row",
    height: 76,
    marginBottom: 12,
  },
  straw: {
    flex: 1,
    borderRadius: 2,
  },
  legend: {
    flexDirection: "row",
    flexWrap: "wrap",
    columnGap: 20,
    rowGap: 8,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
  },
  swatch: {
    width: 9,
    height: 9,
    borderRadius: 2,
  },
  legendText: {
    fontSize: 12,
  },
});
