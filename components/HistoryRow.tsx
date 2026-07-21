/**
 * One past day in the trail, opening in place.
 *
 * Expanding inline rather than pushing a screen: the list is the point, and the
 * meanings run long enough that navigating away and back for each one would
 * make the trail tedious to read through.
 */
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { cardText, type Card, type Lang } from '@/data/cards';
import { theme } from '@/lib/theme';

export function HistoryRow({
  card,
  day,
  lang,
  open,
  onToggle,
}: {
  card: Card;
  /** The day this card belonged to, already formatted. */
  day: string;
  lang: Lang;
  open: boolean;
  onToggle: () => void;
}) {
  return (
    <Pressable
      onPress={onToggle}
      style={styles.row}
      accessibilityRole="button"
      accessibilityState={{ expanded: open }}
    >
      <View style={styles.head}>
        <View style={styles.headText}>
          <Text style={styles.day}>{day}</Text>
          <Text style={styles.arcana}>{card.arcana}</Text>
          <Text style={styles.name}>{card.name}</Text>
        </View>
        <Text style={styles.roman}>{card.rom}</Text>
      </View>

      {open ? (
        <View style={styles.body}>
          <Text style={styles.quote}>“{cardText(card, 'quote', lang)}”</Text>
          <Text style={styles.meaning}>{cardText(card, 'meaning', lang)}</Text>
        </View>
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    alignSelf: 'stretch',
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    paddingVertical: theme.spacing.lg,
  },
  head: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headText: {
    flex: 1,
    paddingRight: theme.spacing.md,
  },
  day: {
    color: theme.colors.textMuted,
    fontFamily: theme.fontFamily.sans,
    fontSize: theme.fontSize.xs,
  },
  arcana: {
    color: theme.colors.textPrimary,
    fontFamily: theme.fontFamily.display,
    fontSize: theme.fontSize.xl,
    marginTop: theme.spacing.xs,
  },
  name: {
    color: theme.colors.sageLight,
    fontFamily: theme.fontFamily.sans,
    fontSize: theme.fontSize.sm,
    marginTop: 2,
  },
  roman: {
    color: theme.colors.sage,
    fontFamily: theme.fontFamily.sans,
    fontSize: theme.fontSize.base,
    letterSpacing: 2,
  },
  body: {
    marginTop: theme.spacing.lg,
  },
  quote: {
    color: theme.colors.sageLight,
    fontFamily: theme.fontFamily.sansItalic,
    fontSize: theme.fontSize.base,
  },
  meaning: {
    color: theme.colors.textPrimary,
    fontFamily: theme.fontFamily.sansLight,
    fontSize: theme.fontSize.sm,
    lineHeight: theme.fontSize.sm * 1.7,
    marginTop: theme.spacing.md,
    opacity: 0.9,
  },
});
