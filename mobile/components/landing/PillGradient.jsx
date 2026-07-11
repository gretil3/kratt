// A smooth diagonal gradient fill for the hero's tall pill cards — a
// LinearGradient sweep instead of GradientBlob's radial "mesh" look, because
// radial blobs read as circles/spheres regardless of how tall the container
// is. `preserveAspectRatio="none"` lets the 0-100 gradient space stretch to
// match whatever aspect the pill actually renders at, so it reads as one
// continuous long oval instead of a cropped circle. A bottom scrim keeps the
// label text readable no matter which category colors sit underneath.
import { useRef } from "react";
import { StyleSheet, View } from "react-native";
import Svg, { Defs, LinearGradient, RadialGradient, Stop, Rect } from "react-native-svg";

let instanceCounter = 0;

export default function PillGradient({ colors, style, radius = 0 }) {
  const uid = useRef(`pg${++instanceCounter}`).current;
  const [c1, c2, c3] = colors && colors.length === 3 ? colors : ["#7C5CFF", "#2FE6C8", "#08080B"];

  return (
    <View style={[styles.wrap, { borderRadius: radius }, style]}>
      <Svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
        <Defs>
          <LinearGradient id={`${uid}main`} x1="10%" y1="0%" x2="90%" y2="100%">
            <Stop offset="0%" stopColor={c1} />
            <Stop offset="55%" stopColor={c2} />
            <Stop offset="100%" stopColor={c3} />
          </LinearGradient>
          <RadialGradient id={`${uid}sheen`} cx="28%" cy="14%" r="40%">
            <Stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.4" />
            <Stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
          </RadialGradient>
          <LinearGradient id={`${uid}scrim`} x1="0%" y1="0%" x2="0%" y2="100%">
            <Stop offset="0%" stopColor="#000000" stopOpacity="0" />
            <Stop offset="58%" stopColor="#000000" stopOpacity="0" />
            <Stop offset="100%" stopColor="#000000" stopOpacity="0.85" />
          </LinearGradient>
        </Defs>

        <Rect x="0" y="0" width="100" height="100" fill={`url(#${uid}main)`} />
        <Rect x="0" y="0" width="100" height="100" fill={`url(#${uid}sheen)`} />
        <Rect x="0" y="0" width="100" height="100" fill={`url(#${uid}scrim)`} />
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    overflow: "hidden",
  },
});
