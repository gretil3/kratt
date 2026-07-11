import { StyleSheet, View } from "react-native";
import { useTheme } from "../../context/ThemeContext";

// Centers section content to the landing max-width with the shared gutter.
export default function SectionShell({ children, style, innerStyle }) {
  const { layout } = useTheme();
  return (
    <View style={[styles.outer, style]}>
      <View style={[styles.inner, { maxWidth: layout.maxWidth }, innerStyle]}>
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  outer: {
    paddingHorizontal: 24,
  },
  inner: {
    width: "100%",
    alignSelf: "center",
  },
});
