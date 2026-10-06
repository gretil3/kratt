// The single visual theme for the whole product: a warm, dark "straw and
// tin" palette. Every screen reads it via useTheme(), so this file is the one
// place to retune color and type.
import { font } from "./tokens";

const radius = { xs: 6, sm: 9, md: 12, lg: 14, xl: 18, pill: 999 };

// maxWidth is the landing page's content column; breakpoint is where
// multi-column layouts collapse to one column.
const layout = { maxWidth: 1200, breakpoint: 768 };

const color = {
  bg: "#0D0C0A",
  surface: "#15130F", // cards
  surfaceAlt: "#1B1915", // highlighted card
  well: "#24211C", // tracks, icon tiles, the PASTE button
  wellHover: "#2E2A23",
  border: "rgba(241,234,219,0.10)",
  borderStrong: "rgba(241,234,219,0.18)",
  navBar: "rgba(13,12,10,0.86)",

  ink: "#F1EADB",
  inkMuted: "rgba(241,234,219,0.70)",
  inkFaint: "rgba(241,234,219,0.52)",
  inkGhost: "rgba(241,234,219,0.42)", // placeholders

  accent: "#E9B949", // straw gold: primary actions, links
  accentHover: "#F3D27A",
  accentBorder: "rgba(233,185,73,0.40)",
  ember: "#FF6A3D", // the bucket's eyes; also "bot" emphasis

  // Text placed on an accent or ink fill.
  onAccent: "#14110C",
};

// One color per evidence category (docs/api-contract.md keys).
const category = {
  ads_spam: "#FF6A3D",
  copy_paste: "#8FB0DC",
  low_effort: "#E58FB0",
  genuine: "#93C872",
};

// Severity colors for the overall bot-score tier (lib/riskLevels.js).
const risk = {
  low: { main: "#93C872", text: "#93C872", tint: "rgba(147,200,114,0.14)" },
  medium: { main: "#E9B949", text: "#E9B949", tint: "rgba(233,185,73,0.14)" },
  high: { main: "#FF6A3D", text: "#FF6A3D", tint: "rgba(255,106,61,0.14)" },
  neutral: {
    main: color.inkMuted,
    text: color.inkMuted,
    tint: "rgba(241,234,219,0.08)",
  },
};

// Material swatches for the Kratt illustrations. Each stripe list is
// [color, width] pairs that repeat (see components/kratt/Stripes.jsx).
export const materials = {
  straw: [
    ["#E9B949", 3],
    ["#C8963A", 1],
    ["#F3D27A", 3],
    ["#B07F2C", 1],
    ["#DDAA42", 3],
    ["#9C6E26", 1],
  ],
  // Darker straw for edges that sit on the gold CTA panel.
  strawShadow: [
    ["#C8963A", 3],
    ["#9C6E26", 1],
    ["#DDAA42", 3],
    ["#7F5A1F", 1],
    ["#B88534", 3],
  ],
  // The hero headline's underline.
  strawUnderline: [
    ["#E9B949", 3],
    ["#B07F2C", 1],
    ["#F3D27A", 3],
    ["#9C6E26", 1],
    ["#DDAA42", 3],
  ],
  twine: [
    ["#5B3E22", 4],
    ["#7A5530", 3],
  ],
  twineCoarse: [
    ["#5B3E22", 5],
    ["#8A6036", 4],
  ],
  // Horizontal tin gradient for the bucket: [offset, color].
  tin: [
    [0, "#77736A"],
    [0.3, "#C9C4B8"],
    [0.42, "#E2DDD0"],
    [0.7, "#A9A498"],
    [1, "#6E6A61"],
  ],
  tinHandle: "#A9A498",
  visor: "#16140F",
  wood: "#8A6036",
  woodDark: "#7A5530",
};

function buildType() {
  return {
    display: {
      fontFamily: font.display,
      fontSize: 52,
      lineHeight: 54,
      letterSpacing: -2,
      color: color.ink,
    },
    h2: {
      fontFamily: font.display,
      fontSize: 36,
      lineHeight: 40,
      letterSpacing: -1.3,
      color: color.ink,
    },
    h3: {
      fontFamily: font.displayBold,
      fontSize: 21,
      lineHeight: 26,
      letterSpacing: -0.4,
      color: color.ink,
    },
    bodyLarge: {
      fontFamily: font.sans,
      fontSize: 17,
      lineHeight: 28,
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
      fontSize: 13.5,
      lineHeight: 20,
      color: color.inkFaint,
    },
    monoLabel: {
      fontFamily: font.monoBold,
      fontSize: 11.5,
      lineHeight: 16,
      letterSpacing: 1.6,
      color: color.inkFaint,
    },
  };
}

export const theme = {
  color,
  category,
  risk,
  type: buildType(),
  font,
  radius,
  layout,
};
