// Font family names loaded in app/_layout.jsx via @expo-google-fonts.
// This file used to hold the full "evidence board" token set (sage/moss/straw/
// rust palette); that system was superseded by the themed dark/light system in
// ./themes.js — the single source of truth for all visual design. Only the
// font map survives, consumed exclusively by themes.js. Don't import this file
// from screens or components; use useTheme() instead.
//
// Two weights max per face. Custom families already encode the weight, so
// never pair these with fontWeight (Android falls back to system if you do).
export const font = {
  slab: "ZillaSlab_600SemiBold", // headlines
  slabMedium: "ZillaSlab_500Medium",
  sans: "Archivo_400Regular", // body & UI
  sansBold: "Archivo_600SemiBold",
  mono: "SpaceMono_400Regular", // scores, counts, stamps
  monoBold: "SpaceMono_700Bold",
};
