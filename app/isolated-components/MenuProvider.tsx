import { useEffect } from "react";
import { View, Text } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { MenuProvider as Component, useMenu } from "../../lib/menu";
import { NavMenu } from "../../components/NavMenu";

// A provider renders nothing itself, so the scenario shows what it provides:
// the shared open state that lets a trigger and the root-mounted overlay —
// which live in different parts of the tree — talk to each other. Opening it on
// mount slides the panel in, proving the one context drives the whole menu.
function Opener() {
  const { openMenu } = useMenu();
  useEffect(() => {
    openMenu();
  }, [openMenu]);
  return null;
}

export default function IsolatedComponent() {
  const { s = "Default" } = useLocalSearchParams<{ s?: string }>();

  if (s !== "Default") {
    return (
      <View nativeID="codeyam-capture">
        <Text>Unknown scenario: {s}</Text>
      </View>
    );
  }

  return (
    <View nativeID="codeyam-capture" style={{ flex: 1 }}>
      <Component>
        <Opener />
        <NavMenu />
      </Component>
    </View>
  );
}
