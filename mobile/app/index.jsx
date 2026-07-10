import { useEffect } from "react";
import { Platform, StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import LandingScreen from "../components/landing/LandingScreen";
import { color, font, type } from "../theme/tokens";

const SPLASH_DURATION_MS = 1500;

// On native the app opens straight into the tool, so `/` stays a short
// branded splash. On web `/` is the landing page.
function NativeSplash() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace("/home");
    }, SPLASH_DURATION_MS);
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <View style={styles.brandRow}>
        <View style={styles.brandMark} />
        <Text style={styles.title}>Kratt</Text>
      </View>
      <Text style={styles.tagline}>Mengendus bot di kolom komentar.</Text>
    </View>
  );
}

export default function Index() {
  if (Platform.OS === "web") {
    return <LandingScreen />;
  }
  return <NativeSplash />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: color.bg,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  brandRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  brandMark: {
    width: 12,
    height: 12,
    backgroundColor: color.straw,
  },
  title: {
    fontFamily: font.slab,
    fontSize: 42,
    color: color.ink,
  },
  tagline: {
    ...type.small,
  },
});
