import { useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";
import { useTheme } from "../../context/ThemeContext";
import SectionShell from "./SectionShell";
import GradientBlob from "../ui/GradientBlob";

const ITEMS = [
  {
    title: "Hard to spot by eye",
    body: "Bot-written comments increasingly mimic the way ordinary people write.",
    gradientKey: "copy_paste",
  },
  {
    title: "They shape public opinion",
    body: "Top comments are often read as the voice of the majority.",
    gradientKey: "low_effort",
  },
  {
    title: "A skill you can train",
    body: "Recognizing suspicious patterns is part of media literacy.",
    gradientKey: "genuine",
  },
];

export default function WhySection() {
  const theme = useTheme();
  const styles = useMemo(() => makeStyles(theme), [theme]);

  return (
    <SectionShell style={styles.section}>
      <Text style={theme.type.monoLabel}>WHY IT MATTERS</Text>
      <Text style={[theme.type.h2, styles.heading]}>Why this matters</Text>

      <View style={styles.list}>
        {ITEMS.map((item, index) => (
          <View key={item.title} style={styles.row}>
            <GradientBlob
              colors={theme.gradients[item.gradientKey]}
              seed={index}
              radius={theme.radius.sm}
              style={styles.icon}
            />
            <View style={styles.rowText}>
              <Text style={styles.rowTitle}>{item.title}</Text>
              <Text style={styles.rowBody}>{item.body}</Text>
            </View>
            <Text style={styles.plus}>+</Text>
          </View>
        ))}
      </View>
    </SectionShell>
  );
}

function makeStyles(theme) {
  const { color, type } = theme;
  return StyleSheet.create({
    section: {
      paddingVertical: 56,
    },
    heading: {
      marginTop: 8,
      marginBottom: 28,
    },
    list: {
      borderTopWidth: 1,
      borderTopColor: color.border,
    },
    row: {
      flexDirection: "row",
      alignItems: "center",
      gap: 16,
      paddingVertical: 20,
      borderBottomWidth: 1,
      borderBottomColor: color.border,
    },
    icon: {
      width: 40,
      height: 40,
    },
    rowText: {
      flex: 1,
      gap: 4,
    },
    rowTitle: {
      ...type.h3,
    },
    rowBody: {
      ...type.body,
    },
    plus: {
      fontFamily: type.h3.fontFamily,
      fontSize: 22,
      color: color.inkFaint,
    },
  });
}
