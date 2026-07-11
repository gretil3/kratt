// "Why Kratt" — the research-gap positioning: most detectors output a score
// and ask for trust; Kratt shows the evidence so the user practices reading
// patterns. Ends with paraphrased sources (URLs only, no long quotes).
import { useMemo } from "react";
import { Linking, Pressable, StyleSheet, Text, useWindowDimensions, View } from "react-native";
import { useTheme } from "../../context/ThemeContext";
import SectionShell from "./SectionShell";
import GradientBlob from "../ui/GradientBlob";

const SOURCES = [
  {
    label: "Ferrara et al. — The Rise of Social Bots (2016)",
    note: "How automated accounts imitate real users and steer online discussion.",
    url: "https://arxiv.org/abs/1407.5225",
  },
  {
    label: "Varol et al. — Online Human-Bot Interactions (2017)",
    note: "Estimating how much of a platform's account base behaves automatically.",
    url: "https://arxiv.org/abs/1703.03107",
  },
  {
    label: "Civic Online Reasoning — Digital Inquiry Group (formerly Stanford History Education Group)",
    note: "Evidence that evaluating online sources is a skill that needs explicit practice.",
    url: "https://cor.stanford.edu",
  },
];

export default function GapSection() {
  const theme = useTheme();
  const styles = useMemo(() => makeStyles(theme), [theme]);
  const { width } = useWindowDimensions();
  const isWide = width >= theme.layout.breakpoint;

  return (
    <SectionShell style={styles.section}>
      <Text style={theme.type.monoLabel}>WHY KRATT</Text>
      <Text style={[theme.type.h2, styles.heading]}>
        A score you can argue with
      </Text>

      <View style={[styles.compareRow, !isWide && styles.compareRowNarrow]}>
        <View style={styles.compareCard}>
          <Text style={styles.compareKicker}>MOST DETECTION TOOLS</Text>
          <Text style={styles.compareBody}>
            Output a single number and ask you to trust it. If you can&apos;t
            see why, you haven&apos;t learned anything — you&apos;ve just
            swapped one authority for another.
          </Text>
        </View>
        <View style={[styles.compareCard, styles.compareCardBrand]}>
          <GradientBlob
            colors={theme.gradients.brand}
            seed={2}
            radius={theme.radius.sm}
            style={styles.compareMark}
          />
          <Text style={styles.compareKicker}>KRATT</Text>
          <Text style={styles.compareBody}>
            Shows its working: four evidence categories and the actual flagged
            comments. The score is where your judgment starts, not where it
            ends — so the pattern-reading skill stays with you.
          </Text>
        </View>
      </View>

      <Text style={[theme.type.monoLabel, styles.sourcesLabel]}>
        SOURCES &amp; FURTHER READING
      </Text>
      <View style={styles.sourceList}>
        {SOURCES.map((source) => (
          <Pressable
            key={source.url}
            accessibilityRole="link"
            accessibilityLabel={`Open source: ${source.label}`}
            onPress={() => Linking.openURL(source.url)}
            style={({ pressed }) => [styles.sourceRow, pressed && { opacity: 0.7 }]}
          >
            <Text style={styles.sourceTitle}>{source.label}</Text>
            <Text style={styles.sourceNote}>{source.note}</Text>
            <Text style={styles.sourceUrl}>{source.url}</Text>
          </Pressable>
        ))}
      </View>
    </SectionShell>
  );
}

function makeStyles(theme) {
  const { color, font, radius, type } = theme;
  return StyleSheet.create({
    section: {
      paddingVertical: 56,
    },
    heading: {
      marginTop: 8,
      marginBottom: 28,
    },
    compareRow: {
      flexDirection: "row",
      gap: 16,
      marginBottom: 40,
    },
    compareRowNarrow: {
      flexDirection: "column",
    },
    compareCard: {
      flex: 1,
      backgroundColor: color.surface,
      borderWidth: 1,
      borderColor: color.border,
      borderRadius: radius.md,
      padding: 20,
      gap: 8,
    },
    compareCardBrand: {
      borderColor: color.borderStrong,
    },
    compareMark: {
      width: 24,
      height: 24,
      marginBottom: 2,
    },
    compareKicker: {
      ...type.monoLabel,
    },
    compareBody: {
      ...type.body,
    },
    sourcesLabel: {
      marginBottom: 12,
    },
    sourceList: {
      borderTopWidth: 1,
      borderTopColor: color.border,
    },
    sourceRow: {
      paddingVertical: 16,
      borderBottomWidth: 1,
      borderBottomColor: color.border,
      gap: 3,
    },
    sourceTitle: {
      ...type.body,
      color: color.ink,
      fontFamily: font.sansBold,
    },
    sourceNote: {
      ...type.small,
    },
    sourceUrl: {
      fontFamily: font.mono,
      fontSize: 12,
      lineHeight: 18,
      color: color.inkMuted,
    },
  });
}
