import { useMemo } from "react";
import { StyleSheet, Text, useWindowDimensions, View } from "react-native";
import { useTheme } from "../../context/ThemeContext";
import SectionShell from "./SectionShell";
import CategoryCard from "../ui/CategoryCard";
import { CATEGORIES } from "../../lib/categories";

export default function ResearchSection() {
  const theme = useTheme();
  const styles = useMemo(() => makeStyles(theme), [theme]);
  const { width } = useWindowDimensions();
  const isWide = width >= theme.layout.breakpoint;

  return (
    <SectionShell style={styles.section}>
      <Text style={theme.type.monoLabel}>EVIDENCE CATEGORIES</Text>
      <Text style={[theme.type.h2, styles.heading]}>
        The four categories Kratt reads
      </Text>
      <Text style={styles.paragraph}>
        These categories draw on signals commonly used in research on
        inauthentic behavior across major platforms — repetitive language
        patterns, duplicated and copy-pasted comments, and the telltale
        structure of promotional messages. Every comment is sorted into one
        category, and the bot score is simply the share of comments that
        don&apos;t read as genuine.
      </Text>

      <View style={styles.grid}>
        {CATEGORIES.map((category, index) => (
          <CategoryCard
            key={category.key}
            categoryKey={category.key}
            seed={index}
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

function makeStyles(theme) {
  const { type } = theme;
  return StyleSheet.create({
    section: {
      paddingVertical: 56,
    },
    heading: {
      marginTop: 8,
      marginBottom: 14,
    },
    paragraph: {
      ...type.body,
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
}
