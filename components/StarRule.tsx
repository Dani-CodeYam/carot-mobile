/**
 * Three small stars — the divider that sets a revealed card's quote apart from
 * its meaning, in place of a plain rule.
 *
 * Its own file rather than a helper inside CardReveal so it can be looked at on
 * its own, and so the two are free to be used apart later.
 */
import { StyleSheet, Text, View } from 'react-native';
import { theme } from '@/lib/theme';

export function StarRule() {
  return (
    <View style={styles.rule}>
      <Text style={styles.star}>✳</Text>
      <Text style={styles.star}>✳</Text>
      <Text style={styles.star}>✳</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  rule: {
    flexDirection: 'row',
    gap: theme.spacing.lg,
    marginVertical: theme.spacing.xl,
  },
  // No fontFamily: a symbol glyph, which Josefin Sans has no coverage for.
  star: {
    color: theme.colors.textMuted,
    fontSize: theme.fontSize.base,
  },
});
