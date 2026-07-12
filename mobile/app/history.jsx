// Verification history: every completed analysis, saved client-side only
// (lib/history.js), listed newest first with the current day streak on top.
import { useCallback, useMemo, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useFocusEffect, useRouter } from "expo-router";
import { useTheme } from "../context/ThemeContext";
import ThemeToggle from "../components/ui/ThemeToggle";
import ThemedStatusBar from "../components/ui/ThemedStatusBar";
import PillButton from "../components/ui/PillButton";
import { computeStreak, getHistory } from "../lib/history";
import { tierForScore } from "../lib/riskLevels";
import { parseVideoId } from "../lib/youtube";

function formatWhen(timestamp) {
  return new Date(timestamp).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default function HistoryScreen() {
  const router = useRouter();
  const theme = useTheme();
  const styles = useMemo(() => makeStyles(theme), [theme]);
  const [entries, setEntries] = useState(null); // null = loading

  useFocusEffect(
    useCallback(() => {
      let active = true;
      getHistory().then((list) => {
        if (active) setEntries(list);
      });
      return () => {
        active = false;
      };
    }, [])
  );

  const streak = entries ? computeStreak(entries) : 0;

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.scroll}>
      <ThemedStatusBar />
      <View style={styles.content}>
        <View style={styles.headerRow}>
          <Text style={theme.type.monoLabel}>VERIFICATION HISTORY</Text>
          <ThemeToggle />
        </View>

        <Text style={styles.streakLine}>
          {streak > 0
            ? `${streak}-day streak — keep checking before you trust.`
            : "No active streak — analyze a video to start one."}
        </Text>

        <View style={styles.divider} />

        {entries == null ? null : entries.length === 0 ? (
          <Text style={styles.empty}>
            Nothing here yet. Every analysis you run is saved on this device, so
            you can see your verification habit build up.
          </Text>
        ) : (
          <View style={styles.list}>
            {entries.map((entry, index) => {
              const tier = tierForScore(entry.botPercentage);
              const videoId = parseVideoId(entry.videoUrl);
              return (
                <Pressable
                  key={`${entry.timestamp}-${index}`}
                  accessibilityRole="button"
                  accessibilityLabel={`Re-run analysis for ${entry.videoUrl}`}
                  onPress={() => videoId && router.push(`/analysis/${videoId}`)}
                  style={({ pressed }) => [
                    styles.row,
                    pressed && styles.rowPressed,
                  ]}
                >
                  <View style={styles.rowText}>
                    <Text style={styles.rowUrl} numberOfLines={1}>
                      {entry.videoUrl}
                    </Text>
                    <Text style={styles.rowWhen}>
                      {formatWhen(entry.timestamp)}
                    </Text>
                  </View>
                  <View
                    style={[
                      styles.scoreChip,
                      { backgroundColor: theme.risk[tier].tint },
                    ]}
                  >
                    <Text
                      style={[
                        styles.scoreText,
                        { color: theme.risk[tier].text },
                      ]}
                    >
                      {entry.botPercentage}%
                    </Text>
                  </View>
                </Pressable>
              );
            })}
          </View>
        )}

        <PillButton
          label="Back to analyzer"
          variant="secondary"
          onPress={() => router.push("/home")}
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
    streakLine: {
      ...type.bodyLarge,
      color: color.ink,
      marginTop: 12,
    },
    divider: {
      height: 1,
      backgroundColor: color.border,
      marginTop: 20,
      marginBottom: 24,
    },
    empty: {
      ...type.body,
      marginBottom: 28,
    },
    list: {
      gap: 10,
      marginBottom: 28,
    },
    row: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
      backgroundColor: color.surface,
      borderWidth: 1,
      borderColor: color.border,
      borderRadius: radius.sm,
      padding: 14,
    },
    rowPressed: {
      opacity: 0.7,
    },
    rowText: {
      flex: 1,
      gap: 4,
    },
    rowUrl: {
      fontFamily: font.mono,
      fontSize: 13,
      color: color.ink,
    },
    rowWhen: {
      ...type.small,
    },
    scoreChip: {
      borderRadius: radius.pill,
      paddingVertical: 4,
      paddingHorizontal: 12,
    },
    scoreText: {
      fontFamily: font.monoBold,
      fontSize: 13,
      lineHeight: 18,
    },
    button: {
      alignSelf: "flex-start",
    },
  });
}
