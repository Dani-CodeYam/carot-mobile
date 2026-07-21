import { View, Text } from "react-native";
import { useLocalSearchParams } from "expo-router";
import type { ComponentProps } from "react";
import { ActionBar as Component } from "../../components/ActionBar";
import { ActionButton } from "../../components/ActionButton";

type Props = ComponentProps<typeof Component>;

// ActionBar exists to give a button the full column width — so the scenario
// has to contain a button, or there is nothing to measure.
const scenarios: Record<string, Props> = {
  Default: {
    children: <ActionButton label="Elegir otra carta" onPress={() => {}} />,
  },
  // The daily card closes with an outlined way into the history.
  Outlined: {
    children: (
      <ActionButton label="Ver cartas anteriores" variant="outline" onPress={() => {}} />
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
