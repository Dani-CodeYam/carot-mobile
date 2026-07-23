import { useEffect, useRef } from "react";
import { Animated, View, Text } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { MenuBackdrop as Component } from "../../components/MenuBackdrop";

export default function IsolatedComponent() {
  const { s = "Default" } = useLocalSearchParams<{ s?: string }>();

  // Drive the opacity the way NavMenu does — a value animated to 1 on mount so
  // the interpolation is live and settles at its resting 0.6 dim.
  const anim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(anim, { toValue: 1, duration: 200, useNativeDriver: false }).start();
  }, [anim]);
  const opacity = anim.interpolate({ inputRange: [0, 1], outputRange: [0, 0.6] });

  if (s !== "Default") {
    return (
      <View nativeID="codeyam-capture">
        <Text>Unknown scenario: {s}</Text>
      </View>
    );
  }

  // A lit header strip that the backdrop does NOT cover, above the region it
  // fills — so the capture reads as the dim laid over the screen rather than a
  // flat black square.
  return (
    <View nativeID="codeyam-capture">
      <View style={{ width: 360, backgroundColor: "#f4efe6", padding: 24 }}>
        <Text style={{ fontSize: 28, color: "#2b2a28", marginBottom: 8 }}>EL CAROT</Text>
        <Text style={{ fontSize: 16, color: "#57544e" }}>
          The backdrop dims the screen the menu opens over.
        </Text>
      </View>
      <View style={{ width: 360, height: 260, backgroundColor: "#f4efe6" }}>
        <Component opacity={opacity} onPress={() => {}} label="Cerrar menú" />
      </View>
    </View>
  );
}
