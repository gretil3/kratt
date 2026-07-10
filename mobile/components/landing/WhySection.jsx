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
    title: "Hard to spot by eye",
    body: "Bot-written comments increasingly mimic the way ordinary people write.",
  },
  {
    title: "They shape public opinion",
    body: "Top comments are often read as the voice of the majority.",
  },
  {
    title: "A skill you can train",
    body: "Recognizing suspicious patterns is part of media literacy.",
  },
];

export default function WhySection() {
  const { width } = useWindowDimensions();
  const isWide = width >= layout.breakpoint;

  return (
    <SectionShell style={styles.section}>
      <Text style={type.monoLabel}>WHY IT MATTERS</Text>
      <Text style={[type.h2, styles.heading]}>Why this matters</Text>

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
