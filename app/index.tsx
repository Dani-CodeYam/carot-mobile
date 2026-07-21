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
import { t, useLang } from '@/lib/lang';

export default function HomeScreen() {
  const { lang } = useLang();

  return (
    <Screen centered>
      <HomeHeader welcome={t(lang, 'welcome')} />

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
