import {
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import SectionShell from "./SectionShell";
import { color, hairline, layout, radius, type } from "../../theme/tokens";

const CARDS = [
  {
    title: "Sulit dikenali kasat mata",
    body: "Komentar buatan bot makin meniru gaya bahasa manusia biasa.",
  },
  {
    title: "Membentuk opini publik",
    body: "Komentar teratas sering dianggap mewakili suara mayoritas.",
  },
  {
    title: "Keterampilan yang bisa dilatih",
    body: "Mengenali pola mencurigakan adalah bagian dari literasi media.",
  },
];

export default function WhySection() {
  const { width } = useWindowDimensions();
  const isWide = width >= layout.breakpoint;

  return (
    <SectionShell style={styles.section}>
      <Text style={type.monoLabel}>KENAPA PENTING</Text>
      <Text style={[type.h2, styles.heading]}>Kenapa ini penting</Text>

      <View style={[styles.cards, isWide && styles.cardsWide]}>
        {CARDS.map((card) => (
          <View key={card.title} style={[styles.card, isWide && styles.cardWide]}>
            <Text style={styles.cardTitle}>{card.title}</Text>
            <Text style={styles.cardBody}>{card.body}</Text>
          </View>
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
    marginBottom: 28,
  },
  cards: {
    gap: 14,
  },
  cardsWide: {
    flexDirection: "row",
    gap: 16,
  },
  card: {
    backgroundColor: color.surface,
    borderWidth: hairline,
    borderColor: color.hairline,
    borderRadius: radius.sm,
    padding: 20,
  },
  cardWide: {
    flex: 1,
  },
  cardTitle: {
    ...type.h3,
    marginBottom: 6,
  },
  cardBody: {
    ...type.body,
    color: color.inkMuted,
  },
});
