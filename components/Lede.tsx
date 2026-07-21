/**
 * The quiet paragraph under a title — the instruction you read once before
 * doing the thing. Centred, generous line height, deliberately not competing
 * with the cards below it.
 */
import { StyleSheet, Text } from 'react-native';
import { theme } from '@/lib/theme';

export function Lede({ children }: { children: string }) {
  return <Text style={styles.lede}>{children}</Text>;
}

const styles = StyleSheet.create({
  lede: {
    color: theme.colors.textSecondary,
    fontFamily: theme.fontFamily.sans,
    fontSize: theme.fontSize.base,
    textAlign: 'center',
    marginTop: theme.spacing.lg,
    lineHeight: theme.fontSize.base * 1.7,
  },
});
