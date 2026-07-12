// Analyzing + guess in one screen: the request runs in the background while
// the user commits their estimate, so the wait is thinking time instead of
// dead time (and the wait only gets longer once the real backend cold-starts).
//
// Three completion orderings, all funneled through ONE navigation gate
// (`result && guess != null`):
//
// 1. Guess first, request still running → show "Guess locked in — still
//    counting" and navigate the moment the result lands. No fake navigation
//    to a result that doesn't exist yet.
// 2. Result first, guess not locked → reveal NOTHING. The result sits
//    silently in context and the panel doesn't change; leaking "it's ready"
//    here would gut the whole point of guessing before seeing the score.
// 3. Both ready → navigate to /analysis/{videoId}.
import { useEffect, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useRouter } from "expo-router";
import { useAnalysis } from "../context/AnalysisContext";
import { useTheme } from "../context/ThemeContext";
import { parseVideoId } from "../lib/youtube";
import GuessPanel from "../components/ui/GuessPanel";
import PillButton from "../components/ui/PillButton";
import ThemedStatusBar from "../components/ui/ThemedStatusBar";

const STATUS_MESSAGES = [
  "Pulling comments",
  "Reading patterns",
  "Finishing the count",
];
const STATUS_INTERVAL_MS = 1100;

export default function AnalyzingScreen() {
  const router = useRouter();
  const theme = useTheme();
  const styles = useMemo(() => makeStyles(theme), [theme]);
  const { videoUrl, runAnalysis, cancelAnalysis, result, guess, setGuess } =
    useAnalysis();
  const [statusIndex, setStatusIndex] = useState(0);
  const hasStarted = useRef(false);

  const done = result != null;

  // The status text cycles only while the request is in flight — a spinner
  // caption that keeps "working" after completion is a lie. It freezes on its
  // last message instead of disappearing: vanishing text would broadcast
  // "result is ready" before the guess is locked (ordering 2 above). It also
  // never contains a number.
  useEffect(() => {
    if (done) return undefined;
    const interval = setInterval(() => {
      setStatusIndex((current) => (current + 1) % STATUS_MESSAGES.length);
    }, STATUS_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [done]);

  // Fire the request but never await it before rendering — the guess panel
  // must be interactive from the first frame.
  useEffect(() => {
    if (hasStarted.current) return;
    hasStarted.current = true;

    runAnalysis(videoUrl).then((outcome) => {
      // Success navigation happens in the gate effect below (it must also
      // wait for the guess); an abort means Cancel already navigated away.
      if (!outcome.ok && !outcome.aborted) {
        router.replace("/error");
      }
    });
  }, [videoUrl, runAnalysis, router]);

  // The single navigation gate for all three orderings.
  useEffect(() => {
    if (!done || guess == null) return;
    const videoId = parseVideoId(videoUrl);
    router.replace(videoId ? `/analysis/${videoId}` : "/home");
  }, [done, guess, videoUrl, router]);

  const handleCancel = () => {
    cancelAnalysis();
    router.replace("/home");
  };

  const status = `${STATUS_MESSAGES[statusIndex]}…`;

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.scroll}>
      <ThemedStatusBar />
      {guess == null ? (
        <GuessPanel onSubmit={setGuess} status={status} />
      ) : (
        // Ordering 1: guess locked, result still counting.
        <View style={styles.waitingBlock}>
          <ActivityIndicator size="large" color={theme.color.ink} />
          <Text style={styles.waitingTitle}>Guess locked in</Text>
          <Text style={styles.waitingBody}>
            Still counting the comments — you&apos;ll see how your read compares
            in a moment.
          </Text>
        </View>
      )}

      <PillButton
        label="Cancel"
        variant="secondary"
        size="sm"
        onPress={handleCancel}
        style={styles.cancel}
      />
    </ScrollView>
  );
}

function makeStyles(theme) {
  const { type } = theme;
  return StyleSheet.create({
    // Transparent: the shared bg + constellation live in app/_layout.jsx.
    screen: {
      flex: 1,
    },
    scroll: {
      flexGrow: 1,
      justifyContent: "center",
      padding: 24,
    },
    waitingBlock: {
      alignItems: "center",
      gap: 12,
      paddingVertical: 48,
    },
    waitingTitle: {
      ...type.h3,
      marginTop: 8,
    },
    waitingBody: {
      ...type.body,
      textAlign: "center",
      maxWidth: 380,
    },
    cancel: {
      alignSelf: "center",
      marginTop: 24,
    },
  });
}
