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

  return (
    <View style={style}>
      <Text style={[theme.type.monoLabel, styles.sectionLabel]}>
        BEFORE YOU TRUST THIS VIDEO
      </Text>
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
              style={[styles.row, index === ITEMS.length - 1 && styles.rowLast]}
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
  const { color, font, radius, type } = theme;
  return StyleSheet.create({
    sectionLabel: {
      marginBottom: 12,
    },
    list: {
      backgroundColor: color.surface,
      borderWidth: 1,
      borderColor: color.border,
      borderRadius: radius.md,
    },
    row: {
      flexDirection: "row",
      alignItems: "flex-start",
      gap: 12,
      padding: 14,
      borderBottomWidth: 1,
      borderBottomColor: color.border,
    },
    rowLast: {
      borderBottomWidth: 0,
    },
    box: {
      width: 20,
      height: 20,
      marginTop: 2,
      borderRadius: radius.sm / 2,
      borderWidth: 1.5,
      borderColor: color.borderStrong,
      alignItems: "center",
      justifyContent: "center",
    },
    boxChecked: {
      backgroundColor: color.ink,
      borderColor: color.ink,
    },
    check: {
      color: color.onLight,
      fontSize: 13,
      lineHeight: 15,
      fontFamily: font.sansBold,
    },
    rowText: {
      flex: 1,
      gap: 2,
    },
    label: {
      ...type.body,
      color: color.ink,
      fontFamily: font.sansBold,
    },
    labelChecked: {
      color: color.inkMuted,
    },
    detail: {
      ...type.small,
    },
  });
}
