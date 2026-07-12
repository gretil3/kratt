// "Manufactured consensus" explainer — four cards shown before the first visit
// to /home (gated there via STORAGE_KEYS.onboardingSeen), and re-openable any
// time from the home screen or the landing page. Plain index-state paging
// keeps it identical across native and web.
import { useMemo, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { useTheme } from "../context/ThemeContext";
import PillButton from "../components/ui/PillButton";
import GradientBlob from "../components/ui/GradientBlob";
import ThemedStatusBar from "../components/ui/ThemedStatusBar";
import { STORAGE_KEYS, setStored } from "../lib/storage";

const CARDS = [
  {
    kicker: "MANUFACTURED CONSENSUS",
    title: "Agreement can be staged",
    body: "Astroturfing is the practice of using fake or coordinated accounts that pose as ordinary people, so one actor's message looks like a groundswell of independent voices. The “everyone agrees” you sense in a comment section may have been built on purpose.",
    gradientKey: "brand",
  },
  {
    kicker: "WHY IT WORKS",
    title: "We trust the crowd by default",
    body: "People lean on social proof: when a view looks like the majority opinion, we grant it extra credibility — usually without noticing. A comment section that reads as unanimous can shift what you believe, even when the crowd isn't real.",
    gradientKey: "copy_paste",
  },
  {
    kicker: "THE SCALE",
    title: "This isn't a rare trick",
    body: "Researchers studying major social platforms have repeatedly found that a meaningful share of accounts and engagement is automated or coordinated — enough to tilt how popular an opinion appears. Comment sections are a cheap, high-visibility place to do it.",
    gradientKey: "low_effort",
  },
  {
    kicker: "WHERE KRATT FITS",
    title: "A trainer, not a judge",
    body: "Kratt doesn't hand down verdicts on videos. It shows you the evidence — how much of a comment section looks automated, and which patterns give it away — so you get better at spotting manufactured consensus on your own.",
    gradientKey: "genuine",
  },
];

export default function OnboardingScreen() {
  const router = useRouter();
  const theme = useTheme();
  const styles = useMemo(() => makeStyles(theme), [theme]);
  const [index, setIndex] = useState(0);

  const card = CARDS[index];
  const isLast = index === CARDS.length - 1;

  const finish = () => {
    setStored(STORAGE_KEYS.onboardingSeen, true);
    router.replace("/home");
  };

  return (
    <View style={styles.container}>
      <ThemedStatusBar />
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.content}>
          <View style={styles.topRow}>
            <Text style={styles.progress}>
              {String(index + 1).padStart(2, "0")} /{" "}
              {String(CARDS.length).padStart(2, "0")}
            </Text>
            {!isLast && (
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Skip the introduction"
                onPress={finish}
                hitSlop={12}
              >
                <Text style={styles.skip}>Skip</Text>
              </Pressable>
            )}
          </View>

          <GradientBlob
            colors={theme.gradients[card.gradientKey]}
            seed={index}
            radius={theme.radius.lg}
            style={styles.blob}
          />

          <Text style={styles.kicker}>{card.kicker}</Text>
          <Text style={styles.title}>{card.title}</Text>
          <Text style={styles.body}>{card.body}</Text>

          <View style={styles.dots}>
            {CARDS.map((_, i) => (
              <View
                key={i}
                style={[styles.dot, i === index ? styles.dotActive : null]}
              />
            ))}
          </View>

          <View style={styles.buttons}>
            {index > 0 ? (
              <PillButton
                label="Back"
                variant="secondary"
                onPress={() => setIndex(index - 1)}
                style={styles.button}
              />
            ) : (
              <View style={styles.button} />
            )}
            <PillButton
              label={isLast ? "Got it — try Kratt" : "Next"}
              onPress={isLast ? finish : () => setIndex(index + 1)}
              style={styles.button}
            />
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

function makeStyles(theme) {
  const { color, font, type } = theme;
  return StyleSheet.create({
    // Transparent: the shared bg + constellation live in app/_layout.jsx.
    container: {
      flex: 1,
    },
    scroll: {
      flexGrow: 1,
      justifyContent: "center",
      paddingVertical: 40,
    },
    content: {
      paddingHorizontal: 24,
      width: "100%",
      maxWidth: 560,
      alignSelf: "center",
    },
    topRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 24,
    },
    progress: {
      fontFamily: font.monoBold,
      fontSize: 12,
      letterSpacing: 1.4,
      color: color.inkFaint,
    },
    skip: {
      ...type.small,
      color: color.inkMuted,
    },
    blob: {
      height: 160,
      marginBottom: 28,
    },
    kicker: {
      ...type.monoLabel,
      marginBottom: 10,
    },
    title: {
      ...type.h2,
      marginBottom: 12,
    },
    body: {
      ...type.bodyLarge,
      // Fixed height across cards would be nicer than reflow, but copy lengths
      // are close enough that the buttons barely move.
      minHeight: 130,
    },
    dots: {
      flexDirection: "row",
      gap: 8,
      marginTop: 20,
      marginBottom: 28,
    },
    dot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: color.border,
    },
    dotActive: {
      backgroundColor: color.ink,
    },
    buttons: {
      flexDirection: "row",
      gap: 12,
    },
    button: {
      flex: 1,
    },
  });
}
