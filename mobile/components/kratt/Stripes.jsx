// Fills its parent with a repeating stripe texture — straw, twine, or the
// "one straw = 1%" bars. An SVG pattern rather than CSS gradients so the same
// texture renders on native and web. The parent sets size, radius and
// overflow; this only paints.
import { useId } from "react";
import { StyleSheet, View } from "react-native";
import Svg, { Defs, Pattern, Rect } from "react-native-svg";

// [[color, width], …] stops for evenly spaced single-color bars.
export function bars(color, barWidth, gapWidth) {
  return [
    [color, barWidth],
    ["transparent", gapWidth],
  ];
}

export default function Stripes({ stops, angle = 0, style }) {
  // useId() returns ":r1:"-style strings; colons break url(#…) references.
  const id = `stripes-${useId().replace(/[^a-zA-Z0-9]/g, "")}`;
  const period = stops.reduce((sum, [, width]) => sum + width, 0);

  let offset = 0;
  const rects = stops.map(([fill, width], index) => {
    const x = offset;
    offset += width;
    return fill === "transparent" ? null : (
      <Rect key={index} x={x} y={0} width={width} height={period} fill={fill} />
    );
  });

  return (
    <View pointerEvents="none" style={[StyleSheet.absoluteFill, style]}>
      <Svg width="100%" height="100%">
        <Defs>
          <Pattern
            id={id}
            patternUnits="userSpaceOnUse"
            width={period}
            height={period}
            patternTransform={angle ? `rotate(${angle})` : undefined}
          >
            {rects}
          </Pattern>
        </Defs>
        <Rect x={0} y={0} width="100%" height="100%" fill={`url(#${id})`} />
      </Svg>
    </View>
  );
}
