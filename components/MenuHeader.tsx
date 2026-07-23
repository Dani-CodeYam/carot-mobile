/**
 * The top of the menu panel: a small uppercase label and a × to close.
 *
 * Just the panel's header row — the menu items are their own component below
 * it. The close × does the same thing as tapping the backdrop; it's here too
 * because a panel this wide wants an explicit affordance, not only an
 * off-target tap.
 */
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { theme } from '@/lib/theme';

export function MenuHeader({
  label,
  closeLabel,
  onClose,
}: {
  label: string;
  closeLabel: string;
  onClose: () => void;
}) {
  return (
    <View style={styles.head}>
      <Text style={styles.heading}>{label}</Text>
      <Pressable onPress={onClose} hitSlop={12} accessibilityRole="button" accessibilityLabel={closeLabel}>
        <Text style={styles.close}>×</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  head: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.lg,
  },
  heading: {
    color: theme.colors.textMuted,
    fontFamily: theme.fontFamily.sans,
    fontSize: theme.fontSize.sm,
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  close: {
    color: theme.colors.textSecondary,
    fontSize: theme.fontSize['2xl'],
    lineHeight: theme.fontSize['2xl'],
  },
});
