/**
 * EL CAROT, set large in the display face — the app saying its own name.
 *
 * Only Home wears it at full size; every other screen carries the small version
 * inside ScreenHeader.
 */
import { StyleSheet, Text } from 'react-native';
import { theme } from '@/lib/theme';

export function Wordmark() {
  return <Text style={styles.wordmark}>EL CAROT</Text>;
}

const styles = StyleSheet.create({
  wordmark: {
    color: theme.colors.sageLight,
    fontFamily: theme.fontFamily.display,
    fontSize: theme.fontSize['4xl'],
    letterSpacing: 2,
    marginTop: theme.spacing.lg,
  },
});
