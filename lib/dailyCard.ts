/**
 * Carta del día — the one-card-per-day rule.
 *
 * The day's card is chosen deterministically from the date itself, so the same
 * calendar day always yields the same card and nothing has to be persisted just
 * to keep the draw stable. What IS persisted is whether the user has revealed
 * it yet, and the trail of days already lived through.
 *
 * Everything here is pure logic over `lib/storage` — no React, no rendering —
 * so the day-rollover rules can be unit-tested without mounting a screen.
 */
import { CAROT_CARDS, type Card } from '@/data/cards';
import { storage } from '@/lib/storage';

export const KEYS = {
  daily: 'elcarot.dailyCard',
  history: 'elcarot.history',
  lang: 'elcarot.lang',
  /**
   * Test/scenario seam. Never written by the app — when a scenario seeds it,
   * `today()` returns it instead of reading the clock, so a capture taken in
   * August still renders the day it was authored for.
   */
  todayOverride: 'elcarot.todayOverride',
} as const;

/** Today's draw. `revealed` flips once, on the first tap of the day. */
export interface DailyDraw {
  /** The calendar day this draw belongs to, YYYY-MM-DD. */
  date: string;
  /** Major-arcana index 0-21, keying into CAROT_CARDS. */
  n: number;
  revealed: boolean;
}

/** One past day, kept newest-first. */
export interface HistoryEntry {
  date: string;
  n: number;
}

/** Local calendar day as YYYY-MM-DD. Local, not UTC — the day turns over at
 *  the user's midnight, not Greenwich's. */
export function toDateKey(d: Date): string {
  const pad = (v: number) => String(v).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

/** The current day, honouring a seeded `todayOverride`. */
export async function today(): Promise<string> {
  const override = await storage.get<string | null>(KEYS.todayOverride, null);
  return override ?? toDateKey(new Date());
}

/**
 * The card belonging to a given date. Deterministic: a date maps to exactly one
 * card, forever. Uses a cheap string hash rather than randomness so the draw
 * survives a reinstall and can be asserted in tests.
 */
export function cardForDate(date: string): Card {
  let h = 0;
  for (let i = 0; i < date.length; i += 1) {
    h = (h * 31 + date.charCodeAt(i)) >>> 0;
  }
  return CAROT_CARDS[h % CAROT_CARDS.length];
}

/** Look up a card by its arcana index. Falls back to the first card if a
 *  stored index is out of range (corrupt or hand-edited storage). */
export function cardByIndex(n: number): Card {
  return CAROT_CARDS.find((c) => c.n === n) ?? CAROT_CARDS[0];
}

/** Newest-first, and never two entries for the same day. */
export function addToHistory(history: HistoryEntry[], entry: HistoryEntry): HistoryEntry[] {
  const withoutDay = history.filter((h) => h.date !== entry.date);
  return [entry, ...withoutDay].sort((a, b) => b.date.localeCompare(a.date));
}

export interface DailyState {
  draw: DailyDraw;
  card: Card;
  history: HistoryEntry[];
  /** True when this draw was created just now — the first visit of the day. */
  isNew: boolean;
}

/**
 * Load today's state, rolling the day over if the stored draw is stale.
 *
 * A stale draw that was revealed graduates into history; a stale draw the user
 * never opened is simply dropped — an unopened card was never really theirs.
 */
export async function loadDaily(): Promise<DailyState> {
  const day = await today();
  const stored = await storage.get<DailyDraw | null>(KEYS.daily, null);
  let history = await storage.get<HistoryEntry[]>(KEYS.history, []);

  if (stored && stored.date === day) {
    return { draw: stored, card: cardByIndex(stored.n), history, isNew: false };
  }

  if (stored && stored.revealed) {
    history = addToHistory(history, { date: stored.date, n: stored.n });
    await storage.set(KEYS.history, history);
  }

  const card = cardForDate(day);
  const draw: DailyDraw = { date: day, n: card.n, revealed: false };
  await storage.set(KEYS.daily, draw);
  return { draw, card, history, isNew: true };
}

/** Flip today's card face-up and remember that it happened. */
export async function revealToday(draw: DailyDraw): Promise<DailyDraw> {
  const revealed: DailyDraw = { ...draw, revealed: true };
  await storage.set(KEYS.daily, revealed);
  return revealed;
}

/** Past days only — today's card lives in `DailyState.draw`, not here. */
export async function loadHistory(): Promise<HistoryEntry[]> {
  return storage.get<HistoryEntry[]>(KEYS.history, []);
}
