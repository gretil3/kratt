// The bucket head's two glowing ember eyes. They blink every few seconds and
// pulse softly; with `scan` they sweep side to side, which the analyzing
// screen uses as its "working" signal. Fills its parent (the visor slot).
import { useEffect, useRef } from "react";
import { Animated, Easing, StyleSheet, View } from "react-native";
import { useTheme } from "../../context/ThemeContext";
import { useReducedMotion } from "../../lib/useReducedMotion";
import { nativeStyle, useNativeDriver, webStyle } from "../../theme/webStyle";

const BLINK_EVERY_MS = 5600;
const PULSE_MS = 1500;
const SCAN_MS = 800;

export default function KrattEyes({ size, gap, scan = false, animate = true }) {
  const { color } = useTheme();
  const reducedMotion = useReducedMotion();
  const moving = animate && !reducedMotion;

  const blink = useRef(new Animated.Value(1)).current;
  const pulse = useRef(new Animated.Value(1)).current;
  const sweep = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!moving) return undefined;
    const ease = Easing.inOut(Easing.ease);
    const loops = [
      Animated.loop(
        Animated.sequence([
          Animated.delay(BLINK_EVERY_MS),
          Animated.timing(blink, {
            toValue: 0.12,
            duration: 160,
            useNativeDriver,
          }),
          Animated.timing(blink, {
            toValue: 1,
            duration: 220,
            useNativeDriver,
          }),
        ])
      ),
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulse, {
            toValue: 0.72,
            duration: PULSE_MS,
            easing: ease,
            useNativeDriver,
          }),
          Animated.timing(pulse, {
            toValue: 1,
            duration: PULSE_MS,
            easing: ease,
            useNativeDriver,
          }),
        ])
      ),
    ];
    loops.forEach((loop) => loop.start());
    return () => loops.forEach((loop) => loop.stop());
  }, [moving, blink, pulse]);

  useEffect(() => {
    if (!moving || !scan) {
      Animated.timing(sweep, {
        toValue: 0,
        duration: 300,
        useNativeDriver,
      }).start();
      return undefined;
    }
    const ease = Easing.inOut(Easing.ease);
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(sweep, {
          toValue: 1,
          duration: SCAN_MS,
          easing: ease,
          useNativeDriver,
        }),
        Animated.timing(sweep, {
          toValue: -1,
          duration: SCAN_MS,
          easing: ease,
          useNativeDriver,
        }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [moving, scan, sweep]);

  const travel = size * 0.65;
  const eyeStyle = [
    {
      width: size,
      height: size,
      borderRadius: size / 2,
      backgroundColor: color.ember,
      opacity: pulse,
      transform: [{ scaleY: blink }],
    },
    // iOS glow; Android has no colored shadows, the dot alone reads fine.
    nativeStyle({
      shadowColor: color.ember,
      shadowOpacity: 0.8,
      shadowRadius: size * 0.6,
      shadowOffset: { width: 0, height: 0 },
    }),
    webStyle({
      boxShadow:
        `0 0 ${size * 0.7}px ${size * 0.2}px rgba(255,106,61,0.7), ` +
        `0 0 ${size * 2}px ${size * 0.5}px rgba(255,106,61,0.25)`,
    }),
  ];

  return (
    <View pointerEvents="none" style={styles.fill}>
      <Animated.View
        style={[
          styles.row,
          { gap },
          {
            transform: [
              {
                translateX: sweep.interpolate({
                  inputRange: [-1, 1],
                  outputRange: [-travel, travel],
                }),
              },
            ],
          },
        ]}
      >
        <Animated.View style={eyeStyle} />
        <Animated.View style={eyeStyle} />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  fill: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
});
