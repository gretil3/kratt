import { useRef } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import ThemedStatusBar from "../ui/ThemedStatusBar";
import LandingNav, { NAV_HEIGHT } from "./LandingNav";
import HeroSection from "./HeroSection";
import LegendSection from "./LegendSection";
import WhySection from "./WhySection";
import ResearchSection from "./ResearchSection";
import HowSection from "./HowSection";
import GapSection from "./GapSection";
import { AboutStatement, LandingFooter, TryPanel } from "./ClosingSection";

// Extra room above the analyzer panel, so its gold edge isn't flush against
// the sticky nav.
const TRY_EXTRA_OFFSET = 16;

export default function LandingScreen() {
  const scrollRef = useRef(null);
  const sectionOffsets = useRef({});

  // Each anchor is a direct child of the scroll content, so its layout y is
  // already its offset within the page.
  const registerSection = (key) => (event) => {
    sectionOffsets.current[key] = event.nativeEvent.layout.y;
  };

  const scrollToSection = (key) => {
    if (!scrollRef.current) return;
    if (key === "top") {
      scrollRef.current.scrollTo({ y: 0, animated: true });
      return;
    }
    const y = sectionOffsets.current[key];
    if (y == null) return;
    // The sticky nav overlays the top of the viewport; land just below it.
    const offset = NAV_HEIGHT + (key === "try" ? TRY_EXTRA_OFFSET : 0);
    scrollRef.current.scrollTo({ y: Math.max(y - offset, 0), animated: true });
  };

  return (
    <View style={styles.root}>
      <ThemedStatusBar />
      <ScrollView
        ref={scrollRef}
        stickyHeaderIndices={[0]}
        keyboardShouldPersistTaps="handled"
      >
        <LandingNav onNavigate={scrollToSection} />

        <HeroSection
          onAnalyze={() => scrollToSection("try")}
          onSeeHow={() => scrollToSection("how")}
        />

        <View onLayout={registerSection("legend")}>
          <LegendSection />
        </View>
        <WhySection />
        <View onLayout={registerSection("research")}>
          <ResearchSection />
        </View>
        <View onLayout={registerSection("how")}>
          <HowSection />
        </View>
        <View onLayout={registerSection("gap")}>
          <GapSection />
        </View>
        <View onLayout={registerSection("about")}>
          <AboutStatement />
        </View>
        <View onLayout={registerSection("try")}>
          <TryPanel />
        </View>
        <LandingFooter />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});
