import { StyleSheet, View } from "react-native";
import { layout } from "../../theme/darkTokens";

// Centers section content to the landing max-width with the shared gutter.
export default function SectionShell({ children, style, innerStyle }) {
  return (
    <View style={[styles.outer, style]}>
      <View style={[styles.inner, innerStyle]}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  outer: {
    paddingHorizontal: 24,
  },
  inner: {
    width: "100%",
    maxWidth: layout.maxWidth,
    alignSelf: "center",
  },
});
