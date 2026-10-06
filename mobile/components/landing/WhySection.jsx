import { StyleSheet, Text, View } from "react-native";
import { useTheme } from "../../context/ThemeContext";
import SectionShell, {
  Eyebrow,
  SectionTitle,
  useLandingLayout,
} from "./SectionShell";

const ITEMS = [
  {
    title: "Hard to spot by eye",
    body: "Bot-written comments increasingly mimic the way ordinary people write.",
  },
  {
    title: "They shape public opinion",
    body: "Top comments are often read as the voice of the majority.",
  },
  {
    title: "A skill you can train",
    body: "Recognizing suspicious patterns is part of media literacy.",
  },
];

export default function WhySection() {
  const { color, font } = useTheme();
  const { isWide } = useLandingLayout();

  return (
    <SectionShell>
      <Eyebrow>WHY IT MATTERS</Eyebrow>
      <SectionTitle style={styles.title}>Why this matters</SectionTitle>

      {/* 1px gaps over the border color draw the dividers between cells. */}
      <View
        style={[
          styles.grid,
          isWide && styles.gridWide,
          { backgroundColor: color.border, borderColor: color.border },
        ]}
      >
        {ITEMS.map((item, index) => (
          <View
            key={item.title}
            style={[
              styles.cell,
              isWide && styles.cellWide,
              { backgroundColor: color.bg },
            ]}
          >
            <Text
              style={[
                styles.number,
                { fontFamily: font.monoBold, color: color.accent },
              ]}
            >
              {String(index + 1).padStart(2, "0")}
            </Text>
            <Text
              style={[
                styles.cellTitle,
                { fontFamily: font.displayBold, color: color.ink },
              ]}
            >
              {item.title}
            </Text>
            <Text
              style={[
                styles.cellBody,
                { fontFamily: font.sans, color: color.inkMuted },
              ]}
            >
              {item.body}
            </Text>
          </View>
        ))}
      </View>
    </SectionShell>
  );
}

const styles = StyleSheet.create({
  title: {
    marginBottom: 48,
  },
  grid: {
    gap: 1,
    borderWidth: 1,
    borderRadius: 14,
    overflow: "hidden",
  },
  gridWide: {
    flexDirection: "row",
  },
  cell: {
    paddingTop: 32,
    paddingHorizontal: 30,
    paddingBottom: 36,
  },
  cellWide: {
    flex: 1,
  },
  number: {
    fontSize: 13,
    marginBottom: 48,
  },
  cellTitle: {
    fontSize: 26,
    lineHeight: 29,
    letterSpacing: -0.65,
    marginBottom: 12,
  },
  cellBody: {
    fontSize: 16,
    lineHeight: 25,
  },
});
