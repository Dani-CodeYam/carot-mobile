import { View, Text } from "react-native";
import { useLocalSearchParams } from "expo-router";
import type { ComponentProps } from "react";
import { LangToggle as Component } from "../../components/LangToggle";

type Props = ComponentProps<typeof Component>;

// The toggle reads the live language context, so both halves show at once —
// which half is lit depends on the app's current language, not a prop.
const scenarios: Record<string, Props> = {
  Default: {},
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
