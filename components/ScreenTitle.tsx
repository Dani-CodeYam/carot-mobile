/**
 * A screen's own title, in the display face — the line under the wordmark that
 * says which part of the app you're in.
 */
import { StyleSheet, Text } from 'react-native';
import { theme } from '@/lib/theme';

export function ScreenTitle({ children }: { children: string }) {
  return <Text style={styles.title}>{children}</Text>;
}

const styles = StyleSheet.create({
  title: {
    color: theme.colors.textPrimary,
    fontFamily: theme.fontFamily.display,
    fontSize: theme.fontSize['2xl'],
    textAlign: 'center',
    maxWidth: 340,
  },
});
