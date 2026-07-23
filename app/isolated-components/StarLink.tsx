import { View, Text } from "react-native";
import { useLocalSearchParams } from "expo-router";
import type { ComponentProps } from "react";
import { StarLink as Component } from "../../components/StarLink";

type Props = ComponentProps<typeof Component>;

const scenarios: Record<string, Props> = {
  // The ✳ at its header size — the tappable glyph that opens the menu.
  Default: {},
  // The larger size Home sets it at.
  Large: { size: 28 },
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
