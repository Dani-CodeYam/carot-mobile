/**
 * The small line directly under a screen title — the daily card's date, and
 * anything else that qualifies the title rather than restating it.
 */
import { StyleSheet, Text } from 'react-native';
import { theme } from '@/lib/theme';

export function ScreenSubtitle({ children }: { children: string }) {
  return <Text style={styles.subtitle}>{children}</Text>;
}

const styles = StyleSheet.create({
  subtitle: {
    color: theme.colors.textSecondary,
    fontFamily: theme.fontFamily.sans,
    fontSize: theme.fontSize.sm,
    marginTop: theme.spacing.xs,
  },
});
