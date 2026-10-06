// One evidence category on the result screen: stamp, share of comments, a
// proportional bar, and what the category means.
import { StyleSheet, Text, View } from "react-native";
import { useTheme } from "../../context/ThemeContext";
import Stamp from "./Stamp";

export default function CategoryCard({
  stamp,
  label,
  description,
  percent,
  color,
  neutral = false,
  style,
}) {
  const theme = useTheme();
  const { font, type } = theme;
  const share = Math.max(0, Math.min(100, percent));

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: theme.color.surface,
          borderColor: theme.color.border,
        },
        style,
      ]}
    >
      <View style={styles.headRow}>
        <Stamp label={stamp} color={color} />
        <Text
          style={[
            styles.percent,
            { fontFamily: font.monoBold, color: theme.color.ink },
          ]}
        >
          {percent}%
        </Text>
      </View>
      <Text style={[type.h3, styles.label]}>{label}</Text>
      <Text
        style={[
          styles.description,
          { fontFamily: font.sans, color: "rgba(241,234,219,0.62)" },
        ]}
      >
        {description}
      </Text>
      <View style={[styles.track, { backgroundColor: theme.color.well }]}>
        <View
          style={[styles.fill, { width: `${share}%`, backgroundColor: color }]}
        />
      </View>
      {neutral ? (
        <Text style={[type.small, styles.note, { fontSize: 12.5 }]}>
          Not a bot signal
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderRadius: 14,
    padding: 20,
  },
  headRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 12,
    marginBottom: 22,
  },
  percent: {
    fontSize: 28,
    lineHeight: 30,
  },
  label: {
    marginBottom: 5,
  },
  description: {
    fontSize: 14,
    lineHeight: 21,
    marginBottom: 16,
  },
  track: {
    height: 5,
    borderRadius: 3,
    overflow: "hidden",
  },
  fill: {
    height: 5,
    borderRadius: 3,
  },
  note: {
    marginTop: 10,
  },
});
