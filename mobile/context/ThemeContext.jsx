import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { Platform } from "react-native";
import { themes, darkTheme } from "../theme/themes";

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  // Always starts dark — no persisted override, so every fresh load (and
  // every device) opens the same way regardless of what was picked before.
  const [mode, setMode] = useState("dark");

  // Mobile browsers with "force dark" / auto dark-theme (Android Chrome's
  // "Auto Dark Theme" setting, Samsung Internet, etc.) will repaint a page's
  // colors using their own heuristic whenever the OS is in dark mode, unless
  // the page explicitly opts out. The documented way to opt out is a
  // single-value `color-scheme` (not "light dark", which still leaves the
  // browser free to darken it) on both the CSS property and the meta tag.
  useEffect(() => {
    if (Platform.OS !== "web" || typeof document === "undefined") return;
    document.documentElement.style.colorScheme = mode;
    if (document.body) document.body.style.colorScheme = mode;

    let meta = document.querySelector('meta[name="color-scheme"]');
    if (!meta) {
      meta = document.createElement("meta");
      meta.setAttribute("name", "color-scheme");
      document.head.appendChild(meta);
    }
    meta.setAttribute("content", mode);

    const themeColor = themes[mode]?.color.bg ?? themes.dark.color.bg;
    let themeMeta = document.querySelector('meta[name="theme-color"]');
    if (!themeMeta) {
      themeMeta = document.createElement("meta");
      themeMeta.setAttribute("name", "theme-color");
      document.head.appendChild(themeMeta);
    }
    themeMeta.setAttribute("content", themeColor);
  }, [mode]);

  const value = useMemo(() => {
    const theme = themes[mode] ?? darkTheme;
    return {
      mode,
      theme,
      toggleMode: () => setMode((m) => (m === "dark" ? "light" : "dark")),
      setMode,
    };
  }, [mode]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

// Full theme palette (color, type, risk, font, radius, layout, gradients).
export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within a ThemeProvider");
  return ctx.theme;
}

// Mode + controls, for the toggle and status bar.
export function useThemeMode() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useThemeMode must be used within a ThemeProvider");
  return ctx;
}
