import { View, Text } from "react-native";
import { useLocalSearchParams } from "expo-router";
import type { ComponentProps } from "react";
import { ScreenTitle as Component } from "../../components/ScreenTitle";

type Props = ComponentProps<typeof Component>;

const scenarios: Record<string, Props> = {
  Default: { children: "Carta del día" },
  // The message flow's title runs to two lines on a phone — the wrapping case
  // is the one that can go wrong.
  TwoLines: { children: "¿Sobre qué querés recibir un mensaje?" },
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
