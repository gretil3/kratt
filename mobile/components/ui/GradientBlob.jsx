// A holographic "mesh gradient" painted from overlapping radial gradients —
// no image assets, no blur filters (native SVG blur support is unreliable),
// just layered soft-edged ellipses. Deterministic per `seed` so the same
// category always renders the same blob.
import { useMemo, useRef } from "react";
import { StyleSheet, View } from "react-native";
import Svg, {
  Defs,
  RadialGradient,
  Stop,
  Rect,
  Ellipse,
} from "react-native-svg";

let instanceCounter = 0;

const LAYOUTS = [
  [
    { cx: 20, cy: 22, rx: 60, ry: 55 },
    { cx: 82, cy: 30, rx: 55, ry: 50 },
    { cx: 45, cy: 85, rx: 65, ry: 55 },
  ],
  [
    { cx: 78, cy: 18, rx: 58, ry: 52 },
    { cx: 15, cy: 45, rx: 60, ry: 55 },
    { cx: 60, cy: 90, rx: 62, ry: 50 },
  ],
  [
    { cx: 50, cy: 10, rx: 65, ry: 48 },
    { cx: 10, cy: 70, rx: 55, ry: 58 },
    { cx: 90, cy: 75, rx: 58, ry: 55 },
  ],
];

export default function GradientBlob({ colors, seed = 0, style, radius = 0 }) {
  const uid = useRef(`gb${++instanceCounter}`).current;
  const layout = LAYOUTS[Math.abs(seed) % LAYOUTS.length];
  const [c1, c2, c3] = useMemo(
    () =>
      colors && colors.length === 3
        ? colors
        : ["#7C5CFF", "#2FE6C8", "#08080B"],
    [colors]
  );

  return (
    <View style={[styles.wrap, { borderRadius: radius }, style]}>
      <Svg
        width="100%"
        height="100%"
        viewBox="0 0 100 100"
        preserveAspectRatio="xMidYMid slice"
      >
        <Defs>
          <RadialGradient id={`${uid}a`} cx="50%" cy="50%" r="60%">
            <Stop offset="0%" stopColor={c1} stopOpacity="0.95" />
            <Stop offset="100%" stopColor={c1} stopOpacity="0" />
          </RadialGradient>
          <RadialGradient id={`${uid}b`} cx="50%" cy="50%" r="60%">
            <Stop offset="0%" stopColor={c2} stopOpacity="0.9" />
            <Stop offset="100%" stopColor={c2} stopOpacity="0" />
          </RadialGradient>
          <RadialGradient id={`${uid}c`} cx="50%" cy="50%" r="65%">
            <Stop offset="0%" stopColor={c3} stopOpacity="1" />
            <Stop offset="100%" stopColor={c3} stopOpacity="0" />
          </RadialGradient>
          <RadialGradient id={`${uid}sheen`} cx="50%" cy="50%" r="70%">
            <Stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.16" />
            <Stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
          </RadialGradient>
        </Defs>

        <Rect x="0" y="0" width="100" height="100" fill="#08080B" />
        <Ellipse
          cx={layout[2].cx}
          cy={layout[2].cy}
          rx={layout[2].rx}
          ry={layout[2].ry}
          fill={`url(#${uid}c)`}
        />
        <Ellipse
          cx={layout[0].cx}
          cy={layout[0].cy}
          rx={layout[0].rx}
          ry={layout[0].ry}
          fill={`url(#${uid}a)`}
        />
        <Ellipse
          cx={layout[1].cx}
          cy={layout[1].cy}
          rx={layout[1].rx}
          ry={layout[1].ry}
          fill={`url(#${uid}b)`}
        />
        <Ellipse cx="30" cy="15" rx="40" ry="20" fill={`url(#${uid}sheen)`} />
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    overflow: "hidden",
  },
});
