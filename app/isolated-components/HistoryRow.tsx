import { View, Text } from "react-native";
import { useLocalSearchParams } from "expo-router";
import type { ComponentProps } from "react";
import { HistoryRow as Component } from "../../components/HistoryRow";
import { CAROT_CARDS } from "../../data/cards";

type Props = ComponentProps<typeof Component>;

const scenarios: Record<string, Props> = {
  // How every row sits until you open it.
  Collapsed: {
    card: CAROT_CARDS[8],
    day: "Domingo, 19 de julio",
    lang: "es",
    open: false,
    onToggle: () => {},
  },
  // Opened in place: quote and meaning below the heading.
  Expanded: {
    card: CAROT_CARDS[8],
    day: "Domingo, 19 de julio",
    lang: "es",
    open: true,
    onToggle: () => {},
  },
  English: {
    card: CAROT_CARDS[18],
    day: "Sunday, July 19",
    lang: "en",
    open: true,
    onToggle: () => {},
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
