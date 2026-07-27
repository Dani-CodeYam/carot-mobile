import { View, Text } from "react-native";
import { useLocalSearchParams } from "expo-router";
import type { ComponentProps } from "react";
import { ProviderOption as Component } from "../../components/ProviderOption";

type Props = ComponentProps<typeof Component>;

// The note IS the disabled state — passing one dims the button and explains
// itself in the same breath. These two scenarios are the whole component.
const scenarios: Record<string, Props> = {
  Default: {
    label: "Continuar con Apple",
    onPress: () => {},
  },
  // Apple's button only exists on iOS; Google's needs client ids that live
  // outside the repo. Either way the reader is told which, not left with a
  // button that fails when tapped.
  Unavailable: {
    label: "Continuar con Apple",
    note: "Disponible en la app del teléfono.",
    onPress: () => {},
  },
  NoConfigurado: {
    label: "Continuar con Google",
    note: "Todavía sin configurar.",
    onPress: () => {},
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
