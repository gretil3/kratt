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

const STATS = [
  {
    label: "MAIN NEWS SOURCE",
    value: "44%",
    caption: "of 18-24s say social media",
    source: "Katerina, 2025",
  },
  {
    label: "VIDEO NEWS SINCE 2020",
    value: "52% → 65%",
    caption: "of how they watch news",
    source: "Katerina, 2025",
  },
  {
    label: "BOTS IN THE COMMENTS",
    value: "31.73%",
    caption: "of YouTube videos analyzed",
    source: "Na Ho Seung, 2023",
  },
  {
    label: "SCAM CAMPAIGNS FOUND",
    value: "72",
    caption: "run through those comments",
    source: "Na Ho Seung, 2023",
  },
];

const SOURCES = [
  {
    label:
      "Emily, K., & Pascal, M. (2024). Understanding news-related user comments and their effects: a systematic review.",
    url: "https://www.frontiersin.org/journals/communication/articles/10.3389/fcomm.2024.1447457/full",
  },
  {
    label:
      "Katerina, V. (2025, June 17). Reuters Institute Digital News Report 2025: a media ecosystem in flux.",
    url: "https://lab.imedd.org/en/reuters-institute-digital-news-report-2025-a-media-ecosystem-in-flux/",
  },
  {
    label:
      "Na Ho Seung, C. S. (2023). Evolving Bots: The New Generation of Comment Bots and their Underlying Scam Campaigns in YouTube.",
    url: "https://dl.acm.org/doi/10.1145/3618257.3624822",
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

      <View style={styles.statRow}>
        {STATS.map((stat) => (
          <View key={stat.label} style={styles.statCard}>
            <Text style={styles.statLabel}>{stat.label}</Text>
            <Text style={styles.statValue}>{stat.value}</Text>
            <Text style={styles.statCaption}>{stat.caption}</Text>
            <Text style={styles.statSource}>{stat.source}</Text>
          </View>
        ))}
      </View>

      <View style={[styles.compareRow, !isWide && styles.compareRowNarrow]}>
        <View style={styles.compareCard}>
          <Text style={styles.compareKicker}>MOST DETECTION TOOLS</Text>
          <Text style={styles.compareBody}>
            The fact checkers assess the credibility of the statements made in
            the video rather than the evidence found in the comment section
            underneath the video. The bots mimic real users, interact with
            real users comments, and use self-interaction techniques to push
            themselves into the position of top-rated comments.{" "}
            <Text style={styles.highlightWarn}>
              Thus, the most visible comments are usually not genuine.
            </Text>
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
            This is the gap that Kratt aims to fill with the app: a free,
            sign-up free mobile, web based application tool that allows any
            young viewers to insert a YouTube link and get an assessment of
            the comment section in evidence-based categories and not a
            set-in decision of believing one way or another, but{" "}
            <Text style={styles.highlightGood}>
              an analytical approach that helps the users to find the pattern
              by themself.
            </Text>
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
            style={({ pressed }) => [
              styles.sourceRow,
              pressed && { opacity: 0.7 },
            ]}
          >
            <Text style={styles.sourceTitle}>{source.label}</Text>
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
      marginBottom: 24,
    },
    statRow: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 12,
      marginBottom: 32,
    },
    statCard: {
      flexGrow: 1,
      flexBasis: 140,
      minWidth: 140,
      backgroundColor: color.surface,
      borderRadius: radius.md,
      padding: 16,
      gap: 4,
    },
    statLabel: {
      ...type.monoLabel,
    },
    statValue: {
      fontFamily: font.monoBold,
      fontSize: 26,
      lineHeight: 30,
      color: color.ink,
      marginTop: 2,
    },
    statCaption: {
      ...type.small,
      marginTop: 2,
    },
    statSource: {
      fontFamily: font.mono,
      fontSize: 10,
      letterSpacing: 0.4,
      color: color.inkFaint,
      marginTop: 6,
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
    highlightWarn: {
      fontFamily: font.sansBold,
      color: theme.risk.high.text,
    },
    highlightGood: {
      fontFamily: font.sansBold,
      color: theme.risk.low.text,
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
    sourceUrl: {
      fontFamily: font.mono,
      fontSize: 12,
      lineHeight: 18,
      color: color.inkMuted,
    },
  });
}
