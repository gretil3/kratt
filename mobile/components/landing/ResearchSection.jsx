import {
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import SectionShell from "./SectionShell";
import CategoryCard from "../ui/CategoryCard";
import { CATEGORIES } from "../../lib/categories";
import { color, layout, type } from "../../theme/tokens";

export default function ResearchSection() {
  const { width } = useWindowDimensions();
  const isWide = width >= layout.breakpoint;

  return (
    <SectionShell style={styles.section}>
      <Text style={type.monoLabel}>KATEGORI BUKTI</Text>
      <Text style={[type.h2, styles.heading]}>
        Empat kategori yang dibaca Kratt
      </Text>
      <Text style={styles.paragraph}>
        Empat kategori ini mengambil sinyal yang umum dipakai dalam riset
        deteksi perilaku tidak autentik di platform besar — pola bahasa yang
        berulang, duplikasi lintas akun dan video, serta struktur khas pesan
        promosi. Setiap komentar digolongkan ke satu kategori, dan skor bot
        adalah porsi komentar yang tidak tergolong asli.
      </Text>

      <View style={styles.grid}>
        {CATEGORIES.map((category) => (
          <CategoryCard
            key={category.key}
            stamp={category.stamp}
            label={category.label}
            description={category.description}
            style={[styles.cell, { flexBasis: isWide ? "46%" : "100%" }]}
          />
        ))}
      </View>
    </SectionShell>
  );
}

const styles = StyleSheet.create({
  section: {
    paddingVertical: 56,
  },
  heading: {
    marginTop: 8,
    marginBottom: 14,
  },
  paragraph: {
    ...type.body,
    color: color.inkMuted,
    maxWidth: 680,
    marginBottom: 28,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 16,
  },
  cell: {
    flexGrow: 1,
  },
});
