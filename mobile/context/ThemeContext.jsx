/* eslint-env browser */
// ^ document is only touched behind the Platform.OS === "web" guard below.
import { createContext, useContext, useEffect } from "react";
import { Platform } from "react-native";
import { theme } from "../theme/themes";

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  // Mobile browsers with "force dark" / auto dark-theme (Android Chrome's
  // "Auto Dark Theme", Samsung Internet, etc.) repaint a page's colors with
  // their own heuristic unless the page opts out. The documented opt-out is a
  // single-value `color-scheme` on both the CSS property and the meta tag.
  useEffect(() => {
    if (Platform.OS !== "web" || typeof document === "undefined") return;
    document.documentElement.style.colorScheme = "dark";
    document.documentElement.style.backgroundColor = theme.color.bg;
    if (document.body) document.body.style.colorScheme = "dark";

    const setMeta = (name, content) => {
      let meta = document.querySelector(`meta[name="${name}"]`);
      if (!meta) {
        meta = document.createElement("meta");
        meta.setAttribute("name", name);
        document.head.appendChild(meta);
      }
      meta.setAttribute("content", content);
    };
    setMeta("color-scheme", "dark");
    setMeta("theme-color", theme.color.bg);
  }, []);

  return (
    <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>
  );
}

// Full theme palette (color, category, type, risk, font, radius, layout).
export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within a ThemeProvider");
  return ctx;
}
