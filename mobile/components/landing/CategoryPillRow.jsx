// Hero visual: a row of long, slender rounded-pill gradients — one per
// evidence category Kratt sorts comments into. Doubles as a teaser for the
// Evidence Categories section below. On wide screens the four pills stay
// slender and are spread evenly across the full row; on narrow screens they
// keep a fixed width and scroll horizontally.
import { ScrollView, StyleSheet, Text, View, useWindowDimensions } from "react-native";
import PillGradient from "./PillGradient";
import { CATEGORIES } from "../../lib/categories";
import { gradients, font, layout, radius } from "../../theme/darkTokens";

export default function CategoryPillRow() {
  const { width } = useWindowDimensions();
  const isWide = width >= layout.breakpoint;
  const pillHeight = isWide ? 340 : 240;

  const pills = CATEGORIES.map((category) => (
    <View
      key={category.key}
      style={[
        styles.pill,
        { height: pillHeight },
        isWide ? styles.pillWide : { width: 84 },
      ]}
    >
      <PillGradient
        colors={gradients[category.key]}
        radius={radius.lg}
        style={StyleSheet.absoluteFill}
      />
      <View style={styles.pillOverlay}>
        <Text style={styles.pillStamp}>{category.stamp}</Text>
        <Text style={styles.pillLabel}>{category.label}</Text>
      </View>
    </View>
  ));

  if (isWide) {
    return <View style={styles.rowWide}>{pills}</View>;
  }

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.row}
    >
      {pills}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  row: {
    gap: 12,
    paddingVertical: 4,
  },
  rowWide: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 4,
  },
  pill: {
    borderRadius: 999,
    overflow: "hidden",
    justifyContent: "flex-end",
  },
  pillWide: {
    width: 150,
  },
  pillOverlay: {
    paddingHorizontal: 16,
    paddingBottom: 22,
    gap: 5,
  },
  pillStamp: {
    fontFamily: font.monoBold,
    fontSize: 11,
    letterSpacing: 1.4,
    color: "rgba(255,255,255,0.8)",
  },
  pillLabel: {
    fontFamily: font.sansBold,
    fontSize: 16,
    lineHeight: 20,
    color: "#FFFFFF",
  },
});
