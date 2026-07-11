import { useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";
import { useTheme } from "../../context/ThemeContext";
import SectionShell from "./SectionShell";
import GradientBlob from "../ui/GradientBlob";

const STEPS = [
  { title: "Copy a YouTube video link" },
  { title: "Paste it into the analyzer" },
  { title: "Read the score and category breakdown" },
  {
    title: "Draw your own conclusion",
    body: "Use the score as a starting point for critical thinking, not a final verdict.",
  },
];

export default function HowSection() {
  const theme = useTheme();
  const styles = useMemo(() => makeStyles(theme), [theme]);

  return (
    <SectionShell style={styles.section}>
      <Text style={theme.type.monoLabel}>HOW IT WORKS</Text>
      <Text style={[theme.type.h2, styles.heading]}>How to use Kratt</Text>

      <View style={styles.steps}>
        {STEPS.map((step, index) => {
          const isLast = index === STEPS.length - 1;
          return (
            <View key={step.title} style={styles.stepRow}>
              <View style={styles.numberColumn}>
                <View style={styles.numberChip}>
                  <GradientBlob
                    colors={theme.gradients.brand}
                    seed={index}
                    style={StyleSheet.absoluteFill}
                  />
                  <Text style={styles.numberText}>{index + 1}</Text>
                </View>
                {!isLast ? <View style={styles.connector} /> : null}
              </View>
              <View style={[styles.stepContent, !isLast && styles.stepGap]}>
                <Text style={styles.stepTitle}>{step.title}</Text>
                {step.body ? (
                  <Text style={styles.stepBody}>{step.body}</Text>
                ) : null}
              </View>
            </View>
          );
        })}
      </View>
    </SectionShell>
  );
}

function makeStyles(theme) {
  const { color, font, type } = theme;
  return StyleSheet.create({
    section: {
      paddingVertical: 56,
    },
    heading: {
      marginTop: 8,
      marginBottom: 28,
    },
    steps: {
      maxWidth: 560,
    },
    stepRow: {
      flexDirection: "row",
      gap: 16,
    },
    numberColumn: {
      alignItems: "center",
    },
    numberChip: {
      width: 34,
      height: 34,
      borderRadius: 17,
      overflow: "hidden",
      alignItems: "center",
      justifyContent: "center",
    },
    numberText: {
      fontFamily: font.monoBold,
      fontSize: 14,
      color: "#FFFFFF",
    },
    connector: {
      flex: 1,
      width: 1,
      backgroundColor: color.border,
      marginVertical: 4,
    },
    stepContent: {
      flex: 1,
      paddingTop: 6,
    },
    stepGap: {
      paddingBottom: 30,
    },
    stepTitle: {
      ...type.h3,
    },
    stepBody: {
      ...type.body,
      marginTop: 6,
    },
  });
}
