import { useEffect } from "react";
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import {
  useLocalSearchParams,
  useRootNavigationState,
  useRouter,
} from "expo-router";
import { useAnalysis } from "../../context/AnalysisContext";
import { useTheme } from "../../context/ThemeContext";
import Button from "../../components/ui/Button";
import CategoryCard from "../../components/ui/CategoryCard";
import SourceChecklist from "../../components/ui/SourceChecklist";
import Stamp from "../../components/ui/Stamp";
import StrawBar from "../../components/ui/StrawBar";
import ThemedStatusBar from "../../components/ui/ThemedStatusBar";
import VideoHeader from "../../components/ui/VideoHeader";
import { CATEGORIES } from "../../lib/categories";
import { TIER_LABELS, tierForScore } from "../../lib/riskLevels";
import { canonicalUrl, parseVideoId } from "../../lib/youtube";

// stamp chip text per category key, for the flagged-comment rows.
const STAMP_BY_KEY = Object.fromEntries(
  CATEGORIES.map((category) => [category.key, category.stamp])
);

const CONTENT_MAX = 760;
const GUTTER = 24;

/**
 * Response shape per docs/api-contract.md (`POST /analyze`):
 * @typedef {Object} AnalysisResult
 * @property {number} bot_percentage 0–100, `100 - breakdown.genuine`
 * @property {{ads_spam: number, copy_paste: number, low_effort: number, genuine: number}} breakdown percentages, sum ~100
 * @property {number} total_comments_analyzed
 * @property {{text: string, category: string}[]} sample_flagged_comments each flagged sample plus the backend's computed category
 */

export default function AnalysisScreen() {
  const router = useRouter();
  const theme = useTheme();
  const { color, font, type, risk } = theme;
  const { videoId } = useLocalSearchParams();
  const { videoUrl, setVideoUrl, result, reset } = useAnalysis();
  const { width } = useWindowDimensions();
  // On a cold deep link this screen mounts before the root navigator is
  // ready; navigating then throws. Wait for the root state key.
  const navigationReady = Boolean(useRootNavigationState()?.key);

  // The API is POST-only (no per-id GET), so a result only exists in memory.
  // It has to belong to THIS id — otherwise (deep link, web refresh, stale
  // result from a previous run) re-run the analysis through the normal
  // analyzing flow instead of rendering nothing or the wrong video's data.
  const hasMatchingResult =
    Boolean(result) &&
    typeof videoId === "string" &&
    parseVideoId(videoUrl) === videoId;

  useEffect(() => {
    if (hasMatchingResult || !navigationReady) return;
    if (typeof videoId === "string" && videoId.length > 0) {
      setVideoUrl(canonicalUrl(videoId));
      router.replace("/analyzing");
    } else {
      router.replace("/home");
    }
  }, [hasMatchingResult, navigationReady, videoId, setVideoUrl, router]);

  if (!hasMatchingResult) {
    return null;
  }

  const {
    bot_percentage,
    breakdown,
    total_comments_analyzed,
    sample_flagged_comments,
  } = result;

  // Temporary: shows what this screen actually received, so a data problem
  // (list differs from the [kratt-api] log) can be told apart from a rendering
  // problem (list matches, but the rows look wrong on screen).
  console.log(`[kratt-render][${Platform.OS}] evidence list`, {
    videoId,
    bot_percentage,
    sampleCount: sample_flagged_comments?.length,
    samples: sample_flagged_comments?.map(
      (c, i) => `${i + 1}. [${c?.category}] ${c?.text}`
    ),
  });

  const contentWidth = Math.min(width, CONTENT_MAX) - GUTTER * 2;
  const twoColumns = contentWidth >= 612;
  const narrow = contentWidth < 480;

  const tier = tierForScore(bot_percentage);
  const tierColor = risk[tier].main;

  // Honest framing for the evidence list: the API sends a small sample, not
  // every flagged comment — the label must not imply otherwise.
  const flaggedTotal = Math.round(
    (total_comments_analyzed * (100 - (breakdown.genuine ?? 0))) / 100
  );

  const handleAnalyzeAnother = () => {
    reset();
    router.replace("/home");
  };

  const cards = CATEGORIES.map((category) => (
    <CategoryCard
      key={category.key}
      stamp={category.stamp}
      label={category.label}
      description={category.description}
      percent={breakdown[category.key] ?? 0}
      color={theme.category[category.key]}
      neutral={Boolean(category.neutral)}
      style={styles.cell}
    />
  ));
  const cardRows = twoColumns
    ? [cards.slice(0, 2), cards.slice(2, 4)]
    : cards.map((card) => [card]);

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.scroll}>
      <ThemedStatusBar />
      <View style={styles.topBar}>
        <Button
          label="← Home"
          variant="secondary"
          size="sm"
          onPress={() => router.push("/")}
        />
      </View>

      <View style={styles.content}>
        <Text style={[type.monoLabel, styles.sectionLabel]}>
          ANALYSIS RESULT
        </Text>
        {/* Thumbnail + oEmbed title/channel; falls back to the raw URL. */}
        <VideoHeader
          videoId={videoId}
          style={[styles.videoHeader, { borderBottomColor: color.border }]}
        />

        <View style={styles.scoreRow}>
          <View>
            <View style={styles.scoreLine}>
              <Text
                style={[
                  styles.score,
                  { fontFamily: font.monoBold, color: tierColor },
                  narrow && styles.scoreNarrow,
                ]}
              >
                {bot_percentage}
              </Text>
              <Text
                style={[
                  styles.scorePercent,
                  { fontFamily: font.monoBold, color: tierColor },
                  narrow && styles.scorePercentNarrow,
                ]}
              >
                %
              </Text>
            </View>
            <Text style={[type.body, styles.scoreCaption]}>
              likely bot activity
            </Text>
          </View>
          <View style={[styles.tierCol, narrow && styles.tierColNarrow]}>
            <View
              style={[styles.tierPill, { backgroundColor: risk[tier].tint }]}
            >
              <View style={[styles.tierDot, { backgroundColor: tierColor }]} />
              <Text
                style={[
                  styles.tierText,
                  { fontFamily: font.sansBold, color: tierColor },
                ]}
              >
                {TIER_LABELS[tier]}
              </Text>
            </View>
            <Text style={type.small}>
              Based on {total_comments_analyzed.toLocaleString("en-US")}{" "}
              comments analyzed
            </Text>
          </View>
        </View>

        <StrawBar breakdown={breakdown} narrow={narrow} style={styles.straws} />

        <Text style={[type.monoLabel, styles.sectionLabel]}>
          EVIDENCE CATEGORIES
        </Text>
        <View style={styles.grid}>
          {cardRows.map((row, index) => (
            <View key={index} style={styles.gridRow}>
              {row}
            </View>
          ))}
        </View>

        {sample_flagged_comments?.length > 0 ? (
          <>
            <Text style={[type.monoLabel, styles.sectionLabel]}>
              SAMPLE OF FLAGGED COMMENTS — {sample_flagged_comments.length} OF ~
              {flaggedTotal.toLocaleString("en-US")} DETECTED
            </Text>
            <View
              style={[styles.flaggedList, { borderTopColor: color.border }]}
            >
              {sample_flagged_comments.map((comment, index) => {
                // The backend ships the category it computed for each flagged
                // comment (docs/api-contract.md) — render it directly.
                const reasonKey = comment.category;
                // No category means a backend on the pre-2026-07-26 contract
                // (see lib/api.js): drop the stamp rather than render an
                // empty one.
                const stamp = reasonKey ? (
                  <Stamp
                    label={STAMP_BY_KEY[reasonKey] ?? reasonKey}
                    color={theme.category[reasonKey] ?? color.inkMuted}
                  />
                ) : null;
                return (
                  <View
                    key={index}
                    style={[
                      styles.flaggedRow,
                      { borderBottomColor: color.border },
                    ]}
                  >
                    <Text
                      style={[
                        styles.flaggedIndex,
                        { fontFamily: font.monoBold, color: color.accent },
                      ]}
                    >
                      #{String(index + 1).padStart(2, "0")}
                    </Text>
                    <View style={styles.flaggedBody}>
                      <Text
                        style={[
                          styles.flaggedText,
                          { fontFamily: font.displayMedium, color: color.ink },
                        ]}
                      >
                        “{comment.text}”
                      </Text>
                      {narrow ? stamp : null}
                    </View>
                    {narrow ? null : stamp}
                  </View>
                );
              })}
            </View>
          </>
        ) : null}

        <SourceChecklist style={styles.checklist} />

        <Text style={[styles.footnote, { fontFamily: font.sans }]}>
          This score is a starting point for critical thinking, not a final
          verdict — read the examples and judge for yourself.
        </Text>

        <Button
          label="Analyze another video"
          onPress={handleAnalyzeAnother}
          style={styles.button}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  scroll: {
    paddingBottom: 72,
  },
  topBar: {
    width: "100%",
    maxWidth: 1200,
    alignSelf: "center",
    height: 72,
    paddingHorizontal: GUTTER,
    flexDirection: "row",
    alignItems: "center",
  },
  content: {
    width: "100%",
    maxWidth: CONTENT_MAX,
    alignSelf: "center",
    paddingHorizontal: GUTTER,
    paddingTop: 8,
  },
  sectionLabel: {
    marginBottom: 14,
  },
  videoHeader: {
    paddingBottom: 26,
    borderBottomWidth: 1,
    marginBottom: 34,
  },
  scoreRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "flex-end",
    justifyContent: "space-between",
    gap: 24,
    marginBottom: 22,
  },
  scoreLine: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 4,
  },
  score: {
    fontSize: 112,
    lineHeight: 100,
    letterSpacing: -5.6,
  },
  scoreNarrow: {
    fontSize: 88,
    lineHeight: 80,
    letterSpacing: -4.4,
  },
  scorePercent: {
    fontSize: 42,
    lineHeight: 46,
  },
  scorePercentNarrow: {
    fontSize: 34,
    lineHeight: 38,
  },
  scoreCaption: {
    fontSize: 16,
    marginTop: 10,
  },
  tierCol: {
    alignItems: "flex-end",
    gap: 10,
  },
  tierColNarrow: {
    alignItems: "flex-start",
  },
  tierPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    height: 30,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  tierDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },
  tierText: {
    fontSize: 13.5,
  },
  straws: {
    marginBottom: 34,
  },
  grid: {
    gap: 12,
    marginBottom: 44,
  },
  gridRow: {
    flexDirection: "row",
    gap: 12,
  },
  cell: {
    flex: 1,
  },
  flaggedList: {
    borderTopWidth: 1,
    marginBottom: 44,
  },
  flaggedRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    paddingVertical: 18,
    borderBottomWidth: 1,
  },
  flaggedIndex: {
    width: 36,
    fontSize: 12,
  },
  flaggedBody: {
    flex: 1,
    gap: 10,
  },
  flaggedText: {
    fontSize: 19,
    lineHeight: 26,
    letterSpacing: -0.2,
  },
  checklist: {
    marginBottom: 28,
  },
  footnote: {
    fontSize: 14,
    lineHeight: 22,
    color: "rgba(241,234,219,0.55)",
    marginBottom: 26,
  },
  button: {
    alignSelf: "flex-start",
  },
});
