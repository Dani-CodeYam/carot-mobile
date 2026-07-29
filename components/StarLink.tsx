/**
 * The ✳ in the header — the button that opens the app menu.
 *
 * It used to be a decorative glyph; now it opens the slide-in menu (see
 * NavMenu), from which you reach the draws, the gallery and the history. Kept
 * as its own component so both headers (Home and the shared ScreenHeader) share
 * one handler and one label rather than each wiring their own Pressable. Size is
 * a prop because the two headers set the star at different sizes.
 *
 * The mark itself lives in Star — see the note there on why it is artwork and
 * not a character.
 */
import { Pressable } from 'react-native';
import { Star } from '@/components/Star';
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
      <Star size={size} tone="link" />
    </Pressable>
  );
}
