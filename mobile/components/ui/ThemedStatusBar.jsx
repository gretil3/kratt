// StatusBar whose text color follows the active theme: light glyphs on the
// dark theme, dark glyphs on the light theme.
import { StatusBar } from "expo-status-bar";
import { useThemeMode } from "../../context/ThemeContext";

export default function ThemedStatusBar() {
  const { mode } = useThemeMode();
  return <StatusBar style={mode === "dark" ? "light" : "dark"} />;
}
