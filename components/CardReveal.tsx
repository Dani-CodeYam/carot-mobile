/**
 * What a card says once it's face-up: the quote, then the meaning, each set off
 * by a row of three small stars.
 *
 * Deliberately no arcana/name/numeral line — the card artwork already carries
 * all three, and repeating them in text pushed the quote below the fold. What
 * you get here is what the card is telling you, nothing about what it's called.
 *
 * Every draw in the app ends here — the daily card, the open message and the
 * specific question all reveal identically, only the action underneath differs.
 * That action is passed as `children` so each screen keeps its own ending.
 */
import type { ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { StarRule } from '@/components/StarRule';
import { cardText, type Card, type Lang } from '@/data/cards';
import { theme } from '@/lib/theme';

export function CardReveal({
  card,
  lang,
  children,
}: {
  card: Card;
  lang: Lang;
  /** The screen's follow-up action, rendered below the meaning. */
  children?: ReactNode;
}) {
  return (
    <View style={styles.reveal}>
      <StarRule />

      <Text style={styles.quote}>“{cardText(card, 'quote', lang)}”</Text>

      <StarRule />

      <Text style={styles.meaning}>{cardText(card, 'meaning', lang)}</Text>

      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  reveal: {
    alignItems: 'center',
    maxWidth: 520,
  },
  quote: {
    color: theme.colors.sageLight,
    fontFamily: theme.fontFamily.sansItalic,
    fontSize: theme.fontSize.xl,
    textAlign: 'center',
    lineHeight: theme.fontSize.xl * 1.45,
  },
  meaning: {
    color: theme.colors.textPrimary,
    fontFamily: theme.fontFamily.sansLight,
    fontSize: theme.fontSize.lg,
    lineHeight: theme.fontSize.lg * 1.75,
    textAlign: 'center',
    opacity: 0.92,
  },
});
