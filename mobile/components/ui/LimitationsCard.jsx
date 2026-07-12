// "Why this score can be wrong" — the result screen's stated failure modes.
// The heuristics read comment text, so they over-flag people whose genuine
// style is short and repetitive: second-language writers, fandom idiom,
// quoted memes. Saying so is the lesson — a user who knows the score is a
// heuristic with known biases has learned more than the score itself.
import { useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";
import { useTheme } from "../../context/ThemeContext";

const POINTS = [
  {
    key: "short",
    title: "A short comment isn't a bot comment.",
    detail:
      "Brevity and enthusiasm are how a lot of real people write — especially people writing in a second language. A one-line “love this” gets flagged as low effort either way.",
  },
  {
    key: "copied",
    title: "Copied text isn't always coordination.",
    detail:
      "Memes, quoted lyrics, and running jokes spread through real accounts on purpose. Repetition is what fandom sounds like, not only what scripts produce.",
  },
  {
    key: "verdict",
    title: "So use the score as a place to start looking.",
    detail:
      "It says how much of the section matches known patterns — it is not a verdict on any individual commenter.",
  },
];

export default function LimitationsCard({ style }) {
  const theme = useTheme();
  const styles = useMemo(() => makeStyles(theme), [theme]);

  return (
    <View style={style}>
      <Text style={[theme.type.monoLabel, styles.sectionLabel]}>
        WHY THIS SCORE CAN BE WRONG
      </Text>
      <View style={styles.card}>
        {POINTS.map((point, index) => (
          <View
            key={point.key}
            style={[styles.row, index === POINTS.length - 1 && styles.rowLast]}
          >
            <Text style={styles.title}>{point.title}</Text>
            <Text style={styles.detail}>{point.detail}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

function makeStyles(theme) {
  const { color, font, radius, risk, type } = theme;
  return StyleSheet.create({
    sectionLabel: {
      marginBottom: 12,
    },
    // Amber left accent: a caution about the measurement itself — distinct
    // from algorithmic evidence (violet) and the user's own checks (pink).
    card: {
      backgroundColor: color.surface,
      borderWidth: 1,
      borderColor: color.border,
      borderLeftWidth: 2,
      borderLeftColor: risk.medium.main,
      borderRadius: radius.md,
    },
    row: {
      padding: 14,
      gap: 2,
      borderBottomWidth: 1,
      borderBottomColor: color.border,
    },
    rowLast: {
      borderBottomWidth: 0,
    },
    title: {
      ...type.body,
      color: color.ink,
      fontFamily: font.sansBold,
    },
    detail: {
      ...type.small,
    },
  });
}
