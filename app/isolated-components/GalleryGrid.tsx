import { View, Text } from "react-native";
import { useLocalSearchParams } from "expo-router";
import type { ComponentProps } from "react";
import { GalleryGrid as Component } from "../../components/GalleryGrid";
import { CAROT_CARDS } from "../../data/cards";

type Props = ComponentProps<typeof Component>;

// The width the grid gets on the iPhone 16 viewport once the Screen's side
// padding (spacing.xl each side) is taken off.
const GRID_WIDTH = 345;

const scenarios: Record<string, Props> = {
  // The whole deck, face-up, in fixed order — the gallery's one and only state.
  Default: { cards: CAROT_CARDS, width: GRID_WIDTH, onSelect: () => {} },
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
