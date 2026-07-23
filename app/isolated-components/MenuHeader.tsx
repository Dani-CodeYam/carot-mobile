import { View, Text } from "react-native";
import { useLocalSearchParams } from "expo-router";
import type { ComponentProps } from "react";
import { MenuHeader as Component } from "../../components/MenuHeader";
import { theme } from "../../lib/theme";

type Props = ComponentProps<typeof Component>;

const scenarios: Record<string, Props> = {
  // The menu's title row — label on the left, × to close on the right.
  Default: { label: "Menú", closeLabel: "Cerrar menú", onClose: () => {} },
  // The English label.
  English: { label: "Menu", closeLabel: "Close menu", onClose: () => {} },
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
  // Sit the header on a slice of the real panel — its background and side
  // padding — so it reads the way it does inside the menu.
  return (
    <View nativeID="codeyam-capture">
      <View
        style={{
          width: 320,
          backgroundColor: theme.colors.accentLight,
          paddingHorizontal: theme.spacing.xl,
          paddingVertical: theme.spacing.xl,
        }}
      >
        <Component {...props} />
      </View>
    </View>
  );
}
