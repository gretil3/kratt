// Pill-shaped CTA button used across the app's dark theme.
import { Pressable, StyleSheet, Text } from "react-native";
import { color, font, radius } from "../../theme/darkTokens";

export default function PillButton({
  label,
  onPress,
  variant = "primary",
  size = "md",
  style,
}) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [
        styles.base,
        variant === "primary" ? styles.primary : styles.secondary,
        size === "sm" && styles.sm,
        pressed && styles.pressed,
        style,
      ]}
    >
      <Text
        style={[
          styles.label,
          size === "sm" && styles.labelSm,
          variant === "primary" ? styles.labelPrimary : styles.labelSecondary,
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: radius.pill,
    paddingVertical: 14,
    paddingHorizontal: 26,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
  },
  primary: {
    backgroundColor: color.ink,
    borderColor: color.ink,
  },
  secondary: {
    backgroundColor: "transparent",
    borderColor: color.border,
  },
  sm: {
    paddingVertical: 9,
    paddingHorizontal: 18,
  },
  pressed: {
    opacity: 0.8,
  },
  label: {
    fontFamily: font.sansBold,
    fontSize: 15,
    letterSpacing: 0.2,
  },
  labelSm: {
    fontSize: 13,
  },
  labelPrimary: {
    color: color.onLight,
  },
  labelSecondary: {
    color: color.ink,
  },
});
