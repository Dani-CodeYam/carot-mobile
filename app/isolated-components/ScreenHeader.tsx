import { View, Text } from "react-native";
import { useLocalSearchParams } from "expo-router";
import type { ComponentProps } from "react";
import { ScreenHeader as Component } from "../../components/ScreenHeader";

type Props = ComponentProps<typeof Component>;

const scenarios: Record<string, Props> = {
  // The only visual state — `back` changes where it goes, not how it looks.
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
