import { useEffect } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useAnalysis } from "../context/AnalysisContext";

const CATEGORY_ORDER = ["ads_spam", "copy_paste", "low_effort", "genuine"];

const CATEGORY_LABELS = {
  ads_spam: "Ads & spam",
  copy_paste: "Copy-paste",
  low_effort: "Low effort",
  genuine: "Genuine",
};

const CATEGORY_COLORS = {
  ads_spam: "#F87171",
  copy_paste: "#FBBF24",
  low_effort: "#60A5FA",
  genuine: "#34D399",
};

export default function ResultsScreen() {
  const router = useRouter();
  const { result, reset } = useAnalysis();

  // Guards against landing here directly (e.g. deep link, fast refresh) with
  // no result in context yet — bounce back to Home instead of rendering garbage.
  useEffect(() => {
    if (!result) {
      router.replace("/home");
    }
  }, [result, router]);

  if (!result) {
    return null;
  }

  const {
    bot_percentage,
    breakdown,
    total_comments_analyzed,
    sample_flagged_comments,
  } = result;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
    >
      <StatusBar style="light" />

      <Text style={styles.label}>Bot likelihood</Text>
      <Text style={styles.bigNumber}>{bot_percentage}%</Text>
      <Text style={styles.subLabel}>
        Based on {total_comments_analyzed.toLocaleString()} comments analyzed
      </Text>

      <View style={styles.breakdown}>
        {CATEGORY_ORDER.map((key) => (
          <View key={key} style={styles.barRow}>
            <View style={styles.barHeader}>
              <Text style={styles.barLabel}>{CATEGORY_LABELS[key]}</Text>
              <Text style={styles.barValue}>{breakdown[key]}%</Text>
            </View>
            <View style={styles.barTrack}>
              <View
                style={[
                  styles.barFill,
                  {
                    width: `${breakdown[key]}%`,
                    backgroundColor: CATEGORY_COLORS[key],
                  },
                ]}
              />
            </View>
          </View>
        ))}
      </View>

      {sample_flagged_comments.length > 0 ? (
        <View style={styles.flaggedSection}>
          <Text style={styles.flaggedTitle}>Flagged examples</Text>
          {sample_flagged_comments.map((comment, index) => (
            <View key={index} style={styles.flaggedCard}>
              <Text style={styles.flaggedText}>"{comment}"</Text>
            </View>
          ))}
        </View>
      ) : null}

      <Pressable
        style={({ pressed }) => [
          styles.button,
          pressed && styles.buttonPressed,
        ]}
        onPress={() => {
          reset();
          router.replace("/home");
        }}
      >
        <Text style={styles.buttonText}>Analyze another video</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0B0F1A",
  },
  content: {
    padding: 24,
    paddingBottom: 48,
  },
  label: {
    fontSize: 14,
    color: "#8A93A6",
    textAlign: "center",
  },
  bigNumber: {
    fontSize: 64,
    fontWeight: "800",
    color: "#FFFFFF",
    textAlign: "center",
  },
  subLabel: {
    fontSize: 13,
    color: "#8A93A6",
    textAlign: "center",
    marginBottom: 32,
  },
  breakdown: {
    gap: 18,
  },
  barRow: {
    gap: 6,
  },
  barHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  barLabel: {
    fontSize: 14,
    color: "#C7CCDA",
    fontWeight: "600",
  },
  barValue: {
    fontSize: 14,
    color: "#C7CCDA",
  },
  barTrack: {
    height: 10,
    borderRadius: 6,
    backgroundColor: "#151B2C",
    overflow: "hidden",
  },
  barFill: {
    height: "100%",
    borderRadius: 6,
  },
  flaggedSection: {
    marginTop: 36,
    gap: 10,
  },
  flaggedTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 4,
  },
  flaggedCard: {
    backgroundColor: "#151B2C",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#262E45",
    padding: 14,
  },
  flaggedText: {
    color: "#C7CCDA",
    fontSize: 14,
    fontStyle: "italic",
  },
  button: {
    marginTop: 36,
    backgroundColor: "#5B6CFF",
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
  },
  buttonPressed: {
    opacity: 0.85,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
});
