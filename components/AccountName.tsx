/**
 * Who you're signed in as — the one thing the account screen exists to say.
 *
 * In the display face, like a screen title, because for this screen it is one.
 * Bounded to two lines so a long full name settles instead of pushing the
 * sign-out button off the screen.
 */
import { StyleSheet, Text } from 'react-native';
import { theme } from '@/lib/theme';

export function AccountName({ children }: { children: string }) {
  return (
    <Text style={styles.name} numberOfLines={2}>
      {children}
    </Text>
  );
}

const styles = StyleSheet.create({
  name: {
    color: theme.colors.textPrimary,
    fontFamily: theme.fontFamily.display,
    fontSize: theme.fontSize['2xl'],
    textAlign: 'center',
  },
});
