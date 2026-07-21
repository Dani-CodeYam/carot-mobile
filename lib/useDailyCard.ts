/**
 * Today's card, its revealed state, and how many past cards there are.
 *
 * Wraps the async load so the daily screen doesn't hold the loading dance
 * itself. Reveal is optimistic — the card turns the instant you tap it and the
 * write follows, because waiting on storage to answer before flipping makes the
 * tap feel unresponsive, and a failed write costs at most one day's card.
 *
 * `historyCount` rather than the entries themselves: the screen only needs to
 * know whether the "ver cartas anteriores" way out is worth offering.
 */
import { useCallback, useEffect, useState } from 'react';
import type { Card } from '@/data/cards';
import { loadDaily, revealToday, type DailyDraw } from '@/lib/dailyCard';

export interface DailyCardState {
  card: Card | null;
  /** The day the card belongs to, as `YYYY-MM-DD`; null until loaded. */
  date: string | null;
  revealed: boolean;
  historyCount: number;
  reveal: () => void;
}

export function useDailyCard(): DailyCardState {
  const [draw, setDraw] = useState<DailyDraw | null>(null);
  const [card, setCard] = useState<Card | null>(null);
  const [historyCount, setHistoryCount] = useState(0);

  useEffect(() => {
    // Guarded so a load landing after the screen closes can't set state on an
    // unmounted component.
    let active = true;
    loadDaily().then((state) => {
      if (!active) return;
      setDraw(state.draw);
      setCard(state.card);
      setHistoryCount(state.history.length);
    });
    return () => {
      active = false;
    };
  }, []);

  const reveal = useCallback(() => {
    // Already open, or nothing loaded yet — either way there is nothing to do,
    // and re-revealing would rewrite storage for no reason.
    if (!draw || draw.revealed) return;
    setDraw({ ...draw, revealed: true });
    revealToday(draw);
  }, [draw]);

  return {
    card,
    date: draw?.date ?? null,
    revealed: draw?.revealed ?? false,
    historyCount,
    reveal,
  };
}
