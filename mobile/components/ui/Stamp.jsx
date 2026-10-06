// Category tag: a luggage-tag shape (pointed left edge, punched hole) filled
// with the category color, e.g. [• SPAM]. Used on the landing categories,
// result cards and flagged-comment rows.
import { StyleSheet, Text, View } from "react-native";
import Svg, { Polygon } from "react-native-svg";
import { useTheme } from "../../context/ThemeContext";

const HEIGHT = 24;
const POINT = 8;

export default function Stamp({ label, color, style }) {
  const theme = useTheme();
  return (
    <View style={[styles.row, style]}>
      {/* One px wider than the point and overlapped by the body, so no
          hairline seam shows between the two at fractional zoom levels. */}
      <Svg width={POINT + 1} height={HEIGHT}>
        <Polygon
          points={`${POINT + 1},0 ${POINT + 1},${HEIGHT} 0,${HEIGHT / 2}`}
          fill={color}
        />
      </Svg>
      <View style={[styles.body, { backgroundColor: color }]}>
        <View
          style={[styles.hole, { backgroundColor: theme.color.onAccent }]}
        />
        <Text
          style={[
            styles.label,
            { fontFamily: theme.font.monoBold, color: theme.color.onAccent },
          ]}
        >
          {label}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignSelf: "flex-start",
  },
  body: {
    height: HEIGHT,
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    marginLeft: -1,
    paddingLeft: 6,
    paddingRight: 10,
  },
  hole: {
    width: 4,
    height: 4,
    borderRadius: 2,
  },
  label: {
    fontSize: 11,
    lineHeight: 14,
    letterSpacing: 1.1,
  },
});
