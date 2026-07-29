import { View, Text } from "react-native";
import { useLocalSearchParams } from "expo-router";
import type { ComponentProps } from "react";
import { Star as Component } from "../../components/Star";
import { theme } from "../../lib/theme";

type Props = ComponentProps<typeof Component>;

// The two sizes the headers actually set, plus the muted cut StarRule uses.
const scenarios: Record<string, Props> = {
  Default: {},
  "Home size": { size: theme.fontSize.xl },
  Muted: { size: theme.fontSize.base, tone: "muted" },
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
