/**
 * One arcana in the gallery grid: its artwork, face-up, tappable.
 *
 * No label — the grid is meant to be read by the images, and the name waits on
 * the reading page you tap through to. The accessibility label carries the
 * arcana and character so the card is still identifiable without sight.
 */
import { Image, Pressable, StyleSheet } from 'react-native';
import type { Card } from '@/data/cards';
import { cardImage } from '@/lib/cardImages';
import { theme } from '@/lib/theme';

export function GalleryCard({
  card,
  width,
  onPress,
}: {
  card: Card;
  /** Cell width in px; height derives from the deck aspect ratio. */
  width: number;
  onPress: (card: Card) => void;
}) {
  return (
    <Pressable
      onPress={() => onPress(card)}
      accessibilityRole="button"
      accessibilityLabel={`${card.arcana} — ${card.name}`}
      style={[styles.card, { width, height: width / theme.cardAspect }]}
    >
      <Image source={cardImage(card.img)} resizeMode="cover" style={styles.image} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: theme.borderRadius.md,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.bgInverse,
  },
  image: {
    width: '100%',
    height: '100%',
  },
});
