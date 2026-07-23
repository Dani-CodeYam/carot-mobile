/**
 * One row in the menu — a route you can tap to.
 *
 * A ruled line above each so the items read as a stacked list. The label is
 * already localised by the time it gets here; this component just draws the row
 * and reports the tap.
 */
import { Pressable, StyleSheet, Text } from 'react-native';
import { theme } from '@/lib/theme';

export function MenuItem({ label, onPress }: { label: string; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={styles.item} accessibilityRole="button">
      <Text style={styles.itemText}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  item: {
    paddingVertical: theme.spacing.lg,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  itemText: {
    color: theme.colors.textPrimary,
    fontFamily: theme.fontFamily.display,
    fontSize: theme.fontSize.xl,
  },
});
