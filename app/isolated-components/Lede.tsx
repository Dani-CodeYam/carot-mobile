import { View, Text } from "react-native";
import { useLocalSearchParams } from "expo-router";
import type { ComponentProps } from "react";
import { Lede as Component } from "../../components/Lede";

type Props = ComponentProps<typeof Component>;

const scenarios: Record<string, Props> = {
  // The three-line instruction shown above the spread.
  Default: { children: "Conectá con ese tema.\nRespirá hondo.\nElegí tu carta." },
  SingleLine: { children: "Escribí lo que querés preguntarle a las cartas." },
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
