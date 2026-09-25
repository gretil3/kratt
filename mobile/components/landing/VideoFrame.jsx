// Browser-chrome-style frame around the Kratt demo clip. Bundled locally
// and autoplays muted on loop (muted is what lets browsers autoplay).
import { useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";
import { ResizeMode, Video } from "expo-av";
import { useTheme } from "../../context/ThemeContext";

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
        <Video
          source={require("../../assets/kratt-demo.mp4")}
          style={StyleSheet.absoluteFill}
          // web <video> otherwise renders at intrinsic 1920x1080 and crops
          videoStyle={{ width: "100%", height: "100%" }}
          resizeMode={ResizeMode.COVER}
          shouldPlay
          isLooping
          isMuted
        />
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
  });
}
