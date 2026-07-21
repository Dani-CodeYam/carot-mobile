/**
 * The card, at the size the app shows it, with the "tap me" nudge underneath.
 *
 * The nudge only appears while the card is face-down AND actually tappable —
 * on a card that turns itself over it would be an instruction you can't follow.
 */
import { StyleSheet, Text, View } from 'react-native';
import { TarotCard } from '@/components/TarotCard';
import type { Card } from '@/data/cards';
import { theme } from '@/lib/theme';

const CARD_WIDTH = 230;

export function CardStage({
  card,
  flipped,
  onPress,
  hint,
}: {
  card: Card | null;
  flipped: boolean;
  /** Omit for a card that turns on its own. */
  onPress?: () => void;
  /** Omit to show no nudge at all. */
  hint?: string;
}) {
  return (
    <View style={styles.stage}>
      <TarotCard card={card} flipped={flipped} onPress={onPress} width={CARD_WIDTH} />
      {!flipped && hint && onPress ? <Text style={styles.hint}>{hint}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  stage: {
    alignItems: 'center',
    marginTop: theme.spacing.xl,
  },
  hint: {
    color: theme.colors.textMuted,
    fontFamily: theme.fontFamily.sans,
    fontSize: theme.fontSize.sm,
    marginTop: theme.spacing.lg,
  },
});
