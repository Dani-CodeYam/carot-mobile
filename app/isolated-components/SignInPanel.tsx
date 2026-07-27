import { View, Text } from "react-native";
import { useLocalSearchParams } from "expo-router";
import type { ComponentProps } from "react";
import { SignInPanel as Component } from "../../components/SignInPanel";

type Props = ComponentProps<typeof Component>;

// The panel's states differ only by what it is TOLD about availability, which
// is exactly why they belong here: `Default` is the one state the app scenarios
// can never show, because the web preview has neither Apple nor Google
// credentials. This is what the screen looks like on a phone once they exist.
const scenarios: Record<string, Props> = {
  Default: {
    intro:
      "Entrá y tus cartas te siguen a donde vayas.\nEl Carot funciona igual sin cuenta.",
    appleLabel: "Continuar con Apple",
    googleLabel: "Continuar con Google",
    withoutLabel: "Seguir sin cuenta",
    onApple: () => {},
    onGoogle: () => {},
    onWithout: () => {},
  },
  // What the web preview actually shows: neither provider is usable, and each
  // says why rather than disappearing.
  Unavailable: {
    intro:
      "Entrá y tus cartas te siguen a donde vayas.\nEl Carot funciona igual sin cuenta.",
    appleLabel: "Continuar con Apple",
    googleLabel: "Continuar con Google",
    withoutLabel: "Seguir sin cuenta",
    appleNote: "Disponible en la app del teléfono.",
    googleNote: "Todavía sin configurar.",
    onApple: () => {},
    onGoogle: () => {},
    onWithout: () => {},
  },
  // A sign-in that failed. Deliberately a quiet note, not an alarm — the app
  // is fully usable without an account, so nothing was actually lost.
  Error: {
    intro:
      "Entrá y tus cartas te siguen a donde vayas.\nEl Carot funciona igual sin cuenta.",
    appleLabel: "Continuar con Apple",
    googleLabel: "Continuar con Google",
    withoutLabel: "Seguir sin cuenta",
    error: "No pudimos entrar. Probá de nuevo.",
    onApple: () => {},
    onGoogle: () => {},
    onWithout: () => {},
  },
  English: {
    intro:
      "Sign in and your cards follow you wherever you go.\nEl Carot works just the same without an account.",
    appleLabel: "Continue with Apple",
    googleLabel: "Continue with Google",
    withoutLabel: "Continue without an account",
    onApple: () => {},
    onGoogle: () => {},
    onWithout: () => {},
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
  // The panel stretches to its parent; in the app that parent is `Screen`,
  // whose padding is theme.spacing.xl. Matching it here keeps the isolated
  // capture from running edge-to-edge and misrepresenting the real inset.
  return (
    <View nativeID="codeyam-capture">
      <View style={{ padding: 24 }}>
        <Component {...props} />
      </View>
    </View>
  );
}
