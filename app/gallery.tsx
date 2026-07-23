/**
 * Todas las cartas — the whole deck, browsable.
 *
 * A grid of all 22 arcana face-up; tapping one opens its reading. Reached from
 * the ✳ in the header (see StarLink). The reading it opens is the ordinary
 * `/reading?n=` deep link, so a chosen card arrives face-up with its meaning,
 * and the back arrow returns here.
 *
 * Read-only: the gallery shows the fixed deck, draws nothing and stores nothing.
 */
import { useWindowDimensions } from 'react-native';
import { router } from 'expo-router';
import { GalleryGrid } from '@/components/GalleryGrid';
import { Lede } from '@/components/Lede';
import { Screen } from '@/components/Screen';
import { ScreenHeader } from '@/components/ScreenHeader';
import { ScreenTitle } from '@/components/ScreenTitle';
import { CAROT_CARDS, type Card } from '@/data/cards';
import { t, useLang } from '@/lib/lang';
import { theme } from '@/lib/theme';

export default function GalleryScreen() {
  const { lang } = useLang();
  const { width } = useWindowDimensions();
  // The Screen pads each side by spacing.xl; the grid gets what's left.
  const gridWidth = width - theme.spacing.xl * 2;

  const openReading = (card: Card) => {
    router.push(`/reading?n=${card.n}`);
  };

  return (
    <Screen>
      <ScreenHeader />

      <ScreenTitle>{t(lang, 'galleryTitle')}</ScreenTitle>
      <Lede>{t(lang, 'galleryIntro')}</Lede>

      <GalleryGrid cards={CAROT_CARDS} width={gridWidth} onSelect={openReading} />
    </Screen>
  );
}
