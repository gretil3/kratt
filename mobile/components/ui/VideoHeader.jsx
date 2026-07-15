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
  const { color, font, radius, type } = theme;
  return StyleSheet.create({
    row: {
      flexDirection: "row",
      alignItems: "center",
      gap: 14,
    },
    thumbnail: {
      width: 112,
      height: 63, // 16:9
      borderRadius: radius.sm,
      backgroundColor: color.surfaceAlt,
    },
    textCol: {
      flex: 1,
      gap: 3,
    },
    title: {
      ...type.h3,
    },
    channel: {
      ...type.small,
    },
    url: {
      fontFamily: font.mono,
      fontSize: 14,
      lineHeight: 20,
      color: color.ink,
    },
  });
}
