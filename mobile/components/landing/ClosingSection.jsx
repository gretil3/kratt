// The page's closing band: the "About" statement, the "Try it now" panel with
// the analyzer embedded in it, and the footer. Three separate exports so the
// landing screen can anchor-scroll to the statement and the panel separately.
import { StyleSheet, Text, View } from "react-native";
import { useTheme } from "../../context/ThemeContext";
import { materials } from "../../theme/themes";
import BucketHead from "../kratt/BucketHead";
import Stripes from "../kratt/Stripes";
import PasteForm from "../ui/PasteForm";
import SectionShell, { Eyebrow, useLandingLayout } from "./SectionShell";

const PANEL_INK = "#14110C";

export function AboutStatement() {
  const { color, font } = useTheme();
  const { isWide } = useLandingLayout();
  const size = isWide ? 32 : 24;
  return (
    <SectionShell padBottom={isWide ? 72 : 48}>
      <Text
        style={[
          styles.statement,
          {
            fontFamily: font.displayMedium,
            fontSize: size,
            lineHeight: size * 1.3,
            letterSpacing: -size * 0.02,
            color: color.ink,
          },
        ]}
      >
        Kratt doesn&apos;t delete or block comments. It exists to train a more
        critical reading habit, in the spirit of media literacy championed by
        the UNESCO Youth Hackathon.
      </Text>
    </SectionShell>
  );
}

export function TryPanel() {
  const { color, font, type } = useTheme();
  const { width, isWide } = useLandingLayout();
  // clamp(36px, 4.4vw, 52px)
  const headline = isWide ? Math.min(52, Math.max(36, width * 0.044)) : 34;

  return (
    <SectionShell divider={false} padTop={0} padBottom={0}>
      <View
        style={[
          styles.panel,
          { backgroundColor: color.bg, borderColor: "rgba(233,185,73,0.45)" },
        ]}
      >
        <View
          style={[
            styles.banner,
            { backgroundColor: color.accent },
            isWide ? styles.bannerWide : styles.bannerNarrow,
          ]}
        >
          <View style={[styles.bannerCopy, isWide && styles.bannerCopyWide]}>
            <Eyebrow color="rgba(20,17,12,0.66)">TRY IT NOW</Eyebrow>
            <Text
              accessibilityRole="header"
              style={{
                fontFamily: font.display,
                fontSize: headline,
                lineHeight: headline,
                letterSpacing: -headline * 0.04,
                color: PANEL_INK,
                marginBottom: 16,
              }}
            >
              Ready to read comment sections more critically?
            </Text>
            <Text style={[styles.bannerLede, { fontFamily: font.sans }]}>
              Paste a link, get a breakdown — no sign-up needed.
            </Text>
          </View>
          <BucketHead
            width={isWide ? 196 : 120}
            handleColor="#6E6A61"
            style={isWide ? styles.bucketWide : styles.bucketNarrow}
          />
          <View style={styles.bannerEdge}>
            <Stripes stops={materials.strawShadow} />
          </View>
        </View>

        <View style={[styles.analyzer, !isWide && styles.analyzerNarrow]}>
          <Text
            style={[
              type.display,
              styles.analyzerTitle,
              !isWide && styles.analyzerTitleNarrow,
            ]}
          >
            Paste a YouTube link
          </Text>
          <Text style={[type.bodyLarge, styles.analyzerLede]}>
            Kratt reads the comment section and flags likely bot activity.
          </Text>
          <PasteForm />
        </View>
      </View>
    </SectionShell>
  );
}

export function LandingFooter() {
  const { color, font } = useTheme();
  return (
    <SectionShell divider={false} padTop={40} padBottom={40}>
      <View style={[styles.footer, { borderTopColor: color.border }]}>
        <View style={styles.footerBrand}>
          <BucketHead width={20} handle={false} animate={false} />
          <Text
            style={[
              styles.footerLogo,
              { fontFamily: font.display, color: color.ink },
            ]}
          >
            Kratt
          </Text>
        </View>
        <Text
          style={[
            styles.footerNote,
            { fontFamily: font.sans, color: color.inkFaint },
          ]}
        >
          UNESCO Youth Hackathon 2026
        </Text>
      </View>
    </SectionShell>
  );
}

const styles = StyleSheet.create({
  statement: {
    maxWidth: 860,
  },
  panel: {
    borderRadius: 18,
    borderWidth: 1,
    overflow: "hidden",
  },
  banner: {
    overflow: "hidden",
  },
  bannerWide: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    gap: 40,
    paddingTop: 56,
    paddingHorizontal: 64,
  },
  bannerNarrow: {
    paddingTop: 36,
    paddingHorizontal: 24,
  },
  bannerCopy: {
    paddingBottom: 24,
  },
  bannerCopyWide: {
    flex: 1,
    maxWidth: 600,
    paddingBottom: 70,
  },
  bannerLede: {
    fontSize: 18,
    lineHeight: 27,
    color: "rgba(20,17,12,0.78)",
  },
  bucketWide: {
    marginRight: 32,
    marginBottom: 22,
  },
  bucketNarrow: {
    alignSelf: "flex-end",
    marginBottom: 22,
  },
  bannerEdge: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: 22,
  },
  analyzer: {
    width: "100%",
    maxWidth: 540,
    alignSelf: "center",
    paddingHorizontal: 24,
    paddingTop: 64,
    paddingBottom: 72,
  },
  analyzerNarrow: {
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 48,
  },
  analyzerTitle: {
    fontSize: 48,
    lineHeight: 50,
    letterSpacing: -1.9,
    marginBottom: 12,
  },
  analyzerTitleNarrow: {
    fontSize: 36,
    lineHeight: 38,
    letterSpacing: -1.4,
  },
  analyzerLede: {
    marginBottom: 30,
  },
  footer: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 16,
    paddingTop: 22,
    borderTopWidth: 1,
  },
  footerBrand: {
    flexDirection: "row",
    alignItems: "center",
    gap: 9,
  },
  footerLogo: {
    fontSize: 17,
    letterSpacing: -0.5,
  },
  footerNote: {
    fontSize: 13.5,
  },
});
