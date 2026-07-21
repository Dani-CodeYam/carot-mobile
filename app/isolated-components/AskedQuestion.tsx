import { View, Text } from "react-native";
import { useLocalSearchParams } from "expo-router";
import type { ComponentProps } from "react";
import { AskedQuestion as Component } from "../../components/AskedQuestion";

type Props = ComponentProps<typeof Component>;

const scenarios: Record<string, Props> = {
  Default: {
    label: "Preguntaste",
    question: "¿Qué necesito saber sobre mi trabajo?",
  },
  // A long question has to wrap without crowding the card below it.
  LongQuestion: {
    label: "Preguntaste",
    question:
      "¿Qué tengo que soltar para poder avanzar con lo que me viene proponiendo la vida este año?",
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
