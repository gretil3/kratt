import { View } from "react-native";
import { Stack } from "expo-router";
import Head from "expo-router/head";
import {
  ThemeProvider as NavigationThemeProvider,
  DarkTheme as NavDarkTheme,
} from "@react-navigation/native";
import {
  useFonts,
  BricolageGrotesque_500Medium,
  BricolageGrotesque_700Bold,
  BricolageGrotesque_800ExtraBold,
} from "@expo-google-fonts/bricolage-grotesque";
import {
  SchibstedGrotesk_400Regular,
  SchibstedGrotesk_600SemiBold,
} from "@expo-google-fonts/schibsted-grotesk";
import {
  SpaceMono_400Regular,
  SpaceMono_700Bold,
} from "@expo-google-fonts/space-mono";
import { AnalysisProvider } from "../context/AnalysisContext";
import { ThemeProvider, useTheme } from "../context/ThemeContext";

// The navigator paints colors.background (React Navigation's theme) over
// everything behind it; transparent lets the root View's bg show through.
const navTheme = {
  ...NavDarkTheme,
  colors: { ...NavDarkTheme.colors, background: "transparent" },
};

function RootNavigator() {
  const { color } = useTheme();

  return (
    // The root View owns the background color, so every screen keeps its
    // containers transparent (contentStyle included).
    <View style={{ flex: 1, backgroundColor: color.bg }}>
      <NavigationThemeProvider value={navTheme}>
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: "transparent" },
          }}
        />
      </NavigationThemeProvider>
    </View>
  );
}

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    BricolageGrotesque_500Medium,
    BricolageGrotesque_700Bold,
    BricolageGrotesque_800ExtraBold,
    SchibstedGrotesk_400Regular,
    SchibstedGrotesk_600SemiBold,
    SpaceMono_400Regular,
    SpaceMono_700Bold,
  });

  // Fonts are bundled assets, so this resolves in one tick on native and a few
  // frames on web — a blank bg-colored frame beats a flash of fallback type.
  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <ThemeProvider>
      <AnalysisProvider>
        {/* Sets document.title on web after hydration (the static shell's
            <title> only covers the pre-JS page); no-op on native. */}
        <Head>
          <title>Kratt — who&apos;s really talking in the comments?</title>
        </Head>
        <RootNavigator />
      </AnalysisProvider>
    </ThemeProvider>
  );
}
