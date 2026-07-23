/**
 * The ✳ in the header — the button that opens the app menu.
 *
 * It used to be a decorative glyph; now it opens the slide-in menu (see
 * NavMenu), from which you reach the draws, the gallery and the history. Kept
 * as its own component so both headers (Home and the shared ScreenHeader) share
 * one handler and one label rather than each wiring their own Pressable. Size is
 * a prop because the two headers set the star at different sizes.
 *
 * No fontFamily on the glyph: Josefin Sans has no coverage for ✳, so it stays
 * on the system face like the other symbol glyphs.
 */
import { Pressable, StyleSheet, Text } from 'react-native';
import { t, useLang } from '@/lib/lang';
import { useMenu } from '@/lib/menu';
import { theme } from '@/lib/theme';

export function StarLink({ size = theme.fontSize.lg }: { size?: number }) {
  const { openMenu } = useMenu();
  const { lang } = useLang();

  return (
    <Pressable
      onPress={openMenu}
      hitSlop={12}
      accessibilityRole="button"
      accessibilityLabel={t(lang, 'menuLabel')}
    >
      <Text style={[styles.star, { fontSize: size }]}>✳</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  star: {
    color: theme.colors.sageLight,
  },
});
