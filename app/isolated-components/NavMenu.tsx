import { useEffect } from "react";
import { View } from "react-native";
import { NavMenu as Component } from "../../components/NavMenu";
import { useMenu } from "../../lib/menu";

// NavMenu renders nothing until the shared menu state is open (it's driven by
// context, not props), so there's a single meaningful state to capture: open.
// The root layout already provides MenuProvider, so opening it on mount slides
// the panel in for the capture.
function Opener() {
  const { openMenu } = useMenu();
  useEffect(() => {
    openMenu();
  }, [openMenu]);
  return null;
}

export default function IsolatedComponent() {
  return (
    <View nativeID="codeyam-capture" style={{ flex: 1 }}>
      <Opener />
      <Component />
    </View>
  );
}
