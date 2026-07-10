import { useEffect } from "react";
import { Platform, StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import LandingScreen from "../components/landing/LandingScreen";

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
      <StatusBar style="light" />
      <Text style={styles.title}>Kratt</Text>
      <Text style={styles.tagline}>Sniffing out bots in your comments.</Text>
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
    backgroundColor: "#0B0F1A",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  title: {
    fontSize: 42,
    fontWeight: "800",
    color: "#FFFFFF",
    letterSpacing: 1,
  },
  tagline: {
    fontSize: 14,
    color: "#8A93A6",
  },
});
