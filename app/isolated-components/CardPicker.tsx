import { View, Text } from "react-native";
import { useLocalSearchParams } from "expo-router";
import type { ComponentProps } from "react";
import { CardPicker as Component } from "../../components/CardPicker";
import { CAROT_CARDS } from "../../data/cards";

type Props = ComponentProps<typeof Component>;

// A fixed deck rather than a shuffle: the capture must be identical every run,
// and every card shows the same back anyway.
const scenarios: Record<string, Props> = {
  Default: { deck: CAROT_CARDS, onChoose: () => {} },
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
