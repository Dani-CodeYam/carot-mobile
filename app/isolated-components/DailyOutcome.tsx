import { View, Text } from "react-native";
import { useLocalSearchParams } from "expo-router";
import type { ComponentProps } from "react";
import { DailyOutcome as Component } from "../../components/DailyOutcome";

type Props = ComponentProps<typeof Component>;

const scenarios: Record<string, Props> = {
  // With a trail behind you, the way into it is offered.
  WithHistory: {
    tomorrowNote: "Mañana te espera una carta nueva.",
    historyLabel: "Ver cartas anteriores",
    historyCount: 4,
    onSeeHistory: () => {},
  },
  // Day one: no history yet, so no button at all.
  FirstDay: {
    tomorrowNote: "Mañana te espera una carta nueva.",
    historyLabel: "Ver cartas anteriores",
    historyCount: 0,
    onSeeHistory: () => {},
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
