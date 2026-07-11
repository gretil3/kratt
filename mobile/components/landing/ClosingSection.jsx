import { useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";
import { useTheme } from "../../context/ThemeContext";
import SectionShell from "./SectionShell";
import PillButton from "../ui/PillButton";
import GradientBlob from "../ui/GradientBlob";

export default function ClosingSection({ onTry }) {
  const theme = useTheme();
  const styles = useMemo(() => makeStyles(theme), [theme]);

  return (
    <SectionShell style={styles.section}>
      <View style={styles.callout}>
        <Text style={styles.calloutText}>
          Kratt doesn&apos;t delete or block comments. It exists to train a
          more critical reading habit, in the spirit of media literacy
          championed by the UNESCO Youth Hackathon.
        </Text>
      </View>

      <View style={styles.ctaPanel}>
        <GradientBlob colors={theme.gradients.brand} seed={1} style={StyleSheet.absoluteFill} />
        <View style={styles.ctaOverlay} />
        <View style={styles.ctaContent}>
          <Text style={styles.ctaHeading}>
            Ready to read comment sections more critically?
          </Text>
          <Text style={styles.ctaSub}>
            Paste a link, get a breakdown — no sign-up needed.
          </Text>
          <PillButton label="Try Kratt now" onPress={onTry} />
        </View>
      </View>

      <View style={styles.footer}>
        <View style={styles.footerBrand}>
          <GradientBlob colors={theme.gradients.brand} radius={4} style={styles.footerMark} />
          <Text style={styles.footerLogo}>Kratt</Text>
        </View>
        <Text style={styles.footerText}>UNESCO Youth Hackathon 2026</Text>
      </View>
    </SectionShell>
  );
}

function makeStyles(theme) {
  const { color, font, radius, type } = theme;
  return StyleSheet.create({
    section: {
      paddingTop: 56,
      paddingBottom: 32,
    },
    callout: {
      backgroundColor: color.surface,
      borderWidth: 1,
      borderColor: color.border,
      borderRadius: radius.md,
      padding: 20,
      maxWidth: 680,
      marginBottom: 56,
    },
    calloutText: {
      ...type.body,
    },
    ctaPanel: {
      borderRadius: radius.lg,
      overflow: "hidden",
      paddingVertical: 72,
      paddingHorizontal: 24,
      alignItems: "center",
    },
    // The CTA panel sits on a dark holographic gradient in both themes, so its
    // text stays white and the scrim stays dark regardless of mode.
    ctaOverlay: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: "rgba(8,8,11,0.35)",
    },
    ctaContent: {
      alignItems: "center",
      gap: 16,
      maxWidth: 560,
    },
    ctaHeading: {
      fontFamily: font.display,
      fontSize: 30,
      lineHeight: 36,
      color: "#FFFFFF",
      textAlign: "center",
    },
    ctaSub: {
      fontFamily: font.sans,
      fontSize: 16,
      lineHeight: 24,
      color: "rgba(255,255,255,0.82)",
      textAlign: "center",
      marginBottom: 8,
    },
    footer: {
      borderTopWidth: 1,
      borderTopColor: color.border,
      marginTop: 40,
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
      gap: 8,
    },
    footerMark: {
      width: 16,
      height: 16,
    },
    footerLogo: {
      fontFamily: font.display,
      fontSize: 16,
      color: color.ink,
    },
    footerText: {
      ...type.small,
    },
  });
}
