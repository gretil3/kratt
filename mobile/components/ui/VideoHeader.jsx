// Result-page header: thumbnail + video title + channel instead of a raw URL.
// The thumbnail renders immediately from the predictable img.youtube.com CDN
// path (no need to wait for oEmbed); the title/channel fill in when the
// lookup lands. Every failure path degrades to the old raw-URL header — this
// is the most important moment in the app and it must never render broken.
import { useEffect, useMemo, useState } from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { useTheme } from "../../context/ThemeContext";
import { fetchOEmbed } from "../../lib/oembed";
import { canonicalUrl, thumbnailUrl } from "../../lib/youtube";

export default function VideoHeader({ videoId, style }) {
  const theme = useTheme();
  const styles = useMemo(() => makeStyles(theme), [theme]);
  const url = canonicalUrl(videoId);
  const [meta, setMeta] = useState(null);
  const [thumbFailed, setThumbFailed] = useState(false);

  useEffect(() => {
    let active = true;
    setMeta(null);
    fetchOEmbed(url).then(
      (data) => {
        if (active) setMeta(data);
      },
      () => {
        // Swallowed on purpose: no title just means the URL stays visible.
      }
    );
    return () => {
      active = false;
    };
  }, [url]);

  return (
    <View style={[styles.row, style]}>
      {!thumbFailed ? (
        <Image
          source={{ uri: thumbnailUrl(videoId) }}
          style={styles.thumbnail}
          resizeMode="cover"
          accessibilityLabel="Video thumbnail"
          onError={() => setThumbFailed(true)}
        />
      ) : null}
      <View style={styles.textCol}>
        {meta ? (
          <>
            <Text style={styles.title} numberOfLines={2}>
              {meta.title}
            </Text>
            <Text style={styles.channel} numberOfLines={1}>
              {meta.authorName}
            </Text>
          </>
        ) : (
          // Loading and failure look the same: the raw URL — exactly what
          // this header showed before oEmbed existed.
          <Text style={styles.url}>{url}</Text>
        )}
      </View>
    </View>
  );
}

function makeStyles(theme) {
  const { color, font } = theme;
  return StyleSheet.create({
    row: {
      flexDirection: "row",
      alignItems: "center",
      gap: 16,
    },
    thumbnail: {
      width: 124,
      height: 70, // 16:9
      borderRadius: 8,
      backgroundColor: color.well,
    },
    textCol: {
      flex: 1,
      gap: 4,
    },
    title: {
      fontFamily: font.displayBold,
      fontSize: 20,
      lineHeight: 24,
      letterSpacing: -0.4,
      color: color.ink,
    },
    channel: {
      fontFamily: font.sans,
      fontSize: 14,
      lineHeight: 19,
      color: "rgba(241,234,219,0.62)",
    },
    url: {
      fontFamily: font.mono,
      fontSize: 14,
      lineHeight: 20,
      color: color.ink,
    },
  });
}
