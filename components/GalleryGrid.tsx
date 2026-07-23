/**
 * The whole deck as a grid — 22 arcana, face-up, in fixed order.
 *
 * A wrapped flex row rather than a FlatList: the deck is a fixed 22 cards, and
 * a FlatList nested inside the screen's ScrollView would fight it for scrolling.
 * Cell width is derived from the available width and a fixed column count, so
 * the grid keeps its gutters on any screen size.
 */
import { StyleSheet, View } from 'react-native';
import { GalleryCard } from '@/components/GalleryCard';
import type { Card } from '@/data/cards';
import { theme } from '@/lib/theme';

const COLUMNS = 3;
const GAP = theme.spacing.md;

export function GalleryGrid({
  cards,
  width,
  onSelect,
}: {
  cards: Card[];
  /** The width available to the grid, in px. */
  width: number;
  onSelect: (card: Card) => void;
}) {
  const cellWidth = (width - GAP * (COLUMNS - 1)) / COLUMNS;

  return (
    <View style={styles.grid}>
      {cards.map((card) => (
        <GalleryCard key={card.n} card={card} width={cellWidth} onPress={onSelect} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    alignSelf: 'stretch',
    marginTop: theme.spacing.xl,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: GAP,
  },
});
