// The hero illustration: a straw kratt with a bucket head, holding up an
// example analysis card. Drawn in fixed 460×560 design coordinates and scaled
// as a whole via `scale`, so every limb stays where the design put it.
import { StyleSheet, Text, View } from "react-native";
import Svg, {
  Circle,
  ClipPath,
  Defs,
  Ellipse,
  G,
  LinearGradient,
  Path,
  Pattern,
  Polygon,
  RadialGradient,
  Rect,
  Stop,
} from "react-native-svg";
import { useTheme } from "../../context/ThemeContext";
import { materials } from "../../theme/themes";
import { nativeStyle, webStyle } from "../../theme/webStyle";
import KrattEyes from "./KrattEyes";

const W = 460;
const H = 560;

// The body's outline as percentages of its 170×262 box: a tunic that flares
// below the twine belt into a ragged, straw-cut hem.
const BODY = { x: 95, y: 192, w: 170, h: 262 };
const BODY_OUTLINE = [
  [12, 0],
  [88, 0],
  [74, 40],
  [100, 93],
  [96, 100],
  [91, 95],
  [86, 100],
  [81, 94],
  [76, 100],
  [71, 95],
  [66, 100],
  [61, 94],
  [56, 100],
  [51, 95],
  [46, 100],
  [41, 94],
  [36, 100],
  [31, 95],
  [26, 100],
  [21, 94],
  [16, 100],
  [11, 95],
  [6, 100],
  [2, 94],
  [0, 93],
  [26, 40],
]
  .map(
    ([px, py]) =>
      `${BODY.x + (px / 100) * BODY.w},${BODY.y + (py / 100) * BODY.h}`
  )
  .join(" ");

const PAIL = "123,50 237,50 255,176 105,176";

// Example card breakdown — illustrative only, not live data.
const CARD_BARS = [
  ["ads_spam", 22],
  ["copy_paste", 18],
  ["low_effort", 25],
  ["genuine", 35],
];

function stripeRects(stops, height) {
  let x = 0;
  return stops.map(([fill, width], index) => {
    const rect = (
      <Rect key={index} x={x} y={0} width={width} height={height} fill={fill} />
    );
    x += width;
    return rect;
  });
}

const period = (stops) => stops.reduce((sum, [, width]) => sum + width, 0);

// A rotated rounded bar (arm, leg, straw), rotating about (cx, cy).
function Stick({ x, y, w, h, fill, angle, cx, cy }) {
  return (
    <Rect
      x={x}
      y={y}
      width={w}
      height={h}
      rx={Math.min(w, h) / 2}
      fill={fill}
      transform={`rotate(${angle} ${cx ?? x + w / 2} ${cy ?? y + h / 2})`}
    />
  );
}

export default function KrattFigure({ scale = 1, animate = true, style }) {
  const theme = useTheme();
  const strawP = period(materials.straw);
  const twineP = period(materials.twine);

  return (
    <View
      aria-hidden
      accessible={false}
      importantForAccessibility="no-hide-descendants"
      style={[{ width: W * scale, height: H * scale }, style]}
    >
      <View
        style={[
          styles.stage,
          {
            left: (W * scale - W) / 2,
            top: (H * scale - H) / 2,
            transform: [{ scale }],
          },
        ]}
      >
        <Svg width={W} height={H} style={StyleSheet.absoluteFill}>
          <Defs>
            <RadialGradient id="kf-glow">
              <Stop
                offset="0"
                stopColor={theme.color.ember}
                stopOpacity={0.2}
              />
              <Stop
                offset="0.62"
                stopColor={theme.color.ember}
                stopOpacity={0}
              />
            </RadialGradient>
            <RadialGradient id="kf-floor">
              <Stop offset="0" stopColor="#000000" stopOpacity={0.6} />
              <Stop offset="0.7" stopColor="#000000" stopOpacity={0} />
            </RadialGradient>
            <Pattern
              id="kf-straw"
              patternUnits="userSpaceOnUse"
              width={strawP}
              height={strawP}
            >
              {stripeRects(materials.straw, strawP)}
            </Pattern>
            <Pattern
              id="kf-twine"
              patternUnits="userSpaceOnUse"
              width={twineP}
              height={twineP}
              patternTransform="rotate(45)"
            >
              {stripeRects(materials.twine, twineP)}
            </Pattern>
            <LinearGradient
              id="kf-tin"
              x1="105"
              y1="0"
              x2="255"
              y2="0"
              gradientUnits="userSpaceOnUse"
            >
              {materials.tin.map(([offset, stop]) => (
                <Stop key={offset} offset={offset} stopColor={stop} />
              ))}
            </LinearGradient>
            <LinearGradient
              id="kf-rim"
              x1="98"
              y1="0"
              x2="262"
              y2="0"
              gradientUnits="userSpaceOnUse"
            >
              <Stop offset="0" stopColor="#6E6A61" />
              <Stop offset="0.35" stopColor="#B3AEA2" />
              <Stop offset="0.7" stopColor="#8E8A80" />
              <Stop offset="1" stopColor="#5E5A52" />
            </LinearGradient>
            <LinearGradient id="kf-shade" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0" stopColor="#14110C" stopOpacity={0.35} />
              <Stop offset="1" stopColor="#14110C" stopOpacity={0} />
            </LinearGradient>
            <ClipPath id="kf-body">
              <Polygon points={BODY_OUTLINE} />
            </ClipPath>
            <ClipPath id="kf-pail">
              <Polygon points={PAIL} />
            </ClipPath>
          </Defs>

          {/* ember glow behind the head */}
          <Circle cx={190} cy={150} r={170} fill="url(#kf-glow)" />

          {/* floor */}
          <Ellipse cx={190} cy={531} rx={120} ry={11} fill="url(#kf-floor)" />
          <Rect
            x={0}
            y={534}
            width={W}
            height={1}
            fill="rgba(241,234,219,0.14)"
          />

          {/* legs */}
          <Stick x={162} y={440} w={9} h={92} fill={materials.wood} angle={5} />
          <Stick
            x={196}
            y={440}
            w={9}
            h={92}
            fill={materials.woodDark}
            angle={-5}
          />

          {/* left arm (pivots at the shoulder) + straw fingers */}
          <Stick
            x={12}
            y={228}
            w={120}
            h={9}
            fill={materials.wood}
            angle={-38}
            cx={132}
            cy={232.5}
          />
          <Stick x={30} y={296} w={4} h={34} fill="#E9B949" angle={28} />
          <Stick x={38} y={300} w={3} h={30} fill="#C8963A" angle={8} />
          <Stick x={45} y={298} w={3} h={28} fill="#F3D27A" angle={-14} />

          {/* right arm, raised toward the card */}
          <Stick
            x={228}
            y={228}
            w={92}
            h={9}
            fill={materials.wood}
            angle={-30}
            cx={228}
            cy={232.5}
          />

          {/* straw body with twine belt */}
          <G clipPath="url(#kf-body)">
            <Rect
              x={BODY.x}
              y={BODY.y}
              width={BODY.w}
              height={BODY.h}
              fill="url(#kf-straw)"
            />
            <Rect
              x={BODY.x}
              y={BODY.y + 94}
              width={BODY.w}
              height={18}
              fill="url(#kf-twine)"
            />
            <Rect
              x={BODY.x}
              y={BODY.y}
              width={BODY.w}
              height={40}
              fill="url(#kf-shade)"
            />
          </G>

          {/* neck binding + straw tufts at the shoulders */}
          <Rect
            x={156}
            y={182}
            width={48}
            height={16}
            rx={2}
            fill="url(#kf-twine)"
          />
          <Stick x={96} y={160} w={3} h={40} fill="#E9B949" angle={-34} />
          <Stick x={106} y={166} w={3} h={34} fill="#C8963A" angle={-18} />
          <Stick x={258} y={160} w={3} h={40} fill="#F3D27A" angle={34} />
          <Stick x={248} y={166} w={3} h={34} fill="#C8963A" angle={18} />

          {/* bucket head */}
          <Path
            d="M130 80 L130 66 A46 46 0 0 1 222 66 L222 80"
            stroke={materials.tinHandle}
            strokeWidth={4}
            fill="none"
          />
          <Polygon points={PAIL} fill="url(#kf-tin)" />
          <G clipPath="url(#kf-pail)">
            <Rect
              x={105}
              y={66}
              width={150}
              height={3}
              fill="rgba(20,17,12,0.22)"
            />
            <Rect
              x={105}
              y={154}
              width={150}
              height={3}
              fill="rgba(20,17,12,0.22)"
            />
          </G>
          <Rect
            x={98}
            y={170}
            width={164}
            height={13}
            rx={3}
            fill="url(#kf-rim)"
          />
        </Svg>

        <View
          style={[
            styles.visor,
            webStyle({ boxShadow: "inset 0 2px 6px rgba(0,0,0,0.6)" }),
          ]}
        >
          <KrattEyes size={14} gap={34} animate={animate} />
        </View>

        <View
          style={[
            styles.card,
            { backgroundColor: theme.color.ink },
            webStyle({ boxShadow: "0 18px 40px rgba(0,0,0,0.55)" }),
            nativeStyle(CARD_SHADOW_NATIVE),
          ]}
        >
          <Text style={[styles.cardLabel, { fontFamily: theme.font.monoBold }]}>
            ANALYSIS RESULT
          </Text>
          <View style={styles.cardScoreRow}>
            <Text
              style={[styles.cardScore, { fontFamily: theme.font.monoBold }]}
            >
              65
            </Text>
            <Text
              style={[styles.cardPercent, { fontFamily: theme.font.monoBold }]}
            >
              %
            </Text>
          </View>
          <Text style={[styles.cardCaption, { fontFamily: theme.font.sans }]}>
            likely bot activity
          </Text>
          <View style={styles.cardBar}>
            {CARD_BARS.map(([key, share]) => (
              <View
                key={key}
                style={{ flex: share, backgroundColor: theme.category[key] }}
              />
            ))}
          </View>
          <Text style={[styles.cardFoot, { fontFamily: theme.font.sans }]}>
            Based on 1,214 comments analyzed
          </Text>
        </View>
      </View>
    </View>
  );
}

const CARD_INK = "#14110C";

const CARD_SHADOW_NATIVE = {
  shadowColor: "#000000",
  shadowOpacity: 0.55,
  shadowRadius: 20,
  shadowOffset: { width: 0, height: 18 },
  elevation: 12,
};

const styles = StyleSheet.create({
  stage: {
    position: "absolute",
    width: W,
    height: H,
  },
  visor: {
    position: "absolute",
    left: 121,
    top: 96,
    width: 118,
    height: 30,
    borderRadius: 5,
    backgroundColor: materials.visor,
  },
  card: {
    position: "absolute",
    left: 292,
    top: 112,
    width: 208, // the design's 176px content box + 16px padding each side
    borderRadius: 6,
    paddingTop: 16,
    paddingHorizontal: 16,
    paddingBottom: 14,
    transform: [{ rotate: "5deg" }],
  },
  cardLabel: {
    fontSize: 9.5,
    letterSpacing: 1.1,
    color: "rgba(20,17,12,0.62)",
    marginBottom: 6,
  },
  cardScoreRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 2,
  },
  cardScore: {
    fontSize: 44,
    lineHeight: 46,
    color: CARD_INK,
  },
  cardPercent: {
    fontSize: 20,
    lineHeight: 30,
    color: CARD_INK,
  },
  cardCaption: {
    fontSize: 12,
    color: "rgba(20,17,12,0.70)",
    marginTop: 2,
    marginBottom: 10,
  },
  cardBar: {
    flexDirection: "row",
    height: 8,
    gap: 2,
    borderRadius: 2,
    overflow: "hidden",
    marginBottom: 8,
  },
  cardFoot: {
    fontSize: 10.5,
    color: "rgba(20,17,12,0.62)",
  },
});
