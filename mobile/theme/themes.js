// Dark + light theme definitions for the whole product. A single toggle in
// ThemeContext swaps between these, and every screen reads its palette via
// useTheme(), so changing mode restyles landing, home, analyzing, analysis,
// and error together.
import { font as appFont } from "./tokens";

// Font families, radii, spacing scale, and the holographic gradients are the
// same in both themes — only colors (and the type styles that bake in a text
// color) flip.
const font = {
  display: appFont.slab,
  displayMedium: appFont.slabMedium,
  sans: appFont.sans,
  sansBold: appFont.sansBold,
  mono: appFont.mono,
  monoBold: appFont.monoBold,
};

const radius = { sm: 10, md: 16, lg: 24, pill: 999 };

const layout = { maxWidth: 1080, breakpoint: 768 };

// One trio per evidence category, plus a mixed "brand" trio. These read well
// on both light and dark surfaces, so they don't change with the theme.
const gradients = {
  brand: ["#7C5CFF", "#2FE6C8", "#FF3EA5"],
  ads_spam: ["#FF5C5C", "#FF9A3C", "#2B0B12"],
  copy_paste: ["#7C5CFF", "#2F8CFF", "#0B0B1E"],
  low_effort: ["#FFB020", "#FF3EA5", "#1A0B2E"],
  genuine: ["#2FE6C8", "#37D67A", "#062018"],
};

// Accent hues shared across themes (badge dots, focus rings, links).
export const accent = {
  teal: "#2FE6C8",
  violet: "#7C5CFF",
  pink: "#FF3EA5",
};

function buildType(color) {
  return {
    display: {
      fontFamily: font.display,
      fontSize: 36,
      lineHeight: 42,
      color: color.ink,
    },
    h2: {
      fontFamily: font.display,
      fontSize: 26,
      lineHeight: 32,
      color: color.ink,
    },
    h3: {
      fontFamily: font.displayMedium,
      fontSize: 19,
      lineHeight: 25,
      color: color.ink,
    },
    bodyLarge: {
      fontFamily: font.sans,
      fontSize: 17,
      lineHeight: 26,
      color: color.inkMuted,
    },
    body: {
      fontFamily: font.sans,
      fontSize: 15,
      lineHeight: 23,
      color: color.inkMuted,
    },
    small: {
      fontFamily: font.sans,
      fontSize: 13,
      lineHeight: 19,
      color: color.inkFaint,
    },
    monoLabel: {
      fontFamily: font.monoBold,
      fontSize: 11,
      lineHeight: 16,
      letterSpacing: 1.4,
      color: color.inkFaint,
    },
  };
}

const darkColor = {
  bg: "#08080B",
  bgElevated: "#101014",
  surface: "#151519",
  surfaceAlt: "#1B1B21",
  border: "rgba(255,255,255,0.10)",
  borderStrong: "rgba(255,255,255,0.18)",
  navBar: "rgba(8,8,11,0.88)",

  ink: "#F5F5F7",
  inkMuted: "rgba(245,245,247,0.64)",
  inkFaint: "rgba(245,245,247,0.40)",

  // Text placed on an ink-colored fill (e.g. the primary pill button). ink is
  // light in dark mode, so its on-color is near-black.
  onLight: "#0A0A0C",

  // Particle color for the constellation background.
  particle: "rgba(245,245,247,0.55)",
};

const lightColor = {
  // Forced pure white/black — no off-white or grey tints, so mobile browsers
  // that repaint "greyish" light colors as dark have nothing to grab onto.
  bg: "#FFFFFF",
  bgElevated: "#FFFFFF",
  surface: "#FFFFFF",
  surfaceAlt: "#F5F5F5",
  border: "rgba(0,0,0,0.14)",
  borderStrong: "rgba(0,0,0,0.24)",
  navBar: "rgba(255,255,255,0.92)",

  ink: "#000000",
  inkMuted: "rgba(0,0,0,0.66)",
  inkFaint: "rgba(0,0,0,0.45)",

  // ink is black in light mode, so its on-color is pure white.
  onLight: "#FFFFFF",

  particle: "rgba(0,0,0,0.45)",
};

// Severity colors for risk tiers/levels (score gauge, category result cards),
// tuned per theme for contrast against the surface behind them.
const darkRisk = {
  low: { main: "#2FE6C8", text: "#2FE6C8", tint: "rgba(47,230,200,0.14)" },
  medium: { main: "#FFB020", text: "#FFB020", tint: "rgba(255,176,32,0.14)" },
  high: { main: "#FF5C5C", text: "#FF5C5C", tint: "rgba(255,92,92,0.14)" },
  neutral: {
    main: darkColor.inkMuted,
    text: darkColor.inkMuted,
    tint: "rgba(245,245,247,0.08)",
  },
};

const lightRisk = {
  // text shades sit at ≥4.5:1 on white (WCAG AA for small text).
  low: { main: "#12B39B", text: "#0B7261", tint: "rgba(18,179,155,0.14)" },
  medium: { main: "#C77F0A", text: "#9A6206", tint: "rgba(199,127,10,0.14)" },
  high: { main: "#E23D3D", text: "#C42B2B", tint: "rgba(226,61,61,0.12)" },
  neutral: {
    main: lightColor.inkMuted,
    text: lightColor.inkMuted,
    tint: "rgba(20,20,26,0.06)",
  },
};

export const darkTheme = {
  mode: "dark",
  color: darkColor,
  risk: darkRisk,
  type: buildType(darkColor),
  font,
  radius,
  layout,
  gradients,
};

export const lightTheme = {
  mode: "light",
  color: lightColor,
  risk: lightRisk,
  type: buildType(lightColor),
  font,
  radius,
  layout,
  gradients,
};

export const themes = { dark: darkTheme, light: lightTheme };
