import {
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import SectionShell from "./SectionShell";
import AppButton from "../ui/AppButton";
import { color, font, hairline, layout, radius, type } from "../../theme/tokens";

export default function HeroSection({ onAnalyze, onSeeHow }) {
  const { width } = useWindowDimensions();
  const isWide = width >= layout.breakpoint;

  return (
    <SectionShell style={styles.section}>
      <View style={styles.badge}>
        <View style={styles.badgeDot} />
        <Text style={styles.badgeText}>UNESCO YOUTH HACKATHON 2026</Text>
      </View>

      <Text
        style={[
          type.display,
          styles.headline,
          isWide && { fontSize: 48, lineHeight: 56 },
        ]}
      >
        Tell real comments from bot-made ones
      </Text>

      <Text style={styles.subhead}>
        Paste a YouTube link, and Kratt breaks the comment section down into
        evidence anyone can read.
      </Text>

      <View style={styles.buttons}>
        <AppButton label="Analyze a video" onPress={onAnalyze} />
        <AppButton
          label="See how it works"
          variant="secondary"
          onPress={onSeeHow}
        />
      </View>
    </SectionShell>
  );
}

const styles = StyleSheet.create({
  section: {
    paddingTop: 56,
    paddingBottom: 56,
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    alignSelf: "flex-start",
    borderWidth: hairline,
    borderColor: color.hairline,
    backgroundColor: color.surface,
    borderRadius: radius.sm,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginBottom: 24,
  },
  badgeDot: {
    width: 6,
    height: 6,
    backgroundColor: color.straw,
  },
  badgeText: {
    fontFamily: font.monoBold,
    fontSize: 11,
    letterSpacing: 1.2,
    color: color.inkMuted,
  },
  headline: {
    maxWidth: 760,
    marginBottom: 16,
  },
  subhead: {
    ...type.bodyLarge,
    color: color.inkMuted,
    maxWidth: 620,
    marginBottom: 28,
  },
  buttons: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
});
