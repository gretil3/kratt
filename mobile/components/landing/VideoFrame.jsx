// Browser-chrome-style frame around a demo video. Real <iframe> embed on
// web (React Native Web renders plain DOM tags fine via createElement); on
// native, no embeddable player is wired up yet, so it falls back to a
// thumbnail + play button that opens the video in the browser/YouTube app.
import { createElement, useMemo } from "react";
import {
  Image,
  Linking,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useTheme } from "../../context/ThemeContext";

// Placeholder walkthrough clip — swap for the real Kratt demo/trailer later.
const DEMO_VIDEO_ID = "dQw4w9WgXcQ";

export default function VideoFrame({ style }) {
  const theme = useTheme();
  const styles = useMemo(() => makeStyles(theme), [theme]);

  return (
    <View style={[styles.frame, style]}>
      <View style={styles.chrome}>
        <View style={styles.dots}>
          <View style={[styles.dot, { backgroundColor: "#FF5C5C" }]} />
          <View style={[styles.dot, { backgroundColor: "#FFB020" }]} />
          <View style={[styles.dot, { backgroundColor: "#2FE6C8" }]} />
        </View>
        <View style={styles.urlBar}>
          <Text style={styles.urlText} numberOfLines={1}>
            kratt.app
          </Text>
        </View>
      </View>

      <View style={styles.player}>
        {Platform.OS === "web" ? (
          createElement("iframe", {
            src: `https://www.youtube.com/embed/${DEMO_VIDEO_ID}`,
            title: "Kratt walkthrough (placeholder)",
            style: {
              width: "100%",
              height: "100%",
              border: 0,
              display: "block",
            },
            allow:
              "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture",
            allowFullScreen: true,
          })
        ) : (
          <Pressable
            style={styles.nativeFallback}
            onPress={() =>
              Linking.openURL(
                `https://www.youtube.com/watch?v=${DEMO_VIDEO_ID}`
              )
            }
          >
            <Image
              source={{
                uri: `https://img.youtube.com/vi/${DEMO_VIDEO_ID}/hqdefault.jpg`,
              }}
              style={StyleSheet.absoluteFill}
              resizeMode="cover"
            />
            <View style={styles.scrim} />
            <View style={styles.playButton}>
              <Text style={styles.playIcon}>▶</Text>
            </View>
            <Text style={styles.nativeFallbackText}>Watch the walkthrough</Text>
          </Pressable>
        )}
      </View>
    </View>
  );
}

function makeStyles(theme) {
  const { color, font, radius } = theme;
  return StyleSheet.create({
    frame: {
      borderRadius: radius.lg,
      borderWidth: 1,
      borderColor: color.border,
      backgroundColor: color.surface,
      overflow: "hidden",
    },
    chrome: {
      height: 40,
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 14,
      gap: 12,
      borderBottomWidth: 1,
      borderBottomColor: color.border,
      backgroundColor: color.surfaceAlt,
    },
    dots: {
      flexDirection: "row",
      gap: 6,
    },
    dot: {
      width: 8,
      height: 8,
      borderRadius: 4,
    },
    urlBar: {
      flex: 1,
      backgroundColor: color.bg,
      borderRadius: radius.pill,
      paddingHorizontal: 12,
      paddingVertical: 5,
      maxWidth: 180,
    },
    urlText: {
      fontFamily: font.mono,
      fontSize: 11,
      color: color.inkMuted,
    },
    player: {
      width: "100%",
      aspectRatio: 16 / 9,
      backgroundColor: "#000000",
    },
    nativeFallback: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      gap: 12,
    },
    scrim: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: "rgba(0,0,0,0.35)",
    },
    playButton: {
      width: 56,
      height: 56,
      borderRadius: 28,
      backgroundColor: "rgba(255,255,255,0.92)",
      alignItems: "center",
      justifyContent: "center",
    },
    playIcon: {
      fontSize: 20,
      color: "#0A0A0C",
      marginLeft: 3,
    },
    nativeFallbackText: {
      fontFamily: font.sansBold,
      fontSize: 13,
      color: "#FFFFFF",
    },
  });
}
