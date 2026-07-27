/**
 * Tu cuenta — the only screen where signing in happens, and it is optional.
 *
 * Reached from the menu, never forced: nothing in El Carot redirects here and
 * no route waits on a session. The screen has two faces — signed out it offers
 * the two providers plus a way straight back out, signed in it shows who you
 * are and how to leave.
 *
 * Both faces are the same route so the menu has one destination either way,
 * and so signing in or out lands you somewhere sensible instead of on a screen
 * that just emptied out.
 */
import { router } from 'expo-router';
import { AccountSummary } from '@/components/AccountSummary';
import { Screen } from '@/components/Screen';
import { ScreenHeader } from '@/components/ScreenHeader';
import { ScreenTitle } from '@/components/ScreenTitle';
import { SignInPanel } from '@/components/SignInPanel';
import { displayName } from '@/lib/account';
import { useAuth } from '@/lib/auth';
import { t, useLang } from '@/lib/lang';
import { goBackTo } from '@/lib/nav';

export default function LoginScreen() {
  const { lang } = useLang();
  const {
    session,
    error,
    appleUnavailable,
    googleUnavailable,
    signInWithApple,
    signInWithGoogle,
    signOut,
  } = useAuth();

  const leave = () => goBackTo('/');

  return (
    <Screen centered>
      <ScreenHeader back="/" />

      <ScreenTitle>{t(lang, 'loginTitle')}</ScreenTitle>

      {session ? (
        <AccountSummary
          name={displayName(session)}
          fallbackLabel={t(lang, 'signedInNoName')}
          intro={t(lang, 'signedInIntro')}
          signOutLabel={t(lang, 'signOutEntry')}
          onSignOut={signOut}
        />
      ) : (
        <SignInPanel
          intro={t(lang, 'loginIntro')}
          appleLabel={t(lang, 'continueApple')}
          googleLabel={t(lang, 'continueGoogle')}
          withoutLabel={t(lang, 'continueWithout')}
          // Apple's button is iOS-only; Google's needs client ids that live
          // outside the repo. Say which, rather than offering a dead button.
          appleNote={appleUnavailable ? t(lang, 'loginOnPhone') : null}
          googleNote={googleUnavailable ? t(lang, 'loginNotConfigured') : null}
          error={error ? t(lang, 'loginFailed') : null}
          onApple={signInWithApple}
          onGoogle={signInWithGoogle}
          onWithout={leave}
        />
      )}
    </Screen>
  );
}
