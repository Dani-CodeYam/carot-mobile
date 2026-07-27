/**
 * What we say when signing in didn't work.
 *
 * Deliberately one short line in the deck's red rather than a banner: a failed
 * sign-in in El Carot costs nothing — the app is fully usable without an
 * account — so it warrants a note, not an alarm.
 */
import { StyleSheet, Text } from 'react-native';
import { theme } from '@/lib/theme';

export function LoginError({ message }: { message: string }) {
  return <Text style={styles.error}>{message}</Text>;
}

const styles = StyleSheet.create({
  error: {
    color: theme.colors.red,
    fontFamily: theme.fontFamily.sans,
    fontSize: theme.fontSize.sm,
    textAlign: 'center',
  },
});
