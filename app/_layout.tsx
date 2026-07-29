import '../global.css';
import { useEffect } from 'react';
import { Platform } from 'react-native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { NavMenu } from '@/components/NavMenu';
import { AuthProvider } from '@/lib/auth';
import { LangProvider } from '@/lib/lang';
import { MenuProvider } from '@/lib/menu';
import { theme } from '@/lib/theme';

// Hold the launch screen until the faces are ready — see the note below.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  // Maragsa Display is the El Carot title face; Josefin Sans is the body face,
  // both bundled rather than pulled from a font package.
  const [fontsLoaded, fontError] = useFonts({
    MaragsaDisplay: require('../assets/fonts/Maragsa-Display.otf'),
    JosefinSans: require('../assets/fonts/JosefinSans-Regular.ttf'),
    JosefinSansLight: require('../assets/fonts/JosefinSans-Light.ttf'),
    JosefinSansSemiBold: require('../assets/fonts/JosefinSans-SemiBold.ttf'),
    JosefinSansItalic: require('../assets/fonts/JosefinSans-Italic.ttf'),
  });

  // A font that fails to load must not strand the app behind the splash — the
  // app is perfectly legible on the system face, so a failure degrades rather
  // than blocks.
  const ready = fontsLoaded || fontError !== null;

  useEffect(() => {
    if (ready) SplashScreen.hideAsync();
  }, [ready]);

  // On a device the faces load asynchronously, and the screens below are
  // memoised by the navigator — so text that mounted before they arrived keeps
  // the system fallback until something unrelated forces a re-render. (The
  // symptom: the buttons stayed on the system face until you tapped ES/EN.)
  // Holding the tree back one frame, behind the splash, means every Text mounts
  // with the real face already registered.
  //
  // Web is exempt: react-native-web resolves @font-face without this dance, and
  // the codeyam preview must never blank waiting on a load.
  if (!ready && Platform.OS !== 'web') return null;

  return (
    <SafeAreaProvider>
      {/* Above LangProvider because the session outlives any one screen — the
          menu, the greeting and the daily card all read from it. Signing in is
          optional throughout: the resting state is signed out, and every
          screen renders fine that way. */}
      <AuthProvider>
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
      </AuthProvider>
      <StatusBar style="light" />
    </SafeAreaProvider>
  );
}
