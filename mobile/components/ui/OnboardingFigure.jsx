// Line-art overlays for the onboarding cards' gradient blobs, so each blob
// carries the card's concept instead of being pure decoration. Thin geometric
// strokes in white/teal at low opacity — an annotation on the gradient, not a
// second illustration. The gradient underneath stays exactly as it was: its
// per-category colors are the same ones the user meets on the result screen.
//
// `kind: "stat"` is the exception — card 3 is about scale, so it gets a large
// verified numeral (passed in by the card) rather than a picture.
import { useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";
import Svg, { Circle, Line, Path, Rect } from "react-native-svg";
import { useTheme } from "../../context/ThemeContext";
import { accent } from "../../theme/themes";

// Both read on any of the four gradients; same convention as the white stamp
// text that sits on these gradients elsewhere in the app.
const STROKE = "#FFFFFF";
const TEAL = accent.teal;

// Several accounts, converging lines, one speech bubble: many voices in,
// one message out.
function ConsensusFigure() {
  const nodes = [
    [26, 16],
    [18, 38],
    [24, 62],
    [38, 82],
    [52, 30],
  ];
  return (
    <Svg
      width="100%"
      height="100%"
      viewBox="0 0 220 100"
      preserveAspectRatio="xMidYMid meet"
    >
      {nodes.map(([cx, cy], i) => (
        <Line
          key={`l${i}`}
          x1={cx}
          y1={cy}
          x2={128}
          y2={47}
          stroke={STROKE}
          strokeOpacity={0.35}
          strokeWidth={1}
        />
      ))}
      {nodes.map(([cx, cy], i) => (
        <Circle
          key={`n${i}`}
          cx={cx}
          cy={cy}
          r={4.5}
          fill="none"
          stroke={i === 2 ? TEAL : STROKE}
          strokeOpacity={0.7}
          strokeWidth={1.5}
        />
      ))}
      <Rect
        x={130}
        y={28}
        width={62}
        height={38}
        rx={9}
        fill="none"
        stroke={STROKE}
        strokeOpacity={0.7}
        strokeWidth={1.5}
      />
      <Path
        d="M144 66 L138 78 L156 66"
        fill="none"
        stroke={STROKE}
        strokeOpacity={0.7}
        strokeWidth={1.5}
        strokeLinejoin="round"
      />
      <Line
        x1={141}
        y1={42}
        x2={181}
        y2={42}
        stroke={TEAL}
        strokeOpacity={0.7}
        strokeWidth={1.5}
      />
      <Line
        x1={141}
        y1={52}
        x2={168}
        y2={52}
        stroke={STROKE}
        strokeOpacity={0.5}
        strokeWidth={1.5}
      />
    </Svg>
  );
}

function ArrowRight({ x, y, length = 40, color = STROKE, opacity = 0.6 }) {
  return (
    <>
      <Line
        x1={x}
        y1={y}
        x2={x + length}
        y2={y}
        stroke={color}
        strokeOpacity={opacity}
        strokeWidth={1.5}
      />
      <Path
        d={`M${x + length - 7} ${y - 5} L${x + length} ${y} L${x + length - 7} ${y + 5}`}
        fill="none"
        stroke={color}
        strokeOpacity={opacity}
        strokeWidth={1.5}
        strokeLinejoin="round"
      />
    </>
  );
}

// A cluster of arrows all pointing one way, and one dashed teal arrow mid-turn,
// falling in line: social proof.
function CrowdFigure() {
  return (
    <Svg
      width="100%"
      height="100%"
      viewBox="0 0 220 100"
      preserveAspectRatio="xMidYMid meet"
    >
      <ArrowRight x={30} y={20} />
      <ArrowRight x={95} y={26} length={46} />
      <ArrowRight x={52} y={46} length={52} />
      <ArrowRight x={126} y={52} length={40} />
      <ArrowRight x={34} y={72} length={44} />
      <Path
        d="M118 92 Q 138 92 148 78"
        fill="none"
        stroke={TEAL}
        strokeOpacity={0.8}
        strokeWidth={1.5}
        strokeDasharray="4 4"
      />
      <Path
        d="M140 78 L148 78 L146 86"
        fill="none"
        stroke={TEAL}
        strokeOpacity={0.8}
        strokeWidth={1.5}
        strokeLinejoin="round"
      />
    </Svg>
  );
}

// A magnifying glass over two comment lines — a reading aid. Deliberately not
// a gavel: the copy says "a trainer, not a judge".
function MagnifierFigure() {
  return (
    <Svg
      width="100%"
      height="100%"
      viewBox="0 0 220 100"
      preserveAspectRatio="xMidYMid meet"
    >
      <Line
        x1={58}
        y1={34}
        x2={78}
        y2={34}
        stroke={STROKE}
        strokeOpacity={0.4}
        strokeWidth={1.5}
      />
      <Line
        x1={58}
        y1={46}
        x2={72}
        y2={46}
        stroke={STROKE}
        strokeOpacity={0.4}
        strokeWidth={1.5}
      />
      <Circle
        cx={106}
        cy={40}
        r={26}
        fill="none"
        stroke={STROKE}
        strokeOpacity={0.75}
        strokeWidth={1.8}
      />
      <Line
        x1={125}
        y1={59}
        x2={150}
        y2={84}
        stroke={STROKE}
        strokeOpacity={0.75}
        strokeWidth={3}
        strokeLinecap="round"
      />
      <Line
        x1={94}
        y1={36}
        x2={120}
        y2={36}
        stroke={TEAL}
        strokeOpacity={0.85}
        strokeWidth={1.8}
      />
      <Line
        x1={94}
        y1={46}
        x2={112}
        y2={46}
        stroke={STROKE}
        strokeOpacity={0.6}
        strokeWidth={1.8}
      />
    </Svg>
  );
}

export default function OnboardingFigure({ kind, stat, caption, style }) {
  const theme = useTheme();
  const styles = useMemo(() => makeStyles(theme), [theme]);

  if (kind === "stat") {
    return (
      <View style={[styles.overlay, styles.statWrap, style]}>
        <Text style={styles.statNumber}>{stat}</Text>
        {caption ? <Text style={styles.statCaption}>{caption}</Text> : null}
      </View>
    );
  }

  return (
    <View style={[styles.overlay, style]} pointerEvents="none">
      {kind === "consensus" ? <ConsensusFigure /> : null}
      {kind === "crowd" ? <CrowdFigure /> : null}
      {kind === "magnifier" ? <MagnifierFigure /> : null}
    </View>
  );
}

function makeStyles(theme) {
  const { font } = theme;
  return StyleSheet.create({
    overlay: {
      ...StyleSheet.absoluteFillObject,
      padding: 16,
    },
    statWrap: {
      alignItems: "center",
      justifyContent: "center",
      gap: 6,
    },
    // On the gradient, like the figures' strokes — not theme ink.
    statNumber: {
      fontFamily: font.display,
      fontSize: 44,
      lineHeight: 50,
      color: STROKE,
    },
    statCaption: {
      fontFamily: font.monoBold,
      fontSize: 10,
      lineHeight: 15,
      letterSpacing: 0.8,
      textAlign: "center",
      maxWidth: 360,
      color: STROKE,
      opacity: 0.75,
    },
  });
}
