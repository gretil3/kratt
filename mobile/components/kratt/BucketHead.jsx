// Kratt's bucket head: a tin pail with a handle, a dark visor and two ember
// eyes. Scales from a 28px nav logo up to the 220px CTA illustration; every
// measurement is a fraction of `width`.
import { useId } from "react";
import { View } from "react-native";
import Svg, {
  ClipPath,
  Defs,
  G,
  LinearGradient,
  Path,
  Polygon,
  Rect,
  Stop,
} from "react-native-svg";
import { materials } from "../../theme/themes";
import { webStyle } from "../../theme/webStyle";
import KrattEyes from "./KrattEyes";

export const BUCKET_ASPECT = 0.88; // height / width

export default function BucketHead({
  width,
  handle = true,
  handleColor = materials.tinHandle,
  scan = false,
  animate = true,
  style,
}) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, "");
  const W = width;
  const H = W * BUCKET_ASPECT;

  const bodyTop = handle ? W * 0.16 : 0;
  const bodyH = H - bodyTop;
  const stroke = Math.max(2, W * 0.027);

  // Handle: an arch whose legs disappear behind the pail.
  const left = W * 0.22 + stroke / 2;
  const right = W * 0.78 - stroke / 2;
  const r = (right - left) / 2;
  const top = stroke / 2;
  const legEnd = bodyTop + W * 0.05;
  const handlePath =
    `M ${left} ${legEnd} L ${left} ${top + r} ` +
    `A ${r} ${r} 0 0 1 ${right} ${top + r} L ${right} ${legEnd}`;

  const body = `${W * 0.12},${bodyTop} ${W * 0.88},${bodyTop} ${W},${H} 0,${H}`;

  const visorInset = W * 0.107;
  const visorTop = bodyTop + bodyH * 0.37;
  const visorH = Math.max(5, bodyH * 0.28);
  const eye = Math.max(3, W * 0.093);

  return (
    <View
      aria-hidden
      accessible={false}
      importantForAccessibility="no-hide-descendants"
      style={[{ width: W, height: H }, style]}
    >
      <Svg width={W} height={H}>
        <Defs>
          <LinearGradient
            id={`tin${uid}`}
            x1="0"
            y1="0"
            x2={W}
            y2="0"
            gradientUnits="userSpaceOnUse"
          >
            {materials.tin.map(([offset, stop]) => (
              <Stop key={offset} offset={offset} stopColor={stop} />
            ))}
          </LinearGradient>
          <ClipPath id={`pail${uid}`}>
            <Polygon points={body} />
          </ClipPath>
        </Defs>
        {handle ? (
          <Path
            d={handlePath}
            stroke={handleColor}
            strokeWidth={stroke}
            fill="none"
          />
        ) : null}
        <Polygon points={body} fill={`url(#tin${uid})`} />
        <G clipPath={`url(#pail${uid})`}>
          <Rect
            x={0}
            y={bodyTop + bodyH * 0.13}
            width={W}
            height={Math.max(1, W * 0.02)}
            fill="rgba(20,17,12,0.22)"
          />
        </G>
      </Svg>
      <View
        style={[
          {
            position: "absolute",
            left: visorInset,
            right: visorInset,
            top: visorTop,
            height: visorH,
            borderRadius: Math.max(2, W * 0.033),
            backgroundColor: materials.visor,
          },
          webStyle({ boxShadow: "inset 0 2px 6px rgba(0,0,0,0.6)" }),
        ]}
      >
        <KrattEyes
          size={eye}
          gap={Math.max(3, W * 0.227)}
          scan={scan}
          animate={animate}
        />
      </View>
    </View>
  );
}
