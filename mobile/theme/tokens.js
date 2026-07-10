// Kratt design tokens — single source of truth for landing page AND app screens.
// Direction: "assembled parts / evidence board" (a kratt is built from straw and
// old tools). Flat surfaces, hairline borders, no shadows or gradients.
import { StyleSheet } from "react-native";

export const color = {
  bg: "#EEF0EA", // cool off-white with a faint sage tint
  surface: "#F7F8F3", // paper cards pinned to the board
  ink: "#1C1B18", // warm charcoal, not pure black
  inkMuted: "#5B5A51",
  hairline: "#D9DBCF",

  // Primary accent — buttons, links, active states, low-risk signals.
  moss: "#2F4B3C",
  mossTint: "rgba(47, 75, 60, 0.10)",
  onMoss: "#F4F6EF",

  // Secondary accent, used sparingly — highlights, medium-risk signals.
  // Raw straw fails AA as small text on bg; use strawInk for text-sized uses.
  straw: "#C98A3B",
  strawInk: "#8A5A1F",
  strawTint: "rgba(201, 138, 59, 0.14)",

  // Reserved strictly for high-risk/danger states. Never a general accent.
  rust: "#B4432E",
  rustInk: "#9E3A26",
  rustTint: "rgba(180, 67, 46, 0.12)",

  neutralTint: "rgba(28, 27, 24, 0.06)",
};

// Risk-tier color sets share one shape so gauge/chips can be driven by level key.
export const risk = {
  low: { main: color.moss, text: color.moss, tint: color.mossTint },
  medium: { main: color.straw, text: color.strawInk, tint: color.strawTint },
  high: { main: color.rust, text: color.rustInk, tint: color.rustTint },
  neutral: { main: color.inkMuted, text: color.inkMuted, tint: color.neutralTint },
};

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

export const type = {
  display: { fontFamily: font.slab, fontSize: 34, lineHeight: 40, color: color.ink },
  h2: { fontFamily: font.slab, fontSize: 25, lineHeight: 31, color: color.ink },
  h3: { fontFamily: font.slabMedium, fontSize: 19, lineHeight: 25, color: color.ink },
  bodyLarge: { fontFamily: font.sans, fontSize: 17, lineHeight: 26, color: color.ink },
  body: { fontFamily: font.sans, fontSize: 15, lineHeight: 23, color: color.ink },
  bodyBold: { fontFamily: font.sansBold, fontSize: 15, lineHeight: 23, color: color.ink },
  small: { fontFamily: font.sans, fontSize: 13, lineHeight: 19, color: color.inkMuted },
  mono: { fontFamily: font.mono, fontSize: 13, lineHeight: 19, color: color.ink },
  // Kickers and stamps: uppercase + tracking carry the "evidence tag" look.
  monoLabel: {
    fontFamily: font.monoBold,
    fontSize: 11,
    lineHeight: 16,
    letterSpacing: 1.2,
    color: color.inkMuted,
  },
};

export const space = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  x2: 32,
  x3: 48,
  x4: 64,
};

// Small radii keep surfaces reading as pinned paper, not glossy cards.
export const radius = {
  sm: 3,
  md: 6,
  pill: 999,
};

export const hairline = StyleSheet.hairlineWidth;

export const layout = {
  maxWidth: 1040,
  breakpoint: 768,
};
