import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useRouter } from "expo-router";
import { useTheme } from "../context/ThemeContext";
import BucketHead from "../components/kratt/BucketHead";
import Button from "../components/ui/Button";
import PasteForm from "../components/ui/PasteForm";
import ThemedStatusBar from "../components/ui/ThemedStatusBar";

export default function HomeScreen() {
  const router = useRouter();
  const { color, font, type } = useTheme();

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ThemedStatusBar />
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.topBar}>
          <Button
            label="← Home"
            variant="secondary"
            size="sm"
            onPress={() => router.push("/")}
          />
        </View>

        <View style={styles.content}>
          <View style={styles.brandRow}>
            <BucketHead width={52} />
            <Text
              style={[
                styles.brand,
                { fontFamily: font.display, color: color.ink },
              ]}
            >
              Kratt
            </Text>
          </View>

          <Text style={[type.display, styles.heading]}>
            Paste a YouTube link
          </Text>
          <Text style={[type.bodyLarge, styles.subheading]}>
            Kratt reads the comment section and flags likely bot activity.
          </Text>

          <PasteForm />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scroll: {
    flexGrow: 1,
    paddingBottom: 72,
  },
  topBar: {
    width: "100%",
    maxWidth: 1200,
    alignSelf: "center",
    height: 72,
    paddingHorizontal: 24,
    flexDirection: "row",
    alignItems: "center",
  },
  content: {
    width: "100%",
    maxWidth: 540,
    alignSelf: "center",
    paddingHorizontal: 24,
    paddingTop: 40,
  },
  brandRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    marginBottom: 34,
  },
  brand: {
    fontSize: 30,
    letterSpacing: -1,
  },
  heading: {
    fontSize: 44,
    lineHeight: 46,
    letterSpacing: -1.8,
    marginBottom: 12,
  },
  subheading: {
    marginBottom: 30,
  },
});
