import { View } from "react-native";
import { Stack, usePathname } from "expo-router";
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
import ConstellationBackground from "../components/ui/ConstellationBackground";

function RootNavigator() {
  const { color } = useTheme();
  const pathname = usePathname();

  return (
    // The root View owns the background color and the constellation is
    // mounted once here, behind the Stack — so every screen shares the same
    // ambient field instead of only the landing page having one. Screens must
    // therefore keep their containers transparent: contentStyle stays
    // transparent too, or the navigator would paint over the particles.
    <View style={{ flex: 1, backgroundColor: color.bg }}>
      <ConstellationBackground density={pathname === "/" ? 1 : 0.45} />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: "transparent" },
        }}
      />
    </View>
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
