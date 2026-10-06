// "Evidence categories": the four buckets every comment lands in, plus a
// worked example of how the bot score falls out of them (one straw = 1%).
import { StyleSheet, Text, View } from "react-native";
import { useTheme } from "../../context/ThemeContext";
import { CATEGORIES } from "../../lib/categories";
import Stripes, { bars } from "../kratt/Stripes";
import Stamp from "../ui/Stamp";
import SectionShell, {
  chunk,
  columnsFor,
  Eyebrow,
  SectionTitle,
  useLandingLayout,
} from "./SectionShell";

// Illustrative breakdown for the example panel (matches the mock result).
const EXAMPLE = { ads_spam: 24, copy_paste: 18, low_effort: 25, genuine: 33 };
const EXAMPLE_BOT = 100 - EXAMPLE.genuine;
const CARD_GAP = 14;

function Bracket({ label, color, font }) {
  return (
    <View style={styles.bracket}>
      <View style={[styles.bracketLine, { backgroundColor: color }]} />
      <Text style={[styles.bracketLabel, { fontFamily: font.monoBold, color }]}>
        {label}
      </Text>
      <View style={[styles.bracketLine, { backgroundColor: color }]} />
    </View>
  );
}

export default function ResearchSection() {
  const theme = useTheme();
  const { color, font, type } = theme;
  const { isWide, contentWidth } = useLandingLayout();
  // 4, 2 or 1 columns — never a 3 + 1 split with a stranded last card.
  const fit = columnsFor(contentWidth, 210, CARD_GAP, 4);
  const columns = fit >= 4 ? 4 : fit >= 2 ? 2 : 1;

  const cards = CATEGORIES.map((category) => (
    <View
      key={category.key}
      style={[
        styles.card,
        { backgroundColor: color.surface, borderColor: color.border },
      ]}
    >
      <Stamp
        label={category.stamp}
        color={theme.category[category.key]}
        style={styles.cardStamp}
      />
      <Text
        style={[
          styles.cardTitle,
          { fontFamily: font.displayBold, color: color.ink },
        ]}
      >
        {category.label}
      </Text>
      <Text
        style={[
          styles.cardBody,
          { fontFamily: font.sans, color: color.inkMuted },
        ]}
      >
        {category.description}
      </Text>
    </View>
  ));

  return (
    <SectionShell>
      <View style={[styles.header, isWide && styles.headerWide]}>
        <View style={isWide ? styles.half : null}>
          <Eyebrow>EVIDENCE CATEGORIES</Eyebrow>
          <SectionTitle>The four categories Kratt reads</SectionTitle>
        </View>
        <Text style={[type.bodyLarge, styles.intro, isWide && styles.half]}>
          These categories draw on signals commonly used in research on
          inauthentic behavior across major platforms — repetitive language
          patterns, duplicated and copy-pasted comments, and the telltale
          structure of promotional messages. Every comment is sorted into one
          category, and the bot score is simply the share of comments that
          don&apos;t read as genuine.
        </Text>
      </View>

      <View style={styles.cards}>
        {chunk(cards, columns).map((row, index) => (
          <View key={index} style={styles.cardRow}>
            {row}
          </View>
        ))}
      </View>

      <View
        style={[
          styles.example,
          { backgroundColor: color.surface, borderColor: color.border },
        ]}
      >
        <View style={styles.exampleHead}>
          <Eyebrow style={styles.flush}>
            EXAMPLE · ONE STRAW = 1% OF COMMENTS
          </Eyebrow>
          <Text
            style={[
              styles.formula,
              { fontFamily: font.mono, color: color.inkMuted },
            ]}
          >
            bot score = 100 − genuine
          </Text>
        </View>

        <View
          accessible
          accessibilityRole="image"
          accessibilityLabel={`Example: bot score ${EXAMPLE_BOT}% from spam ${EXAMPLE.ads_spam}%, copy-paste ${EXAMPLE.copy_paste}% and low effort ${EXAMPLE.low_effort}%; genuine ${EXAMPLE.genuine}%`}
          style={styles.exampleChart}
        >
          <View style={[styles.exampleSide, { flex: EXAMPLE_BOT }]}>
            <Bracket
              label={`BOT SCORE ${EXAMPLE_BOT}%`}
              color={color.ember}
              font={font}
            />
            <View style={styles.strawRow}>
              {["ads_spam", "copy_paste", "low_effort"].map((key) => (
                <View key={key} style={{ flex: EXAMPLE[key] }}>
                  <Stripes stops={bars(theme.category[key], 4, 2)} />
                </View>
              ))}
            </View>
          </View>
          <View style={[styles.exampleSide, { flex: EXAMPLE.genuine }]}>
            <Bracket
              label={`GENUINE ${EXAMPLE.genuine}%`}
              color={theme.category.genuine}
              font={font}
            />
            <View style={styles.strawRow}>
              <View style={styles.fill}>
                <Stripes stops={bars(theme.category.genuine, 4, 2)} />
              </View>
            </View>
          </View>
        </View>

        <View style={styles.exampleLegend}>
          {CATEGORIES.map(({ key, stamp }) => (
            <Text
              key={key}
              style={[
                styles.legendText,
                { fontFamily: font.mono, color: color.inkMuted },
              ]}
            >
              {stamp} {EXAMPLE[key]}%
            </Text>
          ))}
        </View>
      </View>
    </SectionShell>
  );
}

const styles = StyleSheet.create({
  header: {
    gap: 20,
    marginBottom: 48,
  },
  headerWide: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 72,
  },
  half: {
    flex: 1,
    minWidth: 0,
  },
  intro: {
    fontSize: 16,
    lineHeight: 26,
  },
  cards: {
    gap: CARD_GAP,
    marginBottom: 20,
  },
  cardRow: {
    flexDirection: "row",
    gap: CARD_GAP,
  },
  card: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 14,
    paddingTop: 24,
    paddingHorizontal: 22,
    paddingBottom: 26,
  },
  cardStamp: {
    marginBottom: 36,
  },
  cardTitle: {
    fontSize: 24,
    lineHeight: 29,
    letterSpacing: -0.6,
    marginBottom: 8,
  },
  cardBody: {
    fontSize: 15,
    lineHeight: 22,
  },
  example: {
    borderWidth: 1,
    borderRadius: 14,
    paddingTop: 26,
    paddingHorizontal: 28,
    paddingBottom: 24,
  },
  exampleHead: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    alignItems: "baseline",
    columnGap: 16,
    rowGap: 6,
    marginBottom: 14,
  },
  flush: {
    marginBottom: 0,
  },
  formula: {
    fontSize: 13,
  },
  exampleChart: {
    flexDirection: "row",
    gap: 6,
  },
  exampleSide: {
    gap: 8,
  },
  bracket: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  bracketLine: {
    flex: 1,
    height: 1,
  },
  bracketLabel: {
    fontSize: 13,
  },
  strawRow: {
    flexDirection: "row",
    gap: 6,
    height: 56,
  },
  fill: {
    flex: 1,
  },
  exampleLegend: {
    flexDirection: "row",
    flexWrap: "wrap",
    columnGap: 22,
    rowGap: 6,
    marginTop: 14,
  },
  legendText: {
    fontSize: 12,
  },
});
