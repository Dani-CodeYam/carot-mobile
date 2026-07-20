import '../global.css';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '@/lib/theme';

export default function RootLayout() {
  // Maragsa Display is the El Carot title face (bundled OTF). Body text falls
  // back to the system font. We render immediately even before the font loads
  // so the preview never blanks — headings just restyle once it's ready.
  useFonts({
    MaragsaDisplay: require('../assets/fonts/Maragsa-Display.otf'),
  });

  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.bgBase }}>
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: theme.colors.bgBase },
          }}
        />
      </SafeAreaView>
      <StatusBar style="light" />
    </SafeAreaProvider>
  );
}
