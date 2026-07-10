// Signature element: a short woven strip (straw binding) set into a hairline
// rule. Use at most once per screen — it marks one deliberate seam, not a
// general-purpose divider.
import { StyleSheet, View } from "react-native";
import Svg, { G, Line } from "react-native-svg";
import { color, hairline } from "../../theme/tokens";

const STEP = 8;
const HEIGHT = 10;

export default function WovenDivider({ width = 168, style }) {
  const overStitches = [];
  const underStitches = [];
  for (let x = 2; x + 6 <= width - 2; x += STEP) {
    overStitches.push(
      <Line key={`o${x}`} x1={x} y1={HEIGHT - 1.5} x2={x + 6} y2={1.5} />
    );
    underStitches.push(
      <Line key={`u${x}`} x1={x + 3} y1={1.5} x2={x + 9} y2={HEIGHT - 1.5} />
    );
  }

  return (
    <View style={[styles.row, style]}>
      <View style={styles.rule} />
      <Svg width={width} height={HEIGHT}>
        <G stroke={color.straw} strokeWidth={1.6} strokeLinecap="round" opacity={0.45}>
          {underStitches}
        </G>
        <G stroke={color.straw} strokeWidth={1.6} strokeLinecap="round">
          {overStitches}
        </G>
      </Svg>
      <View style={styles.rule} />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  rule: {
    flex: 1,
    height: hairline,
    backgroundColor: color.hairline,
  },
});
