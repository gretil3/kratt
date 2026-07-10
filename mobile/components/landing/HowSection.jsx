import { StyleSheet, Text, View } from "react-native";
import SectionShell from "./SectionShell";
import { color, font, type } from "../../theme/tokens";

const STEPS = [
  { title: "Salin link video YouTube" },
  { title: "Tempel di kolom analisis" },
  { title: "Baca skor dan breakdown kategori" },
  {
    title: "Simpulkan sendiri",
    body: "Gunakan skor sebagai titik awal berpikir kritis, bukan vonis akhir.",
  },
];

export default function HowSection() {
  return (
    <SectionShell style={styles.section}>
      <Text style={type.monoLabel}>CARA KERJA</Text>
      <Text style={[type.h2, styles.heading]}>Cara pakai Kratt</Text>

      <View style={styles.steps}>
        {STEPS.map((step, index) => {
          const isLast = index === STEPS.length - 1;
          return (
            <View key={step.title} style={styles.stepRow}>
              <View style={styles.numberColumn}>
                <View style={styles.numberChip}>
                  <Text style={styles.numberText}>{index + 1}</Text>
                </View>
                {!isLast ? <View style={styles.connector} /> : null}
              </View>
              <View style={[styles.stepContent, !isLast && styles.stepGap]}>
                <Text style={styles.stepTitle}>{step.title}</Text>
                {step.body ? (
                  <Text style={styles.stepBody}>{step.body}</Text>
                ) : null}
              </View>
            </View>
          );
        })}
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
  steps: {
    maxWidth: 560,
  },
  stepRow: {
    flexDirection: "row",
    gap: 16,
  },
  numberColumn: {
    alignItems: "center",
  },
  numberChip: {
    width: 34,
    height: 34,
    borderRadius: 4,
    backgroundColor: color.mossTint,
    alignItems: "center",
    justifyContent: "center",
  },
  numberText: {
    fontFamily: font.monoBold,
    fontSize: 14,
    color: color.moss,
  },
  connector: {
    flex: 1,
    width: 1,
    backgroundColor: color.hairline,
    marginVertical: 4,
  },
  stepContent: {
    flex: 1,
    paddingTop: 6,
  },
  stepGap: {
    paddingBottom: 30,
  },
  stepTitle: {
    ...type.h3,
  },
  stepBody: {
    ...type.body,
    color: color.inkMuted,
    marginTop: 6,
  },
});
