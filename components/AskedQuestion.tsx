/**
 * The question, kept on screen above the card that answers it — so the meaning
 * is read against what was actually asked, not from memory.
 */
import { StyleSheet, Text, View } from 'react-native';
import { theme } from '@/lib/theme';

export function AskedQuestion({ label, question }: { label: string; question: string }) {
  return (
    <View style={styles.wrap}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.question}>“{question}”</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    maxWidth: 420,
    marginTop: theme.spacing.lg,
  },
  label: {
    color: theme.colors.textMuted,
    fontFamily: theme.fontFamily.sans,
    fontSize: theme.fontSize.xs,
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  question: {
    color: theme.colors.textPrimary,
    fontFamily: theme.fontFamily.sansItalic,
    fontSize: theme.fontSize.lg,
    textAlign: 'center',
    marginTop: theme.spacing.xs,
    lineHeight: theme.fontSize.lg * 1.4,
  },
});
