// Dark, holographic "studio" design tokens, used across the whole product
// flow — landing, home, analyzing, analysis results, and error.
import { font as appFont } from "./tokens";

export const color = {
  bg: "#08080B",
  bgElevated: "#101014",
  surface: "#151519",
  surfaceAlt: "#1B1B21",
  border: "rgba(255,255,255,0.10)",
  borderStrong: "rgba(255,255,255,0.18)",

  ink: "#F5F5F7",
  inkMuted: "rgba(245,245,247,0.64)",
  inkFaint: "rgba(245,245,247,0.40)",

  onLight: "#0A0A0C",
};

// Three-stop gradients used to paint holographic blobs (GradientBlob) —
// one per evidence category, plus a mixed "brand" trio for the logo/CTA.
export const gradients = {
  brand: ["#7C5CFF", "#2FE6C8", "#FF3EA5"],
  ads_spam: ["#FF5C5C", "#FF9A3C", "#2B0B12"],
  copy_paste: ["#7C5CFF", "#2F8CFF", "#0B0B1E"],
  low_effort: ["#FFB020", "#FF3EA5", "#1A0B2E"],
  genuine: ["#2FE6C8", "#37D67A", "#062018"],
};

export const font = {
  display: appFont.slab,
  displayMedium: appFont.slabMedium,
  sans: appFont.sans,
  sansBold: appFont.sansBold,
  mono: appFont.mono,
  monoBold: appFont.monoBold,
};

export const type = {
  display: { fontFamily: font.display, fontSize: 36, lineHeight: 42, color: color.ink },
  h2: { fontFamily: font.display, fontSize: 26, lineHeight: 32, color: color.ink },
  h3: { fontFamily: font.displayMedium, fontSize: 19, lineHeight: 25, color: color.ink },
  bodyLarge: { fontFamily: font.sans, fontSize: 17, lineHeight: 26, color: color.inkMuted },
  body: { fontFamily: font.sans, fontSize: 15, lineHeight: 23, color: color.inkMuted },
  small: { fontFamily: font.sans, fontSize: 13, lineHeight: 19, color: color.inkFaint },
  monoLabel: {
    fontFamily: font.monoBold,
    fontSize: 11,
    lineHeight: 16,
    letterSpacing: 1.4,
    color: color.inkFaint,
  },
};

export const radius = { sm: 10, md: 16, lg: 24, pill: 999 };

export const layout = { maxWidth: 1080, breakpoint: 768 };

// Severity colors for risk tiers/levels (score gauge, category result cards),
// tuned for contrast against the dark surface.
export const risk = {
  low: { main: "#2FE6C8", text: "#2FE6C8", tint: "rgba(47,230,200,0.14)" },
  medium: { main: "#FFB020", text: "#FFB020", tint: "rgba(255,176,32,0.14)" },
  high: { main: "#FF5C5C", text: "#FF5C5C", tint: "rgba(255,92,92,0.14)" },
  neutral: { main: color.inkMuted, text: color.inkMuted, tint: "rgba(245,245,247,0.08)" },
};
