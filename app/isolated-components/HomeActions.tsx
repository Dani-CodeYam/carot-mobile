import { View, Text } from "react-native";
import { useLocalSearchParams } from "expo-router";
import type { ComponentProps } from "react";
import { HomeActions as Component } from "../../components/HomeActions";

type Props = ComponentProps<typeof Component>;

const scenarios: Record<string, Props> = {
  Default: {
    messageLabel: "Quiero recibir un mensaje",
    questionLabel: "Tengo una pregunta específica",
    dailyLabel: "Carta del día",
    onMessage: () => {},
    onQuestion: () => {},
    onDaily: () => {},
  },
  English: {
    messageLabel: "I want to receive a message",
    questionLabel: "I have a specific question",
    dailyLabel: "Card of the day",
    onMessage: () => {},
    onQuestion: () => {},
    onDaily: () => {},
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
