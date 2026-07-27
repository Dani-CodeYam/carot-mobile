/**
 * Home — El Carot landing. Greeting, wordmark, a fan of cards, and the three
 * ways in, mirroring the web app: an open message, a specific question, and the
 * daily card. (Standalone/incremental: gallery and spreads come next.)
 */
import { router } from 'expo-router';
import { CardFan } from '@/components/CardFan';
import { HomeActions } from '@/components/HomeActions';
import { HomeHeader } from '@/components/HomeHeader';
import { Screen } from '@/components/Screen';
import { Wordmark } from '@/components/Wordmark';
import { greeting } from '@/lib/account';
import { useAuth } from '@/lib/auth';
import { t, useLang } from '@/lib/lang';

export default function HomeScreen() {
  const { lang } = useLang();
  const { session } = useAuth();

  return (
    <Screen centered>
      {/* Falls back to the plain welcome whenever there is no usable name —
          signed out, or signed in with a provider that withheld it. */}
      <HomeHeader
        welcome={greeting(session, t(lang, 'welcome'), t(lang, 'welcomeNamed'))}
      />

      <Wordmark />

      <CardFan />

      <HomeActions
        messageLabel={t(lang, 'messageEntry')}
        questionLabel={t(lang, 'questionEntry')}
        dailyLabel={t(lang, 'dailyEntry')}
        onMessage={() => router.push('/reading')}
        onQuestion={() => router.push('/question')}
        onDaily={() => router.push('/daily')}
      />
    </Screen>
  );
}
