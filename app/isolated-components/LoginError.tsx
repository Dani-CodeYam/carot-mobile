import { View, Text } from "react-native";
import { useLocalSearchParams } from "expo-router";
import type { ComponentProps } from "react";
import { LoginError as Component } from "../../components/LoginError";

type Props = ComponentProps<typeof Component>;

const scenarios: Record<string, Props> = {
  Default: {
    message: "No pudimos entrar. Probá de nuevo.",
  },
  English: {
    message: "We couldn't sign you in. Try again.",
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
