// "How to use Kratt": four steps on a dashed track — horizontal on wide
// screens, vertical on phones.
import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { useTheme } from "../../context/ThemeContext";
import Stripes, { bars } from "../kratt/Stripes";
import SectionShell, {
  Eyebrow,
  SectionTitle,
  useLandingLayout,
} from "./SectionShell";

const STEPS = [
  { title: "Copy a YouTube video link" },
  { title: "Paste it into the analyzer" },
  { title: "Read the score and category breakdown" },
  {
    title: "Draw your own conclusion",
    body: "Use the score as a starting point for critical thinking, not a final verdict.",
  },
];

const DOT = 44;
const DASH = bars("rgba(241,234,219,0.22)", 6, 6);

export default function HowSection() {
  const { color, font } = useTheme();
  const { isWide } = useLandingLayout();
  // Stacked layout: the connector runs from the first dot's center to the
  // last one's, so it must not extend past dot 4 into its description.
  const [lastStepY, setLastStepY] = useState(0);

  return (
    <SectionShell>
      <Eyebrow>HOW IT WORKS</Eyebrow>
      <SectionTitle style={styles.title}>How to use Kratt</SectionTitle>

      <View style={[styles.track, isWide && styles.trackWide]}>
        {/* The dashed connector runs behind the step dots. */}
        <View
          style={
            isWide ? styles.dashWide : [styles.dashTall, { height: lastStepY }]
          }
        >
          <Stripes stops={DASH} angle={isWide ? 0 : 90} />
        </View>

        {STEPS.map((step, index) => {
          const last = index === STEPS.length - 1;
          return (
            <View
              key={step.title}
              onLayout={
                last ? (e) => setLastStepY(e.nativeEvent.layout.y) : undefined
              }
              style={[styles.step, isWide ? styles.stepWide : styles.stepTall]}
            >
              {/* bg-colored ring masks the dashes around each dot */}
              <View style={[styles.dotRing, { backgroundColor: color.bg }]}>
                <View
                  style={[
                    styles.dot,
                    last
                      ? {
                          borderWidth: 2,
                          borderColor: color.accent,
                          backgroundColor: color.bg,
                        }
                      : { backgroundColor: color.accent },
                  ]}
                >
                  <Text
                    style={[
                      styles.dotText,
                      {
                        fontFamily: font.monoBold,
                        color: last ? color.accent : color.onAccent,
                      },
                    ]}
                  >
                    {index + 1}
                  </Text>
                </View>
              </View>
              <View style={isWide ? null : styles.stepTextTall}>
                <Text
                  style={[
                    styles.stepTitle,
                    { fontFamily: font.displayBold, color: color.ink },
                    step.body && styles.stepTitleWithBody,
                  ]}
                >
                  {step.title}
                </Text>
                {step.body ? (
                  <Text
                    style={[
                      styles.stepBody,
                      { fontFamily: font.sans, color: color.inkMuted },
                    ]}
                  >
                    {step.body}
                  </Text>
                ) : null}
              </View>
            </View>
          );
        })}
      </View>
    </SectionShell>
  );
}

const styles = StyleSheet.create({
  title: {
    marginBottom: 56,
  },
  track: {
    gap: 32,
  },
  trackWide: {
    flexDirection: "row",
    gap: 28,
  },
  dashWide: {
    position: "absolute",
    left: DOT / 2,
    right: DOT / 2,
    top: DOT / 2 - 1,
    height: 2,
  },
  dashTall: {
    position: "absolute",
    left: DOT / 2 - 1,
    width: 2,
    top: DOT / 2,
  },
  step: {
    gap: 24,
  },
  stepWide: {
    flex: 1,
  },
  stepTall: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 18,
  },
  // Centers a one-line title on the dot; longer titles run downward.
  stepTextTall: {
    flex: 1,
    paddingTop: (DOT - 26) / 2,
  },
  dotRing: {
    alignSelf: "flex-start",
    padding: 8,
    margin: -8,
    borderRadius: DOT,
  },
  dot: {
    width: DOT,
    height: DOT,
    borderRadius: DOT / 2,
    alignItems: "center",
    justifyContent: "center",
  },
  dotText: {
    fontSize: 15,
  },
  stepTitle: {
    fontSize: 22,
    lineHeight: 26,
    letterSpacing: -0.44,
  },
  stepTitleWithBody: {
    marginBottom: 10,
  },
  stepBody: {
    fontSize: 15,
    lineHeight: 23,
  },
});
