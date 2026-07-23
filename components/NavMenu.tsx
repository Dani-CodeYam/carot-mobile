/**
 * The app menu: a panel that slides in from the right over whatever screen
 * you're on, opened by the ✳ in the header.
 *
 * Mounted once at the app root (see app/_layout) so it can cover any screen,
 * and driven by the shared menu context rather than per-screen state. One
 * Animated value runs the whole thing: the backdrop fades and the panel slides
 * off the same 0→1 driver, and the tree stays mounted through the close
 * animation so the slide-out is actually seen rather than snapping shut.
 *
 * Every item is a route. Tapping one closes the menu and navigates; tapping the
 * backdrop (or the ×) just closes. Navigation is a plain push — back returns to
 * wherever you opened the menu from. The backdrop, header and rows are their own
 * components; what stays here is the animation and the routing.
 */
import { useEffect, useRef, useState } from 'react';
import { Animated, StyleSheet, View, useWindowDimensions } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MenuBackdrop } from '@/components/MenuBackdrop';
import { MenuHeader } from '@/components/MenuHeader';
import { MenuItem } from '@/components/MenuItem';
import { t, useLang } from '@/lib/lang';
import { menuPanelWidth } from '@/lib/menuLayout';
import { useMenu } from '@/lib/menu';
import { theme } from '@/lib/theme';

const ITEMS: { key: 'dailyEntry' | 'messageEntry' | 'questionEntry' | 'galleryEntry' | 'historyEntry'; route: string }[] = [
  { key: 'dailyEntry', route: '/daily' },
  { key: 'messageEntry', route: '/reading' },
  { key: 'questionEntry', route: '/question' },
  { key: 'galleryEntry', route: '/gallery' },
  { key: 'historyEntry', route: '/history' },
];

const OPEN_MS = 220;
const CLOSE_MS = 200;

export function NavMenu() {
  const { open, closeMenu } = useMenu();
  const { lang } = useLang();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const panelWidth = menuPanelWidth(width);

  const anim = useRef(new Animated.Value(0)).current;
  // Kept true through the close animation so the panel slides out instead of
  // vanishing; flipped off only once the close tween finishes.
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (open) {
      setMounted(true);
      Animated.timing(anim, {
        toValue: 1,
        duration: OPEN_MS,
        useNativeDriver: true,
      }).start();
    } else if (mounted) {
      Animated.timing(anim, {
        toValue: 0,
        duration: CLOSE_MS,
        useNativeDriver: true,
      }).start(({ finished }) => {
        if (finished) setMounted(false);
      });
    }
  }, [open, mounted, anim]);

  if (!mounted) return null;

  const go = (route: string) => {
    closeMenu();
    router.push(route as Parameters<typeof router.push>[0]);
  };

  const backdropOpacity = anim.interpolate({ inputRange: [0, 1], outputRange: [0, 0.6] });
  const panelX = anim.interpolate({ inputRange: [0, 1], outputRange: [panelWidth, 0] });

  return (
    <View style={StyleSheet.absoluteFill}>
      <MenuBackdrop opacity={backdropOpacity} onPress={closeMenu} label={t(lang, 'menuClose')} />

      <Animated.View
        // Modal so assistive tech treats the screen behind as inert — without
        // it, a menu item and a same-named button underneath (e.g. Home's
        // "Carta del día") both show up in the accessibility tree.
        accessibilityViewIsModal
        style={[
          styles.panel,
          {
            width: panelWidth,
            paddingTop: insets.top + theme.spacing.xl,
            paddingBottom: insets.bottom + theme.spacing.xl,
            transform: [{ translateX: panelX }],
          },
        ]}
      >
        <MenuHeader label={t(lang, 'menuLabel')} closeLabel={t(lang, 'menuClose')} onClose={closeMenu} />

        {ITEMS.map((item) => (
          <MenuItem key={item.route} label={t(lang, item.key)} onPress={() => go(item.route)} />
        ))}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  panel: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 0,
    backgroundColor: theme.colors.accentLight,
    borderLeftWidth: 1,
    borderLeftColor: theme.colors.border,
    paddingHorizontal: theme.spacing.xl,
  },
});
