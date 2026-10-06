// "Who is Kratt": the Estonian folklore behind the name, and what this kratt
// is built from (each part maps to a stage of the pipeline).
import { StyleSheet, Text, View } from "react-native";
import { useTheme } from "../../context/ThemeContext";
import { materials } from "../../theme/themes";
import BucketHead from "../kratt/BucketHead";
import Stripes, { bars } from "../kratt/Stripes";
import SectionShell, {
  Eyebrow,
  SectionTitle,
  useLandingLayout,
} from "./SectionShell";

const STORY = [
  "In Estonian folklore, a kratt is a servant its owner builds from hay, sticks and old household objects. Once brought to life, it does whatever job it is given and carries the results home. It has to be kept busy: a kratt left without work turns on its maker.",
  "Estonia's government adopted the kratt as its metaphor for artificial intelligence: useful, tireless, and risky when handled carelessly. Its national AI strategy, adopted in 2019, is known as KrattAI, and the state's virtual assistant is called Bürokratt.",
];

function StrawIcon() {
  return (
    <View style={[styles.icon, styles.clip]}>
      <Stripes stops={materials.straw} />
    </View>
  );
}

function RakeIcon({ tile }) {
  return (
    <View style={[styles.icon, styles.centered, { backgroundColor: tile }]}>
      <View style={styles.rake}>
        <Stripes stops={bars("#B98A4E", 3, 6)} />
      </View>
    </View>
  );
}

function TwineIcon() {
  return (
    <View style={[styles.icon, styles.clip]}>
      <Stripes stops={materials.twineCoarse} angle={45} />
    </View>
  );
}

function BucketIcon({ tile }) {
  return (
    <View style={[styles.icon, styles.centered, { backgroundColor: tile }]}>
      <BucketHead width={32} handle={false} animate={false} />
    </View>
  );
}

export default function LegendSection() {
  const { color, font, type } = useTheme();
  const { isWide } = useLandingLayout();

  const parts = [
    [
      "Straw",
      "Up to 300 comments per video, pulled through the YouTube Data API.",
      <StrawIcon key="i" />,
    ],
    [
      "Rake",
      "Rules that rake out links, spam and promotional patterns.",
      <RakeIcon key="i" tile={color.well} />,
    ],
    [
      "Twine",
      "A near-duplicate check that ties copy-pasted comments together.",
      <TwineIcon key="i" />,
    ],
    [
      "Bucket head",
      "A BERT model, fine-tuned on labeled comments, that reads the rest.",
      <BucketIcon key="i" tile={color.well} />,
    ],
  ];

  return (
    <SectionShell>
      <View style={[styles.columns, isWide && styles.columnsWide]}>
        <View style={isWide ? styles.half : null}>
          <Eyebrow>WHO IS KRATT</Eyebrow>
          <SectionTitle style={styles.title}>
            A helper made from whatever was lying around
          </SectionTitle>
          <View style={styles.story}>
            {STORY.map((paragraph) => (
              <Text
                key={paragraph.slice(0, 16)}
                style={[type.bodyLarge, styles.paragraph]}
              >
                {paragraph}
              </Text>
            ))}
            <Text
              style={[type.bodyLarge, styles.paragraph, { color: color.ink }]}
            >
              This Kratt has one job. It goes through a comment section and
              brings back the evidence, so you can make the call.
            </Text>
          </View>
        </View>

        <View
          style={[
            styles.card,
            isWide && styles.half,
            { backgroundColor: color.surface, borderColor: color.border },
          ]}
        >
          <Eyebrow style={styles.cardEyebrow}>THIS KRATT IS BUILT FROM</Eyebrow>
          {parts.map(([name, detail, icon], index) => (
            <View
              key={name}
              style={[
                styles.part,
                index < parts.length - 1 && {
                  borderBottomWidth: 1,
                  borderBottomColor: color.border,
                },
              ]}
            >
              {icon}
              <View style={styles.partText}>
                <Text
                  style={[
                    styles.partName,
                    { fontFamily: font.displayBold, color: color.ink },
                  ]}
                >
                  {name}
                </Text>
                <Text
                  style={[
                    styles.partDetail,
                    { fontFamily: font.sans, color: color.inkMuted },
                  ]}
                >
                  {detail}
                </Text>
              </View>
            </View>
          ))}
        </View>
      </View>
    </SectionShell>
  );
}

const styles = StyleSheet.create({
  columns: {
    gap: 48,
  },
  columnsWide: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 72,
  },
  half: {
    flex: 1,
    minWidth: 0,
  },
  title: {
    marginBottom: 28,
  },
  story: {
    gap: 18,
    maxWidth: 520,
  },
  paragraph: {
    lineHeight: 28,
  },
  card: {
    borderWidth: 1,
    borderRadius: 14,
    paddingTop: 28,
    paddingHorizontal: 28,
    paddingBottom: 8,
  },
  cardEyebrow: {
    marginBottom: 8,
  },
  part: {
    flexDirection: "row",
    alignItems: "center",
    gap: 18,
    paddingVertical: 20,
  },
  icon: {
    width: 52,
    height: 52,
    borderRadius: 8,
  },
  clip: {
    overflow: "hidden",
  },
  centered: {
    alignItems: "center",
    justifyContent: "center",
  },
  rake: {
    width: 30,
    height: 22,
    borderTopWidth: 5,
    borderTopColor: "#B98A4E",
  },
  partText: {
    flex: 1,
  },
  partName: {
    fontSize: 21,
    lineHeight: 26,
    letterSpacing: -0.4,
    marginBottom: 3,
  },
  partDetail: {
    fontSize: 15,
    lineHeight: 22,
  },
});
