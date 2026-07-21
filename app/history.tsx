/**
 * Cartas anteriores — the trail of daily cards already lived through.
 *
 * A day lands here once it rolls over (see lib/dailyCard), newest first. One
 * row can be open at a time: opening another closes the last, so the list never
 * becomes a wall of meanings to scroll past.
 */
import { useEffect, useState } from 'react';
import { HistoryEmpty } from '@/components/HistoryEmpty';
import { HistoryRow } from '@/components/HistoryRow';
import { Screen } from '@/components/Screen';
import { ScreenHeader } from '@/components/ScreenHeader';
import { ScreenTitle } from '@/components/ScreenTitle';
import { cardByIndex, loadHistory, type HistoryEntry } from '@/lib/dailyCard';
import { formatDay, t, useLang } from '@/lib/lang';

export default function HistoryScreen() {
  const { lang } = useLang();
  const [history, setHistory] = useState<HistoryEntry[] | null>(null);
  const [openDate, setOpenDate] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    loadHistory().then((entries) => {
      if (active) setHistory(entries);
    });
    return () => {
      active = false;
    };
  }, []);

  return (
    <Screen>
      {/* Back goes to the daily card, not Home — history is reached from there. */}
      <ScreenHeader back="/daily" />

      <ScreenTitle>{t(lang, 'historyTitle')}</ScreenTitle>

      {history?.length === 0 ? (
        <HistoryEmpty
          message={t(lang, 'historyEmpty')}
          hint={t(lang, 'historyEmptyHint')}
        />
      ) : null}

      {history?.map((entry) => (
        <HistoryRow
          key={entry.date}
          card={cardByIndex(entry.n)}
          day={formatDay(entry.date, lang)}
          lang={lang}
          open={openDate === entry.date}
          onToggle={() =>
            setOpenDate(openDate === entry.date ? null : entry.date)
          }
        />
      ))}
    </Screen>
  );
}
