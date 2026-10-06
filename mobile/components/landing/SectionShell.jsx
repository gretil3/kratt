// Layout primitives shared by the landing sections: the centered content
// column, the responsive measurements every section sizes itself from, and the
// eyebrow + headline pair that opens most sections.
import { StyleSheet, Text, useWindowDimensions, View } from "react-native";
import { useTheme } from "../../context/ThemeContext";

// Below this width the nav drops its section links (they no longer fit).
const NAV_LINKS_MIN = 1000;

export function useLandingLayout() {
  const { width } = useWindowDimensions();
  const { layout } = useTheme();
  const isWide = width >= layout.breakpoint;
  const gutter = isWide ? 48 : 20;
  return {
    width,
    isWide,
    showNavLinks: width >= NAV_LINKS_MIN,
    gutter,
    sectionPadding: isWide ? 112 : 72,
    contentWidth: Math.min(width, layout.maxWidth) - gutter * 2,
  };
}

// CSS grid's `repeat(auto-fit, minmax(min, 1fr))`, as a column count.
export function columnsFor(contentWidth, minColumn, gap, max) {
  const fit = Math.floor((contentWidth + gap) / (minColumn + gap));
  return Math.max(1, Math.min(max, fit));
}

export function chunk(items, size) {
  const rows = [];
  for (let i = 0; i < items.length; i += size)
    rows.push(items.slice(i, i + size));
  return rows;
}

// Full-width band with an optional hairline on top; content is centered to
// the landing max-width with the responsive gutter.
export default function SectionShell({
  children,
  divider = true,
  padTop,
  padBottom,
  style,
  innerStyle,
}) {
  const { color, layout } = useTheme();
  const { gutter, sectionPadding } = useLandingLayout();
  return (
    <View
      style={[
        divider && { borderTopWidth: 1, borderTopColor: color.border },
        style,
      ]}
    >
      <View
        style={[
          styles.inner,
          {
            maxWidth: layout.maxWidth,
            paddingHorizontal: gutter,
            paddingTop: padTop ?? sectionPadding,
            paddingBottom: padBottom ?? sectionPadding,
          },
          innerStyle,
        ]}
      >
        {children}
      </View>
    </View>
  );
}

export function Eyebrow({ children, color, style }) {
  const { type } = useTheme();
  return (
    <Text style={[type.monoLabel, styles.eyebrow, color && { color }, style]}>
      {children}
    </Text>
  );
}

export function SectionTitle({ children, style }) {
  const { type } = useTheme();
  const { isWide } = useLandingLayout();
  return (
    <Text
      accessibilityRole="header"
      style={[type.display, !isWide && styles.titleNarrow, style]}
    >
      {children}
    </Text>
  );
}

const styles = StyleSheet.create({
  inner: {
    width: "100%",
    alignSelf: "center",
  },
  eyebrow: {
    marginBottom: 14,
  },
  titleNarrow: {
    fontSize: 38,
    lineHeight: 40,
    letterSpacing: -1.5,
  },
});
