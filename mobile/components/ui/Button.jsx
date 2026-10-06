// The product's button: straw-gold primary, outlined secondary. Hover states
// apply on web (react-native-web reports `hovered` to the style callback).
import { Pressable, StyleSheet, Text } from "react-native";
import { useTheme } from "../../context/ThemeContext";

const SIZES = {
  sm: { height: 36, paddingHorizontal: 14, borderRadius: 9, fontSize: 13.5 },
  md: { height: 40, paddingHorizontal: 18, borderRadius: 9, fontSize: 14.5 },
  lg: { height: 54, paddingHorizontal: 26, borderRadius: 11, fontSize: 16.5 },
  xl: { height: 58, paddingHorizontal: 24, borderRadius: 12, fontSize: 17 },
};

export default function Button({
  label,
  onPress,
  variant = "primary",
  size = "lg",
  trailing,
  accessibilityLabel,
  style,
}) {
  const { color, font } = useTheme();
  const { fontSize, ...box } = SIZES[size] ?? SIZES.lg;
  const primary = variant === "primary";

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      onPress={onPress}
      style={({ pressed, hovered }) => [
        styles.base,
        box,
        primary
          ? { backgroundColor: hovered ? color.accentHover : color.accent }
          : {
              borderWidth: 1,
              borderColor:
                size === "lg" ? "rgba(241,234,219,0.20)" : color.borderStrong,
              backgroundColor: hovered
                ? "rgba(241,234,219,0.06)"
                : "transparent",
            },
        pressed && styles.pressed,
        style,
      ]}
    >
      <Text
        style={[
          styles.label,
          {
            fontSize,
            fontFamily: font.sansBold,
            color: primary ? color.onAccent : color.ink,
          },
        ]}
      >
        {label}
        {trailing ? (
          <Text style={{ fontFamily: font.monoBold }}>{`  ${trailing}`}</Text>
        ) : null}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  pressed: {
    opacity: 0.85,
  },
  label: {
    textAlign: "center",
  },
});
