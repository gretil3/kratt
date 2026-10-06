// Source-evaluation checklist on the result screen: turns "don't just trust
// the score" into four concrete actions. Checkbox state is local only — it's
// there to make the habit feel like doing, not reading; nothing persists.
import { useMemo, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useTheme } from "../../context/ThemeContext";

const ITEMS = [
  {
    key: "channel",
    label: "Check the channel's age and history",
    detail: "A fresh channel pushing a strong claim deserves extra caution.",
  },
  {
    key: "sponsor",
    label: "Look for sponsor or affiliate signs",
    detail: "Ask who benefits if you believe this video.",
  },
  {
    key: "other_videos",
    label: "Skim other videos on the same channel",
    detail: "A channel that only pushes one narrative is a pattern in itself.",
  },
  {
    key: "second_source",
    label: "Find one independent source for the claim",
    detail: "If it's true and important, someone unrelated is also saying it.",
  },
];

export default function SourceChecklist({ style }) {
  const theme = useTheme();
  const styles = useMemo(() => makeStyles(theme), [theme]);
  const [checked, setChecked] = useState({});

  const toggle = (key) =>
    setChecked((current) => ({ ...current, [key]: !current[key] }));

  const checkedCount = ITEMS.filter((item) => checked[item.key]).length;

  return (
    <View style={style}>
      <View style={styles.headRow}>
        <Text style={theme.type.monoLabel}>BEFORE YOU TRUST THIS VIDEO</Text>
        <Text style={styles.count}>{checkedCount}/4</Text>
      </View>
      <View style={styles.list}>
        {ITEMS.map((item, index) => {
          const isChecked = Boolean(checked[item.key]);
          return (
            <Pressable
              key={item.key}
              accessibilityRole="checkbox"
              accessibilityState={{ checked: isChecked }}
              aria-checked={isChecked}
              accessibilityLabel={item.label}
              onPress={() => toggle(item.key)}
              style={({ hovered }) => [
                styles.row,
                hovered && styles.rowHovered,
                index === ITEMS.length - 1 && styles.rowLast,
              ]}
            >
              <View style={[styles.box, isChecked && styles.boxChecked]}>
                {isChecked ? <Text style={styles.check}>✓</Text> : null}
              </View>
              <View style={styles.rowText}>
                <Text style={[styles.label, isChecked && styles.labelChecked]}>
                  {item.label}
                </Text>
                <Text style={styles.detail}>{item.detail}</Text>
              </View>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

function makeStyles(theme) {
  const { color, font, radius } = theme;
  return StyleSheet.create({
    headRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "baseline",
      gap: 12,
      marginBottom: 14,
    },
    count: {
      fontFamily: font.mono,
      fontSize: 12,
      color: color.inkFaint,
    },
    list: {
      backgroundColor: color.surface,
      borderWidth: 1,
      borderColor: color.border,
      borderRadius: radius.lg,
      overflow: "hidden",
    },
    row: {
      flexDirection: "row",
      alignItems: "flex-start",
      gap: 14,
      paddingVertical: 16,
      paddingHorizontal: 18,
      borderBottomWidth: 1,
      borderBottomColor: "rgba(241,234,219,0.08)",
    },
    rowHovered: {
      backgroundColor: "rgba(241,234,219,0.03)",
    },
    rowLast: {
      borderBottomWidth: 0,
    },
    box: {
      width: 22,
      height: 22,
      marginTop: 1,
      borderRadius: 6,
      borderWidth: 1.5,
      borderColor: "rgba(241,234,219,0.28)",
      alignItems: "center",
      justifyContent: "center",
    },
    boxChecked: {
      backgroundColor: color.accent,
      borderColor: color.accent,
    },
    check: {
      color: color.onAccent,
      fontSize: 14,
      lineHeight: 16,
      fontFamily: font.sansBold,
    },
    rowText: {
      flex: 1,
      gap: 3,
    },
    label: {
      fontFamily: font.sansBold,
      fontSize: 15.5,
      lineHeight: 21,
      color: color.ink,
    },
    labelChecked: {
      color: "rgba(241,234,219,0.55)",
    },
    detail: {
      fontFamily: font.sans,
      fontSize: 13.5,
      lineHeight: 19.5,
      color: "rgba(241,234,219,0.55)",
    },
  });
}
