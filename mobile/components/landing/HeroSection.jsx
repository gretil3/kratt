import { StyleSheet, Text, View } from "react-native";
import Svg, { Defs, Ellipse, RadialGradient, Stop } from "react-native-svg";
import { useTheme } from "../../context/ThemeContext";
import { materials } from "../../theme/themes";
import { webStyle } from "../../theme/webStyle";
import KrattFigure from "../kratt/KrattFigure";
import Stripes from "../kratt/Stripes";
import Button from "../ui/Button";
import SectionShell, { useLandingLayout } from "./SectionShell";

const FIGURE_WIDTH = 460;
const GLOW_HEIGHT = 640;

export default function HeroSection({ onAnalyze, onSeeHow }) {
  const theme = useTheme();
  const { color, font } = theme;
  const { width, isWide, contentWidth } = useLandingLayout();

  // clamp(52px, 6vw, 80px) on wide screens; a fixed size that fits a phone.
  const headline = isWide ? Math.min(80, Math.max(52, width * 0.06)) : 46;
  const sideBySide = contentWidth >= FIGURE_WIDTH + 48 + 480;
  // Leave room for the card that pokes out to the figure's right.
  const figureScale = Math.min(1, (contentWidth - 16) / (FIGURE_WIDTH + 24));

  return (
    <View>
      {/* Faint ember wash from the top right, behind the whole hero. Sized
          in % so it never adds a horizontal scrollbar. */}
      <View pointerEvents="none" style={styles.glow}>
        <Svg width="100%" height={GLOW_HEIGHT}>
          <Defs>
            <RadialGradient id="hero-wash">
              <Stop offset="0" stopColor={color.ember} stopOpacity={0.08} />
              <Stop offset="0.6" stopColor={color.ember} stopOpacity={0} />
            </RadialGradient>
          </Defs>
          <Ellipse
            cx="78%"
            cy={-60}
            rx={1200}
            ry={600}
            fill="url(#hero-wash)"
          />
        </Svg>
      </View>

      <SectionShell divider={false} padTop={isWide ? 80 : 48} padBottom={72}>
        <View style={[styles.row, sideBySide && styles.rowWide]}>
          <View style={sideBySide ? styles.copyWide : null}>
            <View style={[styles.badge, { borderColor: color.borderStrong }]}>
              <View
                style={[
                  styles.badgeDot,
                  { backgroundColor: color.ember },
                  webStyle({ boxShadow: "0 0 6px 1px rgba(255,106,61,0.6)" }),
                ]}
              />
              <Text
                style={[
                  styles.badgeText,
                  { fontFamily: font.monoBold, color: color.inkMuted },
                ]}
              >
                UNESCO YOUTH HACKATHON 2026
              </Text>
            </View>

            <View accessibilityRole="header" style={styles.headline}>
              <Text style={headlineStyle(theme, headline)}>
                Kratt reads comment so
              </Text>
              <View style={styles.underlined}>
                <View
                  style={[
                    styles.underline,
                    { height: headline * 0.11, bottom: headline * 0.04 },
                  ]}
                >
                  <Stripes stops={materials.strawUnderline} />
                </View>
                <Text style={headlineStyle(theme, headline)}>
                  bots can&apos;t hide
                </Text>
              </View>
            </View>

            <Text
              style={[
                styles.lede,
                { fontFamily: font.sans, color: color.inkMuted },
              ]}
            >
              Paste a YouTube link, and Kratt breaks the comment section down
              into evidence anyone can read.
            </Text>

            <View style={styles.buttons}>
              <Button
                label="Analyze a video"
                trailing="→"
                onPress={onAnalyze}
              />
              <Button
                label="See how it works"
                variant="secondary"
                onPress={onSeeHow}
              />
            </View>
          </View>

          <KrattFigure scale={figureScale} style={styles.figure} />
        </View>
      </SectionShell>
    </View>
  );
}

function headlineStyle({ font, color }, size) {
  return {
    fontFamily: font.display,
    fontSize: size,
    lineHeight: size,
    letterSpacing: -size * 0.045,
    color: color.ink,
  };
}

const styles = StyleSheet.create({
  glow: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
  },
  row: {
    gap: 48,
  },
  rowWide: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  copyWide: {
    flex: 1,
    minWidth: 0,
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    gap: 9,
    paddingVertical: 7,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderRadius: 7,
    marginBottom: 30,
  },
  badgeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  badgeText: {
    fontSize: 11,
    letterSpacing: 1.3,
  },
  headline: {
    marginBottom: 26,
  },
  underlined: {
    alignSelf: "flex-start",
  },
  underline: {
    position: "absolute",
    left: 0,
    right: 0,
  },
  lede: {
    maxWidth: 500,
    fontSize: 19,
    lineHeight: 29,
    marginBottom: 36,
  },
  buttons: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  figure: {
    alignSelf: "center",
  },
});
