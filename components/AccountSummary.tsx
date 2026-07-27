/**
 * What the account screen shows once you're in: who you are, and the way out.
 *
 * `name` is nullable on purpose. Apple hands the name over only on the very
 * first authorization and lets the reader hide it entirely, so an account with
 * no name attached is ordinary, not broken — it falls back to a neutral label
 * rather than leaving a blank line where a person should be.
 */
import { StyleSheet, View } from 'react-native';
import { AccountName } from '@/components/AccountName';
import { ActionButton } from '@/components/ActionButton';
import { Lede } from '@/components/Lede';
import { theme } from '@/lib/theme';

export function AccountSummary({
  name,
  fallbackLabel,
  intro,
  signOutLabel,
  onSignOut,
}: {
  /** Display name, or null when the provider withheld it. */
  name: string | null;
  /** Stands in for the name when there isn't one. */
  fallbackLabel: string;
  intro: string;
  signOutLabel: string;
  onSignOut: () => void;
}) {
  return (
    <View style={styles.panel}>
      <AccountName>{name ?? fallbackLabel}</AccountName>
      <Lede>{intro}</Lede>
      <ActionButton label={signOutLabel} onPress={onSignOut} variant="outline" />
    </View>
  );
}

const styles = StyleSheet.create({
  panel: {
    alignSelf: 'stretch',
    alignItems: 'center',
    gap: theme.spacing.md,
  },
});
