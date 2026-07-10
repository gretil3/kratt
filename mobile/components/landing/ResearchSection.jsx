import {
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import SectionShell from "./SectionShell";
import CategoryCard from "../ui/CategoryCard";
import { CATEGORIES } from "../../lib/categories";
import { color, layout, type } from "../../theme/tokens";

export default function ResearchSection() {
  const { width } = useWindowDimensions();
  const isWide = width >= layout.breakpoint;

  return (
    <SectionShell style={styles.section}>
      <Text style={type.monoLabel}>EVIDENCE CATEGORIES</Text>
      <Text style={[type.h2, styles.heading]}>
        The four categories Kratt reads
      </Text>
      <Text style={styles.paragraph}>
        These categories draw on signals commonly used in research on
        inauthentic behavior across major platforms — repetitive language
        patterns, duplication across accounts and videos, and the telltale
        structure of promotional messages. Every comment is sorted into one
        category, and the bot score is simply the share of comments that
        don&apos;t read as genuine.
      </Text>

      <View style={styles.grid}>
        {CATEGORIES.map((category) => (
          <CategoryCard
            key={category.key}
            stamp={category.stamp}
            label={category.label}
            description={category.description}
            style={[styles.cell, { flexBasis: isWide ? "46%" : "100%" }]}
          />
        ))}
      </View>
    </SectionShell>
  );
}

const styles = StyleSheet.create({
  section: {
    paddingVertical: 56,
  },
  heading: {
    marginTop: 8,
    marginBottom: 14,
  },
  paragraph: {
    ...type.body,
    color: color.inkMuted,
    maxWidth: 680,
    marginBottom: 28,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 16,
  },
  cell: {
    flexGrow: 1,
  },
});
