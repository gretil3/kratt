import { StyleSheet, Text, View } from "react-native";
import SectionShell from "./SectionShell";
import AppButton from "../ui/AppButton";
import { color, font, hairline, radius, type } from "../../theme/tokens";

export default function ClosingSection({ onTry }) {
  return (
    <SectionShell style={styles.section}>
      <View style={styles.callout}>
        <Text style={styles.calloutText}>
          Kratt doesn&apos;t delete or block comments. It exists to train a
          more critical reading habit, in the spirit of media literacy
          championed by the UNESCO Youth Hackathon.
        </Text>
      </View>

      <View style={styles.cta}>
        <Text style={[type.h2, styles.ctaHeading]}>
          Start reading comment sections more critically
        </Text>
        <AppButton label="Try Kratt now" onPress={onTry} />
      </View>

      <View style={styles.footer}>
        <View style={styles.footerBrand}>
          <View style={styles.footerMark} />
          <Text style={styles.footerLogo}>Kratt</Text>
        </View>
        <Text style={styles.footerText}>UNESCO Youth Hackathon 2026</Text>
      </View>
    </SectionShell>
  );
}

const styles = StyleSheet.create({
  section: {
    paddingTop: 56,
    paddingBottom: 32,
  },
  callout: {
    backgroundColor: color.surface,
    borderWidth: hairline,
    borderColor: color.hairline,
    borderLeftWidth: 3,
    borderLeftColor: color.straw,
    borderRadius: radius.sm,
    padding: 20,
    maxWidth: 680,
  },
  calloutText: {
    ...type.body,
  },
  cta: {
    alignItems: "center",
    paddingVertical: 72,
    gap: 24,
  },
  ctaHeading: {
    textAlign: "center",
    maxWidth: 560,
  },
  footer: {
    borderTopWidth: hairline,
    borderTopColor: color.hairline,
    paddingTop: 20,
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
  },
  footerBrand: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
  },
  footerMark: {
    width: 7,
    height: 7,
    backgroundColor: color.straw,
  },
  footerLogo: {
    fontFamily: font.slab,
    fontSize: 16,
    color: color.ink,
  },
  footerText: {
    ...type.small,
  },
});
