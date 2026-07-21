import { View, Text } from "react-native";
import { useLocalSearchParams } from "expo-router";
import type { ComponentProps } from "react";
import { LangProvider as Component } from "../../lib/lang";
import { LangToggle } from "../../components/LangToggle";
import { CardReveal } from "../../components/CardReveal";
import { CAROT_CARDS } from "../../data/cards";

type Props = ComponentProps<typeof Component>;

// A provider renders nothing itself, so the scenario has to show what it
// provides: a toggle and a card whose text follows whichever language the
// context is currently holding. Flip ES/EN in the capture and both change
// together — that shared update is the whole point of the provider.
const scenarios: Record<string, Props> = {
  Default: {
    children: (
      <View style={{ alignItems: "center", gap: 24, padding: 24 }}>
        <LangToggle />
        <CardReveal card={CAROT_CARDS[8]} lang="es" />
      </View>
    ),
  },
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
