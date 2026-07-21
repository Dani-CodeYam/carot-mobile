/**
 * Gives a screen's closing action the full column width.
 *
 * ActionButton stretches to its parent, and the reveal centres its children —
 * so without something to stretch against, the button shrinks to fit its label
 * and stops matching the bars on Home.
 */
import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import { theme } from '@/lib/theme';

export function ActionBar({ children }: { children: ReactNode }) {
  return <View style={styles.bar}>{children}</View>;
}

const styles = StyleSheet.create({
  bar: {
    alignSelf: 'stretch',
    marginTop: theme.spacing['2xl'],
    gap: theme.spacing.md,
  },
});
