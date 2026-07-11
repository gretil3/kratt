import { useMemo } from "react";
import { Pressable, StyleSheet, Text, useWindowDimensions, View } from "react-native";
import { useTheme } from "../../context/ThemeContext";
import GradientBlob from "../ui/GradientBlob";
import PillButton from "../ui/PillButton";
import ThemeToggle from "../ui/ThemeToggle";

function NavLink({ label, onPress, style }) {
  return (
    <Pressable
      accessibilityRole="link"
      onPress={onPress}
      style={({ pressed }) => pressed && { opacity: 0.6 }}
    >
      <Text style={style}>{label}</Text>
    </Pressable>
  );
}

export default function LandingNav({ onNavigate, onTry }) {
  const theme = useTheme();
  const styles = useMemo(() => makeStyles(theme), [theme]);
  const { width } = useWindowDimensions();
  const isWide = width >= theme.layout.breakpoint;

  return (
    <View style={styles.bar}>
      <View style={styles.inner}>
        <View style={styles.logoRow}>
          <GradientBlob
            colors={theme.gradients.brand}
            radius={theme.radius.sm}
            style={styles.logoMark}
          />
          <Text style={styles.logo}>Kratt</Text>
        </View>

        {isWide ? (
          <View style={styles.links}>
            <NavLink
              label="How it works"
              onPress={() => onNavigate("how")}
              style={styles.link}
            />
            <NavLink
              label="Evidence categories"
              onPress={() => onNavigate("research")}
              style={styles.link}
            />
            <NavLink
              label="About"
              onPress={() => onNavigate("about")}
              style={styles.link}
            />
          </View>
        ) : null}

        <View style={styles.actions}>
          <ThemeToggle />
          <PillButton size="sm" label="Try it now" onPress={onTry} />
        </View>
      </View>
    </View>
  );
}

function makeStyles(theme) {
  const { color, font, layout } = theme;
  return StyleSheet.create({
    bar: {
      backgroundColor: color.navBar,
      borderBottomWidth: 1,
      borderBottomColor: color.border,
      zIndex: 10,
    },
    inner: {
      width: "100%",
      maxWidth: layout.maxWidth,
      alignSelf: "center",
      paddingHorizontal: 24,
      height: 64,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 16,
    },
    logoRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
    },
    logoMark: {
      width: 26,
      height: 26,
    },
    logo: {
      fontFamily: font.display,
      fontSize: 21,
      color: color.ink,
    },
    links: {
      flexDirection: "row",
      gap: 28,
    },
    link: {
      fontFamily: font.sans,
      fontSize: 14,
      color: color.inkMuted,
    },
    actions: {
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
    },
  });
}
