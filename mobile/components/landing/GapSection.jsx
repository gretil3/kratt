// "Why Kratt" — the research-gap positioning: most detectors output a score
// and ask for trust; Kratt shows the evidence so the user practices reading
// patterns. Ends with paraphrased sources (URLs only, no long quotes).
import { Linking, Pressable, StyleSheet, Text, View } from "react-native";
import { useTheme } from "../../context/ThemeContext";
import { webStyle } from "../../theme/webStyle";
import BucketHead from "../kratt/BucketHead";
import SectionShell, {
  chunk,
  columnsFor,
  Eyebrow,
  SectionTitle,
  useLandingLayout,
} from "./SectionShell";

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
    alarm: true,
  },
  {
    label: "SCAM CAMPAIGNS FOUND",
    value: "72",
    caption: "run through those comments",
    source: "Na Ho Seung, 2023",
    alarm: true,
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
  const { color, font, type } = theme;
  const { width, isWide, contentWidth } = useLandingLayout();
  // 4, 2 or 1 columns — never a 3 + 1 split with a stranded last stat.
  const fit = columnsFor(contentWidth, 240, 1, 4);
  const statColumns = fit >= 4 ? 4 : fit >= 2 ? 2 : 1;
  // clamp(26px, 2.8vw, 40px)
  const statSize = Math.min(40, Math.max(26, width * 0.028));

  const paragraph = [
    styles.compareBody,
    { fontFamily: font.sans, color: color.inkMuted },
  ];
  const emphasis = (tint) => ({ fontFamily: font.sansBold, color: tint });

  return (
    <SectionShell>
      <Eyebrow>WHY KRATT</Eyebrow>
      <SectionTitle style={styles.title}>
        A score you can argue with
      </SectionTitle>

      {/* 1px gaps over the border color draw the dividers between cells. */}
      <View
        style={[
          styles.stats,
          {
            backgroundColor: color.border,
            borderTopColor: color.borderStrong,
            borderBottomColor: color.border,
          },
        ]}
      >
        {chunk(STATS, statColumns).map((row, rowIndex) => (
          <View key={rowIndex} style={styles.statRow}>
            {row.map((stat) => (
              <View
                key={stat.label}
                style={[styles.stat, { backgroundColor: color.bg }]}
              >
                <Text style={[type.monoLabel, styles.statLabel]}>
                  {stat.label}
                </Text>
                <Text
                  numberOfLines={1}
                  style={[
                    styles.statValue,
                    {
                      fontFamily: font.monoBold,
                      fontSize: statSize,
                      lineHeight: statSize * 1.1,
                      letterSpacing: -statSize * 0.02,
                      color: stat.alarm ? color.ember : color.ink,
                    },
                  ]}
                >
                  {stat.value}
                </Text>
                <Text
                  style={[
                    styles.statCaption,
                    { fontFamily: font.sans, color: color.inkMuted },
                  ]}
                >
                  {stat.caption}
                </Text>
                <Text
                  style={[
                    styles.statSource,
                    { fontFamily: font.mono, color: color.inkFaint },
                  ]}
                >
                  {stat.source}
                </Text>
              </View>
            ))}
          </View>
        ))}
      </View>

      <View style={[styles.compare, isWide && styles.compareWide]}>
        <View
          style={[
            styles.compareCard,
            { backgroundColor: color.surface, borderColor: color.border },
          ]}
        >
          <View style={styles.compareHead}>
            <View style={styles.dashedBox} />
            <Eyebrow style={styles.flush}>MOST DETECTION TOOLS</Eyebrow>
          </View>
          <Text style={paragraph}>
            The fact checkers assess the credibility of the statements made in
            the video rather than the evidence found in the comment section
            underneath the video. The bots mimic real users, interact with real
            users comments, and use self-interaction techniques to push
            themselves into the position of top-rated comments.{" "}
            <Text style={emphasis(color.ember)}>
              Thus, the most visible comments are usually not genuine.
            </Text>
          </Text>
        </View>

        <View
          style={[
            styles.compareCard,
            {
              backgroundColor: color.surfaceAlt,
              borderColor: color.accentBorder,
            },
          ]}
        >
          <View style={styles.compareHead}>
            <BucketHead width={24} handle={false} animate={false} />
            <Eyebrow color={color.accent} style={styles.flush}>
              KRATT
            </Eyebrow>
          </View>
          <Text style={[paragraph, { color: "rgba(241,234,219,0.78)" }]}>
            This is the gap that Kratt aims to fill with the app: a free,
            sign-up free mobile, web based application tool that allows any
            young viewers to insert a YouTube link and get an assessment of the
            comment section in evidence-based categories and not a set-in
            decision of believing one way or another, but{" "}
            <Text style={emphasis(theme.category.genuine)}>
              an analytical approach that helps the users to find the pattern by
              themself.
            </Text>
          </Text>
        </View>
      </View>

      <Eyebrow style={styles.sourcesLabel}>
        SOURCES &amp; FURTHER READING
      </Eyebrow>
      <View style={[styles.sources, { borderTopColor: color.border }]}>
        {SOURCES.map((source, index) => (
          <Pressable
            key={source.url}
            accessibilityRole="link"
            accessibilityLabel={`Open source: ${source.label}`}
            onPress={() => Linking.openURL(source.url)}
            style={({ hovered, pressed }) => [
              styles.source,
              { borderBottomColor: color.border },
              (hovered || pressed) && {
                backgroundColor: "rgba(241,234,219,0.03)",
              },
            ]}
          >
            <Text
              style={[
                styles.sourceIndex,
                { fontFamily: font.mono, color: color.inkFaint },
              ]}
            >
              [{index + 1}]
            </Text>
            <View style={styles.sourceText}>
              <Text
                style={[
                  styles.sourceTitle,
                  { fontFamily: font.sansBold, color: color.ink },
                ]}
              >
                {source.label}
              </Text>
              <Text
                style={[
                  styles.sourceUrl,
                  { fontFamily: font.mono, color: color.inkFaint },
                  webStyle({ wordBreak: "break-all" }),
                ]}
              >
                {source.url}
              </Text>
            </View>
            <Text
              style={[
                styles.sourceArrow,
                { fontFamily: font.mono, color: color.accent },
              ]}
            >
              ↗
            </Text>
          </Pressable>
        ))}
      </View>
    </SectionShell>
  );
}

const styles = StyleSheet.create({
  title: {
    marginBottom: 44,
  },
  stats: {
    gap: 1,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    marginBottom: 40,
  },
  statRow: {
    flexDirection: "row",
    gap: 1,
  },
  stat: {
    flex: 1,
    paddingVertical: 26,
    paddingHorizontal: 24,
  },
  statLabel: {
    fontSize: 11,
    letterSpacing: 1.3,
    marginBottom: 18,
  },
  statValue: {
    marginBottom: 10,
  },
  statCaption: {
    fontSize: 14.5,
    lineHeight: 21,
    marginBottom: 14,
  },
  statSource: {
    fontSize: 11,
  },
  compare: {
    gap: 16,
    marginBottom: 72,
  },
  compareWide: {
    flexDirection: "row",
  },
  compareCard: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 14,
    paddingTop: 30,
    paddingHorizontal: 30,
    paddingBottom: 32,
  },
  compareHead: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 18,
  },
  dashedBox: {
    width: 22,
    height: 22,
    borderRadius: 5,
    borderWidth: 1.5,
    borderStyle: "dashed",
    borderColor: "rgba(241,234,219,0.35)",
  },
  flush: {
    marginBottom: 0,
  },
  compareBody: {
    fontSize: 16.5,
    lineHeight: 27,
  },
  sourcesLabel: {
    marginBottom: 12,
  },
  sources: {
    borderTopWidth: 1,
  },
  source: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 16,
    paddingVertical: 18,
    borderBottomWidth: 1,
  },
  sourceIndex: {
    width: 28,
    fontSize: 12,
    lineHeight: 22,
  },
  sourceText: {
    flex: 1,
    gap: 4,
  },
  sourceTitle: {
    fontSize: 15.5,
    lineHeight: 22,
  },
  sourceUrl: {
    fontSize: 12,
    lineHeight: 17,
  },
  sourceArrow: {
    fontSize: 14,
    lineHeight: 22,
  },
});
