import { View, Text } from "react-native";
import { useLocalSearchParams } from "expo-router";
import type { ComponentProps } from "react";
import { CardStage as Component } from "../../components/CardStage";
import { CAROT_CARDS } from "../../data/cards";

type Props = ComponentProps<typeof Component>;

const CARD = CAROT_CARDS[8];

const scenarios: Record<string, Props> = {
  // The daily card waiting to be tapped — the nudge only shows here.
  AwaitingTap: {
    card: CARD,
    flipped: false,
    onPress: () => {},
    hint: "Tocá la carta para revelarla",
  },
  Revealed: { card: CARD, flipped: true },
  // A card you chose yourself turns on its own, so it carries no nudge.
  SelfTurning: { card: CARD, flipped: false },
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
