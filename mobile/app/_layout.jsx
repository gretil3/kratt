import { Stack } from "expo-router";
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
import { color } from "../theme/darkTokens";

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
    <AnalysisProvider>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: color.bg },
        }}
      />
    </AnalysisProvider>
  );
}
