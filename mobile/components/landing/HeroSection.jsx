import { StyleSheet, Text, useWindowDimensions, View } from "react-native";
import SectionShell from "./SectionShell";
import PillButton from "../ui/PillButton";
import CategoryPillRow from "./CategoryPillRow";
import { color, font, layout, radius, type } from "../../theme/darkTokens";

export default function HeroSection({ onAnalyze, onSeeHow }) {
  const { width } = useWindowDimensions();
  const isWide = width >= layout.breakpoint;

  return (
    <View>
      <SectionShell style={styles.section}>
        <View style={styles.badge}>
          <View style={styles.badgeDot} />
          <Text style={styles.badgeText}>UNESCO YOUTH HACKATHON 2026</Text>
        </View>

        <Text
          style={[
            type.display,
            styles.headline,
            isWide && { fontSize: 56, lineHeight: 62 },
          ]}
        >
          Kratt reads comment sections so bots can&apos;t hide
        </Text>

        <Text style={styles.subhead}>
          Paste a YouTube link, and Kratt breaks the comment section down into
          evidence anyone can read.
        </Text>

        <View style={styles.buttons}>
          <PillButton label="Analyze a video" onPress={onAnalyze} />
          <PillButton
            label="See how it works"
            variant="secondary"
            onPress={onSeeHow}
          />
        </View>
      </SectionShell>

      <SectionShell style={styles.pillSection}>
        <CategoryPillRow />
      </SectionShell>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    paddingTop: 48,
    paddingBottom: 36,
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    alignSelf: "flex-start",
    borderWidth: 1,
    borderColor: color.border,
    backgroundColor: color.surface,
    borderRadius: radius.pill,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginBottom: 24,
  },
  badgeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#2FE6C8",
  },
  badgeText: {
    fontFamily: font.monoBold,
    fontSize: 11,
    letterSpacing: 1.2,
    color: color.inkMuted,
  },
  headline: {
    maxWidth: 820,
    marginBottom: 18,
  },
  subhead: {
    ...type.bodyLarge,
    maxWidth: 620,
    marginBottom: 28,
  },
  buttons: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  pillSection: {
    paddingBottom: 8,
  },
});
