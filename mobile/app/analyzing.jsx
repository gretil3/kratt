// Loading screen: runs the request, then navigates to /analysis/{videoId}
// once the result lands. Cancel aborts the in-flight request and returns home.
import { useEffect, useRef, useState } from "react";
import {
  Animated,
  Easing,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useRouter } from "expo-router";
import Svg, { Defs, RadialGradient, Rect, Stop } from "react-native-svg";
import { useAnalysis } from "../context/AnalysisContext";
import { useTheme } from "../context/ThemeContext";
import { parseVideoId } from "../lib/youtube";
import BucketHead from "../components/kratt/BucketHead";
import Stripes from "../components/kratt/Stripes";
import Button from "../components/ui/Button";
import ThemedStatusBar from "../components/ui/ThemedStatusBar";
import { materials } from "../theme/themes";
import { useNativeDriver } from "../theme/webStyle";

const STATUS_MESSAGES = [
  "Pulling comments",
  "Reading patterns",
  "Finishing the count",
];
const STATUS_INTERVAL_MS = 1100;

function Spinner() {
  const { color } = useTheme();
  const spin = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.timing(spin, {
        toValue: 1,
        duration: 800,
        easing: Easing.linear,
        useNativeDriver,
      })
    );
    loop.start();
    return () => loop.stop();
  }, [spin]);

  return (
    <Animated.View
      style={[
        styles.spinner,
        {
          borderColor: "rgba(241,234,219,0.18)",
          borderTopColor: color.accent,
          transform: [
            {
              rotate: spin.interpolate({
                inputRange: [0, 1],
                outputRange: ["0deg", "360deg"],
              }),
            },
          ],
        },
      ]}
    />
  );
}

export default function AnalyzingScreen() {
  const router = useRouter();
  const { color, font, type, radius } = useTheme();
  const { videoUrl, runAnalysis, cancelAnalysis, result } = useAnalysis();
  const [statusIndex, setStatusIndex] = useState(0);
  const hasStarted = useRef(false);

  const done = result != null;

  // The status text cycles only while the request is in flight.
  useEffect(() => {
    if (done) return undefined;
    const interval = setInterval(() => {
      setStatusIndex((current) => (current + 1) % STATUS_MESSAGES.length);
    }, STATUS_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [done]);

  useEffect(() => {
    if (hasStarted.current) return;
    hasStarted.current = true;

    runAnalysis(videoUrl).then((outcome) => {
      // Success navigation happens in the effect below; a cancel means
      // the user already navigated away.
      if (!outcome.ok && !outcome.aborted && !outcome.cancelled) {
        router.replace("/error");
      }
    });
  }, [videoUrl, runAnalysis, router]);

  useEffect(() => {
    if (!done) return;
    const videoId = parseVideoId(videoUrl);
    router.replace(videoId ? `/analysis/${videoId}` : "/home");
  }, [done, videoUrl, router]);

  const handleCancel = () => {
    cancelAnalysis();
    router.replace("/home");
  };

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.scroll}>
      <ThemedStatusBar />
      <View style={styles.content}>
        <View
          style={[
            styles.stage,
            {
              backgroundColor: color.surface,
              borderColor: color.border,
              borderRadius: radius.lg + 2,
            },
          ]}
        >
          <Svg style={StyleSheet.absoluteFill} width="100%" height="100%">
            <Defs>
              <RadialGradient id="analyzing-glow" cx="50%" cy="30%" r="50%">
                <Stop offset="0" stopColor={color.ember} stopOpacity={0.22} />
                <Stop offset="0.62" stopColor={color.ember} stopOpacity={0} />
              </RadialGradient>
            </Defs>
            <Rect width="100%" height="100%" fill="url(#analyzing-glow)" />
          </Svg>
          <BucketHead width={150} scan={!done} style={styles.bucket} />
          <View style={styles.strawEdge}>
            <Stripes stops={materials.straw} />
          </View>
        </View>

        <Text style={[type.monoLabel, styles.eyebrow]}>KRATT IS AT WORK</Text>
        <Text style={[type.display, styles.title]}>Reading the comments</Text>
        <Text style={[type.bodyLarge, styles.body]}>
          Kratt is pulling this video&apos;s comment section and sorting every
          comment into an evidence category. Bigger comment sections take a
          little longer.
        </Text>

        <View style={styles.statusRow} accessibilityLiveRegion="polite">
          <Spinner />
          <Text
            style={[
              styles.status,
              { color: color.inkMuted, fontFamily: font.sans },
            ]}
          >
            {STATUS_MESSAGES[statusIndex]}…
          </Text>
        </View>

        <Button
          label="Cancel"
          variant="secondary"
          size="sm"
          onPress={handleCancel}
          style={styles.cancel}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  scroll: {
    flexGrow: 1,
    paddingBottom: 72,
  },
  content: {
    width: "100%",
    maxWidth: 580,
    alignSelf: "center",
    paddingHorizontal: 24,
    paddingTop: 40,
  },
  stage: {
    height: 184,
    borderWidth: 1,
    overflow: "hidden",
    marginBottom: 34,
    alignItems: "center",
  },
  bucket: {
    marginTop: 26,
  },
  strawEdge: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: 26,
  },
  eyebrow: {
    marginBottom: 10,
  },
  title: {
    fontSize: 44,
    lineHeight: 46,
    letterSpacing: -1.8,
    marginBottom: 12,
  },
  body: {
    marginBottom: 30,
  },
  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    height: 24,
  },
  spinner: {
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 2,
  },
  status: {
    fontSize: 14,
  },
  cancel: {
    alignSelf: "center",
    marginTop: 22,
  },
});
