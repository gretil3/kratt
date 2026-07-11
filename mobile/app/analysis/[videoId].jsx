import { useEffect, useMemo } from "react";
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
import { useAnalysis } from "../../context/AnalysisContext";
import { useTheme } from "../../context/ThemeContext";
import PillButton from "../../components/ui/PillButton";
import CategoryCard from "../../components/ui/CategoryCard";
import GuessPanel from "../../components/ui/GuessPanel";
import ScoreGauge from "../../components/ui/ScoreGauge";
import SourceChecklist from "../../components/ui/SourceChecklist";
import ThemeToggle from "../../components/ui/ThemeToggle";
import ThemedStatusBar from "../../components/ui/ThemedStatusBar";
import { CATEGORIES } from "../../lib/categories";
import { levelForShare } from "../../lib/riskLevels";
import { canonicalUrl, parseVideoId } from "../../lib/youtube";
import { accent } from "../../theme/themes";

/**
 * Response shape per docs/api-contract.md (`POST /analyze`):
 * @typedef {Object} AnalysisResult
 * @property {number} bot_percentage 0–100, `100 - breakdown.genuine`
 * @property {{ads_spam: number, copy_paste: number, low_effort: number, genuine: number}} breakdown percentages, sum ~100
 * @property {number} total_comments_analyzed
 * @property {string[]} sample_flagged_comments
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
  const { videoUrl, setVideoUrl, result, reset, guess, setGuess } =
    useAnalysis();
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

  // Guess-before-reveal: the result stays hidden until the user commits an
  // estimate. `guess` is reset on every runAnalysis, so re-runs (deep links,
  // refreshes, new videos) always pass through this step.
  if (guess == null) {
    return (
      <ScrollView style={styles.screen} contentContainerStyle={styles.guessScroll}>
        <ThemedStatusBar />
        <GuessPanel onSubmit={setGuess} />
      </ScrollView>
    );
  }

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.scroll}>
      <ThemedStatusBar />
      <View style={styles.content}>
        <View style={styles.headerRow}>
          <Text style={theme.type.monoLabel}>ANALYSIS RESULT</Text>
          <ThemeToggle />
        </View>
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

        <View style={styles.guessCompare}>
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
            <Text style={[theme.type.monoLabel, styles.sectionLabel]}>
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
    headerRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
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
    guessScroll: {
      flexGrow: 1,
      justifyContent: "center",
      padding: 24,
    },
    gaugeBlock: {
      alignItems: "center",
      marginBottom: 20,
    },
    guessCompare: {
      backgroundColor: color.surface,
      borderWidth: 1,
      borderColor: color.border,
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
