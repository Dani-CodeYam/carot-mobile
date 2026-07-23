import '../global.css';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { NavMenu } from '@/components/NavMenu';
import { LangProvider } from '@/lib/lang';
import { MenuProvider } from '@/lib/menu';
import { theme } from '@/lib/theme';

export default function RootLayout() {
  // Maragsa Display is the El Carot title face; Josefin Sans is the body face,
  // both bundled rather than pulled from a font package. We render immediately
  // even before they load so the preview never blanks — text just restyles once
  // they're ready.
  useFonts({
    MaragsaDisplay: require('../assets/fonts/Maragsa-Display.otf'),
    JosefinSans: require('../assets/fonts/JosefinSans-Regular.ttf'),
    JosefinSansLight: require('../assets/fonts/JosefinSans-Light.ttf'),
    JosefinSansSemiBold: require('../assets/fonts/JosefinSans-SemiBold.ttf'),
    JosefinSansItalic: require('../assets/fonts/JosefinSans-Italic.ttf'),
  });

  return (
    <SafeAreaProvider>
      <LangProvider>
        <MenuProvider>
          <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.bgBase }}>
            <Stack
              screenOptions={{
                headerShown: false,
                contentStyle: { backgroundColor: theme.colors.bgBase },
              }}
            />
          </SafeAreaView>
          {/* Mounted outside SafeAreaView so the menu overlays the whole
              screen, and inside MenuProvider so the header star can open it
              from any route. */}
          <NavMenu />
        </MenuProvider>
      </LangProvider>
      <StatusBar style="light" />
    </SafeAreaProvider>
  );
}
