/**
 * What the history shows before there is any: not an error, just a day that
 * hasn't turned over yet.
 */
import { StyleSheet, Text, View } from 'react-native';
import { theme } from '@/lib/theme';

export function HistoryEmpty({ message, hint }: { message: string; hint: string }) {
  return (
    <View style={styles.empty}>
      <Text style={styles.message}>{message}</Text>
      <Text style={styles.hint}>{hint}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  empty: {
    marginTop: theme.spacing['3xl'],
    alignItems: 'center',
  },
  message: {
    color: theme.colors.textPrimary,
    fontFamily: theme.fontFamily.sans,
    fontSize: theme.fontSize.lg,
    textAlign: 'center',
  },
  hint: {
    color: theme.colors.textMuted,
    fontFamily: theme.fontFamily.sans,
    fontSize: theme.fontSize.sm,
    textAlign: 'center',
    marginTop: theme.spacing.sm,
  },
});
