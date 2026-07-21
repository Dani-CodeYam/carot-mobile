import { View, Text } from "react-native";
import { useLocalSearchParams } from "expo-router";
import type { ComponentProps } from "react";
import { ActionButton as Component } from "../../components/ActionButton";

type Props = ComponentProps<typeof Component>;

const scenarios: Record<string, Props> = {
  Filled: { label: "Quiero recibir un mensaje", onPress: () => {} },
  Outline: { label: "Carta del día", variant: "outline", onPress: () => {} },
  // The ask button before a question has been written.
  Disabled: { label: "Consultar a las cartas", onPress: () => {}, disabled: true },
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
