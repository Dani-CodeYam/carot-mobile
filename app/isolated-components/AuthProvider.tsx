import { View, Text } from "react-native";
import { useLocalSearchParams } from "expo-router";
import type { ComponentProps } from "react";
import { AuthProvider as Component, useAuth } from "../../lib/auth";
import { displayName } from "../../lib/account";
import { theme } from "../../lib/theme";

type Props = ComponentProps<typeof Component>;

// A provider renders nothing itself, so the scenario shows what it PROVIDES.
// Reading the context back out is the only way to see the resting state that
// matters most in El Carot: signed out, with the app fully usable anyway.
function SessionReadout() {
  const { session, loading, appleUnavailable, googleUnavailable } = useAuth();

  const rows: [string, string][] = [
    ["Sesión", session ? (displayName(session) ?? "sin nombre") : "sin cuenta"],
    ["Cargando", loading ? "sí" : "no"],
    ["Apple", appleUnavailable ?? "disponible"],
    ["Google", googleUnavailable ?? "disponible"],
  ];

  return (
    <View style={{ padding: 24, gap: 12 }}>
      {rows.map(([label, value]) => (
        <View key={label} style={{ flexDirection: "row", gap: 12 }}>
          <Text
            style={{
              color: theme.colors.textSecondary,
              fontFamily: theme.fontFamily.sans,
              fontSize: theme.fontSize.sm,
              width: 90,
            }}
          >
            {label}
          </Text>
          <Text
            style={{
              color: theme.colors.textPrimary,
              fontFamily: theme.fontFamily.sansSemiBold,
              fontSize: theme.fontSize.sm,
            }}
          >
            {value}
          </Text>
        </View>
      ))}
    </View>
  );
}

const scenarios: Record<string, Props> = {
  // The production default: nobody signed in. Both providers report why they
  // can't be used in the web preview — Apple because it is iOS-only, Google
  // because its client ids live outside the repo.
  Default: {
    children: <SessionReadout />,
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
  return (
    <View nativeID="codeyam-capture">
      <Component {...props} />
    </View>
  );
}
