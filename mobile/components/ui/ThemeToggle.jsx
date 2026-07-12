// Small pill button that flips the app between dark and light. Reads/writes
// the global ThemeContext, so pressing it anywhere restyles every screen.
import { Pressable, StyleSheet, Text } from "react-native";
import { useThemeMode } from "../../context/ThemeContext";

export default function ThemeToggle({ style }) {
  const { mode, toggleMode, theme } = useThemeMode();
  const { color, radius } = theme;
  const isDark = mode === "dark";

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={
        isDark ? "Switch to light mode" : "Switch to dark mode"
      }
      onPress={toggleMode}
      style={({ pressed }) => [
        styles.base,
        {
          borderColor: color.border,
          backgroundColor: color.surface,
          borderRadius: radius.pill,
        },
        pressed && styles.pressed,
        style,
      ]}
    >
      <Text style={[styles.icon, { color: color.ink }]}>
        {isDark ? "☀" : "☾"}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    width: 36,
    height: 36,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  pressed: {
    opacity: 0.7,
  },
  icon: {
    fontSize: 16,
    lineHeight: 20,
  },
});
