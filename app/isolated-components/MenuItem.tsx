import { View, Text } from "react-native";
import { useLocalSearchParams } from "expo-router";
import type { ComponentProps } from "react";
import { MenuItem as Component } from "../../components/MenuItem";
import { theme } from "../../lib/theme";

type Props = ComponentProps<typeof Component>;

const scenarios: Record<string, Props> = {
  // One route row as it appears in the menu list.
  Default: { label: "Ver todas las cartas", onPress: () => {} },
  // The English label.
  English: { label: "See all cards", onPress: () => {} },
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
  // Sit the row on a slice of the real panel so its ruled top edge and text
  // read the way they do inside the menu.
  return (
    <View nativeID="codeyam-capture">
      <View
        style={{
          width: 320,
          backgroundColor: theme.colors.accentLight,
          paddingHorizontal: theme.spacing.xl,
        }}
      >
        <Component {...props} />
      </View>
    </View>
  );
}
