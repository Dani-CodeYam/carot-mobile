import { View, Text } from "react-native";
import { useLocalSearchParams } from "expo-router";
import type { ComponentProps } from "react";
import { ChooseCardStep as Component } from "../../components/ChooseCardStep";
import { CAROT_CARDS } from "../../data/cards";

type Props = ComponentProps<typeof Component>;

const scenarios: Record<string, Props> = {
  Default: {
    deck: CAROT_CARDS,
    lede: "Conectá con ese tema.\nRespirá hondo.\nElegí tu carta.",
    onChoose: () => {},
  },
  English: {
    deck: CAROT_CARDS,
    lede: "Connect with that theme.\nTake a deep breath.\nChoose your card.",
    onChoose: () => {},
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
