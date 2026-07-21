/**
 * Carta del día — one card per day, locked in.
 *
 * The day's card is chosen from the date itself (see lib/dailyCard), so it
 * can't be rerolled. First visit of the day it arrives face-down and waits for
 * a tap; every visit after that it's already open, with a note that tomorrow
 * brings a new one.
 */
import { router } from 'expo-router';
import { CardReveal } from '@/components/CardReveal';
import { CardStage } from '@/components/CardStage';
import { DailyOutcome } from '@/components/DailyOutcome';
import { Screen } from '@/components/Screen';
import { ScreenHeader } from '@/components/ScreenHeader';
import { ScreenSubtitle } from '@/components/ScreenSubtitle';
import { ScreenTitle } from '@/components/ScreenTitle';
import { formatDay, t, useLang } from '@/lib/lang';
import { useDailyCard } from '@/lib/useDailyCard';

export default function DailyScreen() {
  const { lang } = useLang();
  const { card, date, revealed, historyCount, reveal } = useDailyCard();

  return (
    <Screen>
      <ScreenHeader />

      <ScreenTitle>{t(lang, 'dailyTitle')}</ScreenTitle>
      {date ? <ScreenSubtitle>{formatDay(date, lang)}</ScreenSubtitle> : null}

      <CardStage
        card={card}
        flipped={revealed}
        onPress={revealed ? undefined : reveal}
        hint={t(lang, 'tapToReveal')}
      />

      {revealed && card ? (
        <CardReveal card={card} lang={lang}>
          <DailyOutcome
            tomorrowNote={t(lang, 'comeBackTomorrow')}
            historyLabel={t(lang, 'seeHistory')}
            historyCount={historyCount}
            onSeeHistory={() => router.push('/history')}
          />
        </CardReveal>
      ) : null}
    </Screen>
  );
}
