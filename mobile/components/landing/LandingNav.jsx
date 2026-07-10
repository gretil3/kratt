import {
  Pressable,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import AppButton from "../ui/AppButton";
import { color, font, hairline, layout } from "../../theme/tokens";

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
          <View style={styles.logoMark} />
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

        <AppButton size="sm" label="Try it now" onPress={onTry} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    backgroundColor: color.bg,
    borderBottomWidth: hairline,
    borderBottomColor: color.hairline,
    zIndex: 10,
  },
  inner: {
    width: "100%",
    maxWidth: layout.maxWidth,
    alignSelf: "center",
    paddingHorizontal: 24,
    height: 60,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 16,
  },
  logoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  // A single straw square: the smallest possible "assembled part".
  logoMark: {
    width: 8,
    height: 8,
    backgroundColor: color.straw,
  },
  logo: {
    fontFamily: font.slab,
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
    color: color.ink,
  },
  linkPressed: {
    opacity: 0.6,
  },
});
