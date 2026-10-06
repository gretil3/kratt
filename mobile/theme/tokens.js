// Font family names loaded in app/_layout.jsx via @expo-google-fonts.
// Consumed only by ./themes.js — screens and components read fonts through
// useTheme().font, never from this file directly.
//
// Custom families already encode the weight, so never pair these with
// fontWeight (Android falls back to the system font if you do).
export const font = {
  display: "BricolageGrotesque_800ExtraBold", // section + hero headlines
  displayBold: "BricolageGrotesque_700Bold", // card titles
  displayMedium: "BricolageGrotesque_500Medium", // quotes, statements
  sans: "SchibstedGrotesk_400Regular", // body & UI
  sansBold: "SchibstedGrotesk_600SemiBold",
  mono: "SpaceMono_400Regular", // scores, counts, stamps
  monoBold: "SpaceMono_700Bold",
};
