import { Pressable, StyleSheet, Text, useWindowDimensions, View } from "react-native";
import GradientBlob from "../ui/GradientBlob";
import PillButton from "../ui/PillButton";
import { color, font, gradients, layout, radius } from "../../theme/darkTokens";

function NavLink({ label, onPress }) {
  return (
    <Pressable
      accessibilityRole="link"
      onPress={onPress}
      style={({ pressed }) => pressed && styles.linkPressed}
    >
      <Text style={styles.link}>{label}</Text>
    </Pressable>
  );
}

export default function LandingNav({ onNavigate, onTry }) {
  const { width } = useWindowDimensions();
  const isWide = width >= layout.breakpoint;

  return (
    <View style={styles.bar}>
      <View style={styles.inner}>
        <View style={styles.logoRow}>
          <GradientBlob
            colors={gradients.brand}
            radius={radius.sm}
            style={styles.logoMark}
          />
          <Text style={styles.logo}>Kratt</Text>
        </View>

        {isWide ? (
          <View style={styles.links}>
            <NavLink label="How it works" onPress={() => onNavigate("how")} />
            <NavLink
              label="Evidence categories"
              onPress={() => onNavigate("research")}
            />
            <NavLink label="About" onPress={() => onNavigate("about")} />
          </View>
        ) : null}

        <PillButton size="sm" label="Try it now" onPress={onTry} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    backgroundColor: "rgba(8,8,11,0.88)",
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
  linkPressed: {
    opacity: 0.6,
  },
});
