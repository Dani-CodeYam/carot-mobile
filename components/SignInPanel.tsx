/**
 * The two ways in, and the way past.
 *
 * Purely presentational — handed labels and availability, it reports taps.
 * Knowing nothing about Apple, Google or storage is what lets it be rendered
 * in isolation for every state, including the ones that are awkward to reach
 * for real (a provider whose credentials aren't configured yet).
 *
 * "Seguir sin cuenta" sits with the providers rather than tucked away as a
 * link, because in El Carot it is not the lesser option: the app is complete
 * without an account, and the layout should say so.
 */
import { StyleSheet, View } from 'react-native';
import { ActionButton } from '@/components/ActionButton';
import { Lede } from '@/components/Lede';
import { LoginError } from '@/components/LoginError';
import { ProviderOption } from '@/components/ProviderOption';
import { theme } from '@/lib/theme';

export function SignInPanel({
  intro,
  appleLabel,
  googleLabel,
  withoutLabel,
  appleNote = null,
  googleNote = null,
  error = null,
  onApple,
  onGoogle,
  onWithout,
}: {
  intro: string;
  appleLabel: string;
  googleLabel: string;
  withoutLabel: string;
  /** Why Apple can't be used here, or null when it can. */
  appleNote?: string | null;
  googleNote?: string | null;
  error?: string | null;
  onApple: () => void;
  onGoogle: () => void;
  onWithout: () => void;
}) {
  return (
    <View style={styles.panel}>
      <Lede>{intro}</Lede>

      {error ? <LoginError message={error} /> : null}

      <ProviderOption label={appleLabel} onPress={onApple} note={appleNote} />
      <ProviderOption label={googleLabel} onPress={onGoogle} note={googleNote} />

      <ActionButton label={withoutLabel} onPress={onWithout} variant="outline" />
    </View>
  );
}

const styles = StyleSheet.create({
  panel: {
    alignSelf: 'stretch',
    gap: theme.spacing.lg,
  },
});
