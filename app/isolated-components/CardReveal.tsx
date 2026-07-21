import { View, Text } from "react-native";
import { useLocalSearchParams } from "expo-router";
import type { ComponentProps } from "react";
import { CardReveal as Component } from "../../components/CardReveal";
import { CAROT_CARDS } from "../../data/cards";

type Props = ComponentProps<typeof Component>;

const scenarios: Record<string, Props> = {
  Spanish: { card: CAROT_CARDS[8], lang: "es" },
  English: { card: CAROT_CARDS[8], lang: "en" },
  // El Loco carries one of the longest meanings in the deck — the case where
  // the centred body text has to hold up over many lines.
  LongMeaning: { card: CAROT_CARDS[0], lang: "es" },
};

export default function IsolatedComponent() {
  const { s = "Default" } = useLocalSearchParams<{ s?: string }>();
  const props = scenarios[s];
  if (!props) {
    return (
      <View nativeID="codeyam-capture">
        <Text>Unknown scenario: {s}</Text>
      </View>
    );
  }
  return (
    <View nativeID="codeyam-capture">
      <Component {...props} />
    </View>
  );
}
