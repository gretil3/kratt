import { Stack } from "expo-router";
import Head from "expo-router/head";
import {
  useFonts,
  ZillaSlab_500Medium,
  ZillaSlab_600SemiBold,
} from "@expo-google-fonts/zilla-slab";
import {
  Archivo_400Regular,
  Archivo_600SemiBold,
} from "@expo-google-fonts/archivo";
import {
  SpaceMono_400Regular,
  SpaceMono_700Bold,
} from "@expo-google-fonts/space-mono";
import { AnalysisProvider } from "../context/AnalysisContext";
import { ThemeProvider, useTheme } from "../context/ThemeContext";

function RootNavigator() {
  const { color } = useTheme();
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: color.bg },
      }}
    />
  );
}

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    ZillaSlab_500Medium,
    ZillaSlab_600SemiBold,
    Archivo_400Regular,
    Archivo_600SemiBold,
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
