import { StyleSheet, Text, useWindowDimensions, View } from "react-native";
import SectionShell from "./SectionShell";
import PillButton from "../ui/PillButton";
import VideoFrame from "./VideoFrame";
import { color, font, layout, radius, type } from "../../theme/darkTokens";

export default function HeroSection({ onAnalyze, onSeeHow }) {
  const { width } = useWindowDimensions();
  const isWide = width >= layout.breakpoint;

  return (
    <SectionShell style={styles.section}>
      <View style={[styles.row, isWide && styles.rowWide]}>
        <View style={[styles.copy, isWide && styles.copyWide]}>
          <View style={styles.badge}>
            <View style={styles.badgeDot} />
            <Text style={styles.badgeText}>UNESCO YOUTH HACKATHON 2026</Text>
          </View>

          <Text
            style={[
              type.display,
              styles.headline,
              isWide && { fontSize: 48, lineHeight: 54 },
            ]}
          >
            Kratt reads comment so bots can't hide
          </Text>

          <Text style={styles.subhead}>
            Paste a YouTube link, and Kratt breaks the comment section down
            into evidence anyone can read.
          </Text>

          <View style={styles.buttons}>
            <PillButton label="Analyze a video" onPress={onAnalyze} />
            <PillButton
              label="See how it works"
              variant="secondary"
              onPress={onSeeHow}
            />
          </View>
        </View>

        <View style={[styles.mediaWrap, isWide && styles.mediaWrapWide]}>
          <View style={styles.accentDot1} />
          <View style={styles.accentDot2} />
          <View style={styles.accentDot3} />
          <VideoFrame style={styles.media} />
        </View>
      </View>
    </SectionShell>
  );
}

const styles = StyleSheet.create({
  section: {
    paddingTop: 48,
    paddingBottom: 56,
  },
  row: {
    gap: 40,
  },
  rowWide: {
    flexDirection: "row",
    alignItems: "center",
  },
  copy: {},
  copyWide: {
    flex: 1,
    maxWidth: 520,
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
    marginBottom: 18,
  },
  subhead: {
    ...type.bodyLarge,
    maxWidth: 480,
    marginBottom: 28,
  },
  buttons: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  mediaWrap: {
    position: "relative",
  },
  mediaWrapWide: {
    flex: 1,
  },
  media: {
    zIndex: 1,
  },
  accentDot1: {
    position: "absolute",
    top: -18,
    right: 24,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#2FE6C8",
    opacity: 0.7,
  },
  accentDot2: {
    position: "absolute",
    bottom: 40,
    left: -14,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#FF3EA5",
    opacity: 0.6,
  },
  accentDot3: {
    position: "absolute",
    bottom: -16,
    right: "30%",
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#7C5CFF",
    opacity: 0.7,
  },
});
