import { View, Text } from "react-native";
import { useLocalSearchParams } from "expo-router";
import type { ComponentProps } from "react";
import { GalleryCard as Component } from "../../components/GalleryCard";
import { CAROT_CARDS } from "../../data/cards";

type Props = ComponentProps<typeof Component>;

// Cell width matches a 3-column grid on the iPhone 16 viewport (see GalleryGrid).
const CELL_WIDTH = 110;

const scenarios: Record<string, Props> = {
  // One arcana as it sits in the grid — face-up artwork, no label.
  Default: { card: CAROT_CARDS[0], width: CELL_WIDTH, onPress: () => {} },
  // A different arcana, to confirm the art swaps and the cell stays put.
  Alternate: { card: CAROT_CARDS[13], width: CELL_WIDTH, onPress: () => {} },
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
