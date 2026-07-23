/**
 * Carta del día — one card per day, locked in.
 *
 * The day's card is chosen from the date itself (see lib/dailyCard), so it
 * can't be rerolled. It arrives face-down and turns itself over a beat later —
 * opening the screen is the reveal, no tap required; every visit after that
 * it's already open, with a note that tomorrow brings a new one. Because
 * viewing reveals, the day's card is remembered in history once seen.
 */
import { useEffect } from 'react';
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

  // Turn the card over on its own once it has loaded face-down — a beat's
  // delay so the flip is seen rather than the card arriving already open.
  useEffect(() => {
    if (!card || revealed) return;
    const turn = setTimeout(reveal, 150);
    return () => clearTimeout(turn);
  }, [card, revealed, reveal]);

  return (
    <Screen>
      <ScreenHeader />

      <ScreenTitle>{t(lang, 'dailyTitle')}</ScreenTitle>
      {date ? <ScreenSubtitle>{formatDay(date, lang)}</ScreenSubtitle> : null}

      <CardStage card={card} flipped={revealed} />

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
