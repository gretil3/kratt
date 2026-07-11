import { useRef } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import ConstellationBackground from "./ConstellationBackground";
import LandingNav from "./LandingNav";
import HeroSection from "./HeroSection";
import WhySection from "./WhySection";
import ResearchSection from "./ResearchSection";
import HowSection from "./HowSection";
import ClosingSection from "./ClosingSection";
import { color } from "../../theme/darkTokens";

// Room the sticky nav (64) plus breathing space takes above an anchored section.
const ANCHOR_OFFSET = 80;

export default function LandingScreen() {
  const router = useRouter();
  const scrollRef = useRef(null);
  const sectionOffsets = useRef({});

  const goToAnalyzer = () => router.push("/home");

  const registerSection = (key) => (event) => {
    sectionOffsets.current[key] = event.nativeEvent.layout.y;
  };

  const scrollToSection = (key) => {
    const y = sectionOffsets.current[key];
    if (y != null && scrollRef.current) {
      scrollRef.current.scrollTo({
        y: Math.max(y - ANCHOR_OFFSET, 0),
        animated: true,
      });
    }
  };

  return (
    <View style={styles.root}>
      <StatusBar style="light" />
      <ConstellationBackground />
      <ScrollView
        ref={scrollRef}
        stickyHeaderIndices={[0]}
        contentContainerStyle={styles.content}
      >
        <LandingNav onNavigate={scrollToSection} onTry={goToAnalyzer} />

        <HeroSection
          onAnalyze={goToAnalyzer}
          onSeeHow={() => scrollToSection("how")}
        />

        <View onLayout={registerSection("why")}>
          <WhySection />
        </View>
        <View onLayout={registerSection("research")}>
          <ResearchSection />
        </View>
        <View onLayout={registerSection("how")}>
          <HowSection />
        </View>
        <View onLayout={registerSection("about")}>
          <ClosingSection onTry={goToAnalyzer} />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: color.bg,
  },
  content: {
    paddingBottom: 24,
  },
});
