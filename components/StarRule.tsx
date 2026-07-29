/**
 * Three small stars — the divider that sets a revealed card's quote apart from
 * its meaning, in place of a plain rule.
 *
 * Its own file rather than a helper inside CardReveal so it can be looked at on
 * its own, and so the two are free to be used apart later.
 */
import { StyleSheet, View } from 'react-native';
import { Star } from '@/components/Star';
import { theme } from '@/lib/theme';

export function StarRule() {
  return (
    <View style={styles.rule}>
      <Star size={theme.fontSize.base} tone="muted" />
      <Star size={theme.fontSize.base} tone="muted" />
      <Star size={theme.fontSize.base} tone="muted" />
    </View>
  );
}

const styles = StyleSheet.create({
  rule: {
    flexDirection: 'row',
    gap: theme.spacing.lg,
    marginVertical: theme.spacing.xl,
  },
});
