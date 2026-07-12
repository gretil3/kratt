// "Why Kratt" — the research-gap positioning: most detectors output a score
// and ask for trust; Kratt shows the evidence so the user practices reading
// patterns. Ends with paraphrased sources (URLs only, no long quotes).
import { useMemo } from "react";
import {
  Linking,
  Pressable,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import { useTheme } from "../../context/ThemeContext";
import SectionShell from "./SectionShell";
import GradientBlob from "../ui/GradientBlob";

// Numbered in render order: [1], [2], … — reference markers elsewhere in the
// app (onboarding card 3 cites [1]) point at these positions, so a reorder
// here must be checked against every "[n]" in copy. All URLs verified live
// and matched against the actual page (2026-07-12).
const SOURCES = [
  {
    // Cited as [1] by onboarding card 3 — the 9–15% estimate comes from
    // this paper's abstract, verbatim scope: "active Twitter accounts".
    label: "Varol et al. — Online Human-Bot Interactions (2017)",
    note: "Estimated that between 9% and 15% of active Twitter accounts were bots.",
    url: "https://arxiv.org/abs/1703.03107",
  },
  {
    label: "Ferrara et al. — The Rise of Social Bots (2016)",
    note: "How automated accounts imitate real users and steer online discussion.",
    url: "https://arxiv.org/abs/1407.5225",
  },
  {
    label:
      "Civic Online Reasoning — Digital Inquiry Group (formerly Stanford History Education Group)",
    note: "Evidence that evaluating online sources is a skill that needs explicit practice.",
    url: "https://cor.stanford.edu",
  },
  {
    label: "UNESCO — Media and Information Literacy Curriculum, 2nd ed. (2021)",
    note: "“Media and information literate citizens: think critically, click wisely!” — the international MIL competency framework.",
    url: "https://www.unesco.org/en/articles/media-and-information-literate-citizens-think-critically-click-wisely",
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
            comments. The score is where your judgment starts, not where it ends
            — so the pattern-reading skill stays with you.
          </Text>
        </View>
      </View>

      {/* The stated blind spot. Kratt's four categories are content signals —
          they read the text of comments. Coordination leaves other traces
          (timing, account age, cross-video networks) that this build doesn't
          measure, and a transparency pitch that hid that would undercut
          itself. Dashed border on purpose: a limitation, not a feature. */}
      <View style={styles.limitCard}>
        <Text style={styles.limitKicker}>WHAT KRATT CAN&apos;T SEE</Text>
        <Text style={styles.limitBody}>
          Kratt reads what comments say — not who posted them, or when. Real
          coordination also leaves traces in places this build doesn&apos;t
          look: a burst of comments in the minutes after upload, clusters of
          freshly created accounts, the same account pushing the same line
          across unrelated videos.
        </Text>
        <Text style={styles.limitBody}>
          Those signals matter; Kratt just doesn&apos;t measure them yet. A
          comment section can score clean here and still be coordinated in ways
          only timing and account data would reveal. Treat the score as one lens
          on the section, not the whole picture.
        </Text>
      </View>

      <Text style={[theme.type.monoLabel, styles.sourcesLabel]}>
        SOURCES &amp; FURTHER READING
      </Text>
      <View style={styles.sourceList}>
        {SOURCES.map((source, index) => (
          <Pressable
            key={source.url}
            accessibilityRole="link"
            accessibilityLabel={`Open source ${index + 1}: ${source.label}`}
            onPress={() => Linking.openURL(source.url)}
            style={({ pressed }) => [
              styles.sourceRow,
              pressed && { opacity: 0.7 },
            ]}
          >
            <Text style={styles.sourceTitle}>
              <Text style={styles.sourceNumber}>[{index + 1}]</Text>{" "}
              {source.label}
            </Text>
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
    // Deliberately NOT a surface card: dashed hairline, no fill, mono kicker.
    // The compare cards above state features; this states a limitation, and
    // the different dress keeps the two kinds of claim from blurring.
    limitCard: {
      borderWidth: 1,
      borderStyle: "dashed",
      borderColor: color.borderStrong,
      borderRadius: radius.md,
      padding: 20,
      gap: 10,
      marginBottom: 40,
    },
    limitKicker: {
      ...type.monoLabel,
      color: color.ink,
    },
    limitBody: {
      ...type.body,
      maxWidth: 620,
    },
    sourcesLabel: {
      marginBottom: 12,
    },
    sourceNumber: {
      fontFamily: font.mono,
      color: color.inkFaint,
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
