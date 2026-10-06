// Sticky top bar: logo, in-page section links (wide screens), and the
// "Try it now" jump to the embedded analyzer.
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useTheme } from "../../context/ThemeContext";
import { webStyle } from "../../theme/webStyle";
import BucketHead from "../kratt/BucketHead";
import Button from "../ui/Button";
import { useLandingLayout } from "./SectionShell";

export const NAV_HEIGHT = 68;

const LINKS = [
  ["legend", "Who is Kratt"],
  ["how", "How it works"],
  ["research", "Evidence categories"],
  ["gap", "Why Kratt"],
  ["about", "About"],
];

export default function LandingNav({ onNavigate }) {
  const { color, font, layout } = useTheme();
  const { gutter, showNavLinks } = useLandingLayout();

  return (
    <View
      style={[
        styles.bar,
        { backgroundColor: color.navBar, borderBottomColor: color.border },
        webStyle({
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
        }),
      ]}
    >
      <View
        style={[
          styles.inner,
          { maxWidth: layout.maxWidth, paddingHorizontal: gutter },
        ]}
      >
        <Pressable
          accessibilityRole="link"
          accessibilityLabel="Kratt, back to top"
          onPress={() => onNavigate("top")}
          style={styles.logoRow}
        >
          <BucketHead width={28} animate={false} />
          <Text
            style={[
              styles.logo,
              { fontFamily: font.display, color: color.ink },
            ]}
          >
            Kratt
          </Text>
        </Pressable>

        {showNavLinks ? (
          <View style={styles.links}>
            {LINKS.map(([key, label]) => (
              <Pressable
                key={key}
                accessibilityRole="link"
                onPress={() => onNavigate(key)}
              >
                {({ hovered }) => (
                  <Text
                    style={[
                      styles.link,
                      {
                        fontFamily: font.sans,
                        color: hovered ? color.ink : color.inkMuted,
                      },
                    ]}
                  >
                    {label}
                  </Text>
                )}
              </Pressable>
            ))}
          </View>
        ) : null}

        <Button
          label="Try it now"
          size="md"
          onPress={() => onNavigate("try")}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    borderBottomWidth: 1,
  },
  inner: {
    width: "100%",
    alignSelf: "center",
    height: NAV_HEIGHT,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 24,
  },
  logoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 11,
  },
  logo: {
    fontSize: 23,
    letterSpacing: -0.7,
  },
  links: {
    flexDirection: "row",
    alignItems: "center",
    gap: 30,
  },
  link: {
    fontSize: 14.5,
  },
});
