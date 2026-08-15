import { useEffect, useMemo } from "react";
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
import PillButton from "../../components/ui/PillButton";
import CategoryCard from "../../components/ui/CategoryCard";
import CompositionBar from "../../components/ui/CompositionBar";
import GradientBlob from "../../components/ui/GradientBlob";
import ScoreGauge from "../../components/ui/ScoreGauge";
import SourceChecklist from "../../components/ui/SourceChecklist";
import ThemeToggle from "../../components/ui/ThemeToggle";
import ThemedStatusBar from "../../components/ui/ThemedStatusBar";
import VideoHeader from "../../components/ui/VideoHeader";
import { CATEGORIES } from "../../lib/categories";
import { canonicalUrl, parseVideoId } from "../../lib/youtube";
import { accent } from "../../theme/themes";

// stamp chip text per category key, for the flagged-comment rows.
const STAMP_BY_KEY = Object.fromEntries(
  CATEGORIES.map((category) => [category.key, category.stamp])
);

/**
 * Response shape per docs/api-contract.md (`POST /analyze`):
 * @typedef {Object} AnalysisResult
 * @property {number} bot_percentage 0–100, `100 - breakdown.genuine`
 * @property {{ads_spam: number, copy_paste: number, low_effort: number, genuine: number}} breakdown percentages, sum ~100
 * @property {number} total_comments_analyzed
 * @property {{text: string, category: string}[]} sample_flagged_comments each flagged sample plus the backend's computed category
 */

// One neutral, non-lecturing sentence about the gap between instinct and
// evidence. Ten points either way counts as agreement.
function reflectionFor(guess, actual) {
  if (Math.abs(guess - actual) <= 10) {
    return "Close — your read of this comment section roughly matches the pattern evidence.";
  }
  if (guess < actual) {
    return "The section reads more automated than it looked — engineered comments are written to blend in.";
  }
  return "The section reads more human than it looked — an off-feeling comment section isn't always staged.";
}

export default function AnalysisScreen() {
  const router = useRouter();
  const theme = useTheme();
  const styles = useMemo(() => makeStyles(theme), [theme]);
  const { videoId } = useLocalSearchParams();
  const { videoUrl, setVideoUrl, result, reset, guess } = useAnalysis();
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

  const twoColumns = width >= 400;

  // Agreement threshold matches reflectionFor: within 10 points is "close".
  const guessPalette =
    Math.abs(guess - bot_percentage) <= 10 ? theme.risk.low : theme.risk.medium;

  // Honest framing for the evidence list: the API sends a small sample, not
  // every flagged comment — the label must not imply otherwise.
  const flaggedTotal = Math.round(
    (total_comments_analyzed * (100 - (breakdown.genuine ?? 0))) / 100
  );

  const handleAnalyzeAnother = () => {
    reset();
    router.replace("/home");
  };

  // Guess-before-reveal is enforced upstream: /analyzing only navigates here
  // once BOTH the result and the locked guess exist, and the deep-link
  // recovery above re-routes through /analyzing (which resets the guess), so
  // by this point `guess` is always set.
  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.scroll}>
      <ThemedStatusBar />
      <View style={styles.content}>
        <View style={styles.headerRow}>
          <Text style={theme.type.monoLabel}>ANALYSIS RESULT</Text>
          <ThemeToggle />
        </View>
        {/* Thumbnail + oEmbed title/channel; falls back to the raw URL. */}
        <VideoHeader videoId={videoId} style={styles.videoHeader} />

        <View style={styles.divider} />

        <View style={styles.gaugeBlock}>
          <ScoreGauge value={bot_percentage} />
          <Text style={styles.gaugeFootnote}>
            Based on {total_comments_analyzed.toLocaleString("en-US")} comments
            analyzed
          </Text>
        </View>

        {/* Bridges the gauge to the category cards: the same numbers, as one
            proportional bar in the cards' colors. */}
        <CompositionBar breakdown={breakdown} style={styles.composition} />

        <View
          style={[
            styles.guessCompare,
            {
              // Calibration tint reuses reflectionFor's 10-point agreement
              // threshold: a close guess reads calm (low), a big miss warms
              // to amber (medium) — same conditional, styling only.
              borderLeftColor: guessPalette.main,
              backgroundColor: guessPalette.tint,
            },
          ]}
        >
          <Text style={styles.guessCompareLine}>
            Your guess: {guess}% — Kratt: {bot_percentage}%
          </Text>
          <Text style={styles.guessCompareNote}>
            {reflectionFor(guess, bot_percentage)}
          </Text>
        </View>

        <Text style={[theme.type.monoLabel, styles.sectionLabel]}>
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
                neutral={Boolean(category.neutral)}
                style={[
                  styles.cell,
                  { flexBasis: twoColumns ? "47%" : "100%" },
                ]}
              />
            );
          })}
        </View>

        {sample_flagged_comments?.length > 0 ? (
          <>
            <Text style={[theme.type.monoLabel, styles.sectionLabel]}>
              SAMPLE OF FLAGGED COMMENTS — {sample_flagged_comments.length} OF ~
              {flaggedTotal.toLocaleString("en-US")} DETECTED
            </Text>
            <View style={styles.flaggedList}>
              {sample_flagged_comments.map((comment, index) => {
                // The backend ships the category it computed for each flagged
                // comment (docs/api-contract.md) — render it directly.
                const reasonKey = comment.category;
                return (
                  <View key={index} style={styles.flaggedRow}>
                    <Text style={styles.flaggedIndex}>
                      #{String(index + 1).padStart(2, "0")}
                    </Text>
                    <Text style={styles.flaggedText}>“{comment.text}”</Text>
                    {/* No category means a backend on the pre-2026-07-26
                        contract (see lib/api.js). Drop the chip rather than
                        render an empty gradient pill with no label in it. */}
                    {reasonKey ? (
                      <View style={styles.flagChip}>
                        <GradientBlob
                          colors={
                            theme.gradients[reasonKey] ?? theme.gradients.brand
                          }
                          seed={index}
                          style={StyleSheet.absoluteFill}
                        />
                        <Text style={styles.flagChipText}>
                          {STAMP_BY_KEY[reasonKey] ?? reasonKey}
                        </Text>
                      </View>
                    ) : null}
                  </View>
                );
              })}
            </View>
          </>
        ) : null}

        <SourceChecklist style={styles.checklist} />

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

function makeStyles(theme) {
  const { color, font, radius, type } = theme;
  return StyleSheet.create({
    // Transparent: the shared bg + constellation live in app/_layout.jsx.
    screen: {
      flex: 1,
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
    headerRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    videoHeader: {
      marginTop: 12,
    },
    divider: {
      height: 1,
      backgroundColor: color.border,
      marginTop: 20,
      marginBottom: 28,
    },
    gaugeBlock: {
      alignItems: "center",
      marginBottom: 20,
    },
    composition: {
      marginBottom: 24,
    },
    // Left-accent + tint are set inline from the guess delta.
    guessCompare: {
      borderWidth: 1,
      borderColor: color.border,
      borderLeftWidth: 2,
      borderRadius: radius.md,
      padding: 16,
      gap: 6,
      marginBottom: 36,
    },
    guessCompareLine: {
      fontFamily: font.monoBold,
      fontSize: 14,
      lineHeight: 20,
      color: color.ink,
    },
    guessCompareNote: {
      ...type.small,
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
      borderLeftColor: accent.violet,
      borderRadius: radius.sm,
      padding: 14,
    },
    flaggedIndex: {
      fontFamily: font.monoBold,
      fontSize: 12,
      lineHeight: 21,
      color: accent.violet,
    },
    flaggedText: {
      ...type.body,
      flex: 1,
    },
    flagChip: {
      alignSelf: "flex-start",
      overflow: "hidden",
      borderRadius: radius.sm,
      paddingHorizontal: 8,
      paddingVertical: 4,
    },
    flagChipText: {
      fontFamily: font.monoBold,
      fontSize: 10,
      letterSpacing: 1,
      color: "#FFFFFF",
    },
    checklist: {
      marginBottom: 28,
    },
    footnote: {
      ...type.small,
      marginBottom: 24,
    },
    button: {
      alignSelf: "flex-start",
    },
  });
}
