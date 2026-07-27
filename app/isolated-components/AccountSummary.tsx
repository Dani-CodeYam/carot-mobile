import { View, Text } from "react-native";
import { useLocalSearchParams } from "expo-router";
import type { ComponentProps } from "react";
import { AccountSummary as Component } from "../../components/AccountSummary";

type Props = ComponentProps<typeof Component>;

const scenarios: Record<string, Props> = {
  Default: {
    name: "Dani",
    fallbackLabel: "Tu cuenta",
    intro: "Estás usando El Carot con tu cuenta.",
    signOutLabel: "Cerrar sesión",
    onSignOut: () => {},
  },
  // Apple returns the name only on the very first authorization and lets the
  // reader hide it outright, so a nameless account is ordinary, not broken.
  SinNombre: {
    name: null,
    fallbackLabel: "Tu cuenta",
    intro: "Estás usando El Carot con tu cuenta.",
    signOutLabel: "Cerrar sesión",
    onSignOut: () => {},
  },
  // Two given names and two surnames is an ordinary Spanish full name, and
  // Apple hands it back whole — it has to settle onto two lines rather than
  // pushing the sign-out button off the screen.
  NombreLargo: {
    name: "María Fernanda Etcheverry Balcarce",
    fallbackLabel: "Tu cuenta",
    intro: "Estás usando El Carot con tu cuenta.",
    signOutLabel: "Cerrar sesión",
    onSignOut: () => {},
  },
  English: {
    name: "Dani",
    fallbackLabel: "Your account",
    intro: "You're using El Carot with your account.",
    signOutLabel: "Sign out",
    onSignOut: () => {},
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
