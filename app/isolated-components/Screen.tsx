import { View, Text } from "react-native";
import { useLocalSearchParams } from "expo-router";
import type { ComponentProps } from "react";
import { Screen as Component } from "../../components/Screen";
import { ScreenTitle } from "../../components/ScreenTitle";
import { Lede } from "../../components/Lede";

type Props = ComponentProps<typeof Component>;

// A layout shell shows nothing on its own, so each scenario seeds it with real
// content — the point being where that content lands, not what it says.
const scenarios: Record<string, Props> = {
  // Reading screens start at the top: their content outgrows the viewport.
  TopAligned: {
    children: (
      <>
        <ScreenTitle>Carta del día</ScreenTitle>
        <Lede>Tocá la carta para revelarla</Lede>
      </>
    ),
  },
  // Home centres instead — a short screen that should sit balanced.
  Centered: {
    centered: true,
    children: (
      <>
        <ScreenTitle>El Carot</ScreenTitle>
        <Lede>Un mensaje de las cartas, cuando lo necesites.</Lede>
      </>
    ),
  },
};

export default function IsolatedComponent() {
  const { s = "TopAligned" } = useLocalSearchParams<{ s?: string }>();
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
