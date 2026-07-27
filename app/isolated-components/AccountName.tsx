import { View, Text } from "react-native";
import { useLocalSearchParams } from "expo-router";
import type { ComponentProps } from "react";
import { AccountName as Component } from "../../components/AccountName";

type Props = ComponentProps<typeof Component>;

const scenarios: Record<string, Props> = {
  Default: {
    children: "Dani",
  },
  // The reason this component clamps to two lines: Apple hands back the full
  // legal name, which in Spanish-speaking countries is routinely four parts.
  Largo: {
    children: "María Fernanda Etcheverry Balcarce",
  },
  // What stands in when the provider withheld the name entirely.
  Fallback: {
    children: "Tu cuenta",
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
  // Matches `Screen`'s padding, the real container this sits in.
  return (
    <View nativeID="codeyam-capture">
      <View style={{ padding: 24 }}>
        <Component {...props} />
      </View>
    </View>
  );
}
