import { useEffect } from "react";
import {
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
import { StatusBar } from "expo-status-bar";
import { useAnalysis } from "../../context/AnalysisContext";
import PillButton from "../../components/ui/PillButton";
import CategoryCard from "../../components/ui/CategoryCard";
import ScoreGauge from "../../components/ui/ScoreGauge";
import { CATEGORIES } from "../../lib/categories";
import { levelForShare } from "../../lib/riskLevels";
import { canonicalUrl, parseVideoId } from "../../lib/youtube";
import { color, font, radius, type } from "../../theme/darkTokens";

/**
 * Response shape per docs/api-contract.md (`POST /analyze`):
 * @typedef {Object} AnalysisResult
 * @property {number} bot_percentage 0–100, `100 - breakdown.genuine`
 * @property {{ads_spam: number, copy_paste: number, low_effort: number, genuine: number}} breakdown percentages, sum ~100
 * @property {number} total_comments_analyzed
 * @property {string[]} sample_flagged_comments
 */

export default function AnalysisScreen() {
  const router = useRouter();
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

  const twoColumns = width >= 400;

  const handleAnalyzeAnother = () => {
    reset();
    router.replace("/home");
  };

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.scroll}>
      <StatusBar style="light" />
      <View style={styles.content}>
        <Text style={type.monoLabel}>ANALYSIS RESULT</Text>
        {/* The contract has no videoTitle, so the canonical URL is the header. */}
        <Text style={styles.sourceUrl}>{canonicalUrl(videoId)}</Text>

        <View style={styles.divider} />

        <View style={styles.gaugeBlock}>
          <ScoreGauge value={bot_percentage} />
          <Text style={styles.gaugeFootnote}>
            Based on {total_comments_analyzed.toLocaleString("en-US")} comments
            analyzed
          </Text>
        </View>

        <Text style={[type.monoLabel, styles.sectionLabel]}>
          EVIDENCE CATEGORIES
        </Text>
        <View style={styles.grid}>
          {CATEGORIES.map((category, index) => {
            const percent = breakdown[category.key] ?? 0;
            return (
              <CategoryCard
                key={category.key}
                categoryKey={category.key}
                seed={index}
                stamp={category.stamp}
                label={category.label}
                description={category.description}
                percent={percent}
                level={category.neutral ? "neutral" : levelForShare(percent)}
                style={[
                  styles.cell,
                  { flexBasis: twoColumns ? "47%" : "100%" },
                ]}
              />
            );
          })}
        </View>

        {sample_flagged_comments.length > 0 ? (
          <>
            <Text style={[type.monoLabel, styles.sectionLabel]}>
              FLAGGED COMMENT EXAMPLES
            </Text>
            <View style={styles.flaggedList}>
              {sample_flagged_comments.map((comment, index) => (
                <View key={index} style={styles.flaggedRow}>
                  <Text style={styles.flaggedIndex}>
                    #{String(index + 1).padStart(2, "0")}
                  </Text>
                  <Text style={styles.flaggedText}>“{comment}”</Text>
                </View>
              ))}
            </View>
          </>
        ) : null}

        <Text style={styles.footnote}>
          This score is a starting point for critical thinking, not a final
          verdict — read the examples and judge for yourself.
        </Text>

        <PillButton
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
    backgroundColor: color.bg,
  },
  scroll: {
    padding: 24,
    paddingBottom: 48,
  },
  content: {
    width: "100%",
    maxWidth: 720,
    alignSelf: "center",
  },
  sourceUrl: {
    fontFamily: font.mono,
    fontSize: 14,
    lineHeight: 20,
    color: color.ink,
    marginTop: 8,
  },
  divider: {
    height: 1,
    backgroundColor: color.border,
    marginTop: 20,
    marginBottom: 28,
  },
  gaugeBlock: {
    alignItems: "center",
    marginBottom: 36,
  },
  gaugeFootnote: {
    ...type.small,
    marginTop: 14,
    textAlign: "center",
  },
  sectionLabel: {
    marginBottom: 12,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 32,
  },
  cell: {
    flexGrow: 1,
  },
  flaggedList: {
    gap: 10,
    marginBottom: 28,
  },
  flaggedRow: {
    flexDirection: "row",
    gap: 12,
    backgroundColor: color.surface,
    borderWidth: 1,
    borderColor: color.border,
    borderLeftWidth: 2,
    borderLeftColor: "#7C5CFF",
    borderRadius: radius.sm,
    padding: 14,
  },
  flaggedIndex: {
    fontFamily: font.monoBold,
    fontSize: 12,
    lineHeight: 21,
    color: "#7C5CFF",
  },
  flaggedText: {
    ...type.body,
    flex: 1,
  },
  footnote: {
    ...type.small,
    marginBottom: 24,
  },
  button: {
    alignSelf: "flex-start",
  },
});
