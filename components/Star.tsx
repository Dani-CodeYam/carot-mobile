/**
 * The seven-pointed star of the deck — the app's one recurring mark.
 *
 * It used to be the ✳ character (U+2733), which reads fine in a browser but is
 * an EMOJI on iOS: the system draws it from the colour emoji face, so it came
 * out as a green tile and ignored `color` entirely. A glyph you cannot colour
 * is not a design token, so the mark is now the deck's own artwork.
 *
 * Shipped as one PNG per tone rather than one asset tinted at runtime. The
 * obvious version — a white silhouette plus `tintColor` — is correct on the
 * device but renders WHITE in the web preview, because react-native-web
 * implements tintColor as an SVG filter that does not survive the headless
 * capture. That would have left every captured scenario showing the wrong
 * colour, and a preview that lies about colour is worse than no preview. Two
 * files, and both platforms agree.
 *
 * Adding a third tone means adding a third asset — deliberately. The mark is
 * part of the identity, not a surface for arbitrary colour.
 */
import { Image } from 'react-native';
import { theme } from '@/lib/theme';

const ART = {
  /** The tappable star in a header. */
  link: require('../assets/star-sage.png'),
  /** The quieter cut, for dividers. */
  muted: require('../assets/star-muted.png'),
} as const;

export type StarTone = keyof typeof ART;

/** Artwork aspect (width / height), preserved so the star never squashes. */
const ASPECT = 228 / 222;

export function Star({
  size = theme.fontSize.lg,
  tone = 'link',
}: {
  size?: number;
  tone?: StarTone;
}) {
  return (
    <Image
      source={ART[tone]}
      style={{ width: size * ASPECT, height: size }}
      resizeMode="contain"
      accessibilityIgnoresInvertColors
    />
  );
}
