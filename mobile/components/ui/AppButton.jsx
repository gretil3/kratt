import { Pressable, StyleSheet, Text } from "react-native";
import { color, font, radius } from "../../theme/tokens";

export default function AppButton({
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
    borderRadius: radius.md,
    paddingVertical: 13,
    paddingHorizontal: 24,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
  },
  primary: {
    backgroundColor: color.moss,
    borderColor: color.moss,
  },
  secondary: {
    backgroundColor: "transparent",
    borderColor: color.moss,
  },
  sm: {
    paddingVertical: 7,
    paddingHorizontal: 14,
  },
  pressed: {
    opacity: 0.85,
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
    color: color.onMoss,
  },
  labelSecondary: {
    color: color.moss,
  },
});
