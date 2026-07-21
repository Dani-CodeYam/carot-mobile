import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { CAROT_CARDS } from '@/data/cards';
import {
  KEYS,
  addToHistory,
  cardByIndex,
  cardForDate,
  loadDaily,
  loadHistory,
  revealToday,
  toDateKey,
  today,
  type HistoryEntry,
} from '@/lib/dailyCard';
import { storage } from '@/lib/storage';

jest.mock('@/lib/storage', () => {
  const store = new Map<string, unknown>();
  return {
    storage: {
      get: jest.fn(async (key: string, fallback: unknown) =>
        store.has(key) ? store.get(key) : fallback,
      ),
      set: jest.fn(async (key: string, value: unknown) => {
        store.set(key, value);
      }),
      remove: jest.fn(async (key: string) => {
        store.delete(key);
      }),
      __store: store,
    },
  };
});

const store = (storage as unknown as { __store: Map<string, unknown> }).__store;

beforeEach(() => {
  store.clear();
  jest.clearAllMocks();
});

describe('toDateKey', () => {
  // Local calendar day, not UTC — the day turns over at the user's midnight.
  it('formats a date as YYYY-MM-DD', () => {
    expect(toDateKey(new Date(2026, 6, 20))).toBe('2026-07-20');
  });

  // Single-digit months and days are zero-padded so keys sort lexically.
  it('zero-pads single-digit months and days', () => {
    expect(toDateKey(new Date(2026, 0, 5))).toBe('2026-01-05');
  });

  // Just before midnight is still today, in local time.
  it('uses the local day, not UTC', () => {
    expect(toDateKey(new Date(2026, 11, 31, 23, 59))).toBe('2026-12-31');
  });
});

describe('cardForDate', () => {
  // The whole promise of the daily card: a date maps to one card, forever.
  it('is deterministic for a given date', () => {
    expect(cardForDate('2026-07-20').n).toBe(cardForDate('2026-07-20').n);
  });

  // Different days should not all land on the same card.
  it('spreads different dates across different cards', () => {
    const days = Array.from({ length: 30 }, (_, i) => `2026-07-${String(i + 1).padStart(2, '0')}`);
    expect(new Set(days.map((d) => cardForDate(d).n)).size).toBeGreaterThan(1);
  });

  // Whatever the date, the result is always a real card in the deck.
  it('always returns a card from the deck', () => {
    for (const date of ['1999-01-01', '2026-07-20', '2100-12-31']) {
      expect(CAROT_CARDS).toContain(cardForDate(date));
    }
  });
});

describe('cardByIndex', () => {
  // The stored draw keeps an arcana index; it must resolve back to its card.
  it('finds the card with the given arcana number', () => {
    expect(cardByIndex(8).n).toBe(8);
    expect(cardByIndex(0).n).toBe(0);
  });

  // Corrupt or hand-edited storage must not crash the screen.
  it('falls back to the first card for an out-of-range index', () => {
    expect(cardByIndex(999)).toBe(CAROT_CARDS[0]);
    expect(cardByIndex(-1)).toBe(CAROT_CARDS[0]);
  });
});

describe('addToHistory', () => {
  // Newest day first, so the trail reads backwards from today.
  it('keeps entries newest-first', () => {
    const history = addToHistory([{ date: '2026-07-18', n: 1 }], { date: '2026-07-19', n: 2 });
    expect(history.map((h) => h.date)).toEqual(['2026-07-19', '2026-07-18']);
  });

  // Re-adding a day replaces it rather than duplicating the row.
  it('never keeps two entries for the same day', () => {
    const history = addToHistory([{ date: '2026-07-19', n: 1 }], { date: '2026-07-19', n: 5 });
    expect(history).toHaveLength(1);
    expect(history[0].n).toBe(5);
  });

  // An out-of-order arrival still sorts into place.
  it('sorts an older entry into position', () => {
    const existing: HistoryEntry[] = [
      { date: '2026-07-19', n: 1 },
      { date: '2026-07-17', n: 3 },
    ];
    const history = addToHistory(existing, { date: '2026-07-18', n: 2 });
    expect(history.map((h) => h.date)).toEqual(['2026-07-19', '2026-07-18', '2026-07-17']);
  });

  // The first card ever recorded starts the trail.
  it('handles an empty history', () => {
    expect(addToHistory([], { date: '2026-07-19', n: 1 })).toHaveLength(1);
  });
});

describe('today', () => {
  // Without a seeded override it reads the clock.
  it('returns the real day when nothing is seeded', async () => {
    expect(await today()).toBe(toDateKey(new Date()));
  });

  // The scenario seam: a seeded day wins, so a capture taken in August still
  // renders the day it was authored for.
  it('honours a seeded override', async () => {
    store.set(KEYS.todayOverride, '2026-07-20');
    expect(await today()).toBe('2026-07-20');
  });
});

describe('loadDaily', () => {
  // First visit ever: a card is drawn for today and stored face-down.
  it('creates a new face-down draw when nothing is stored', async () => {
    store.set(KEYS.todayOverride, '2026-07-20');
    const state = await loadDaily();
    expect(state.isNew).toBe(true);
    expect(state.draw.date).toBe('2026-07-20');
    expect(state.draw.revealed).toBe(false);
    expect(state.card.n).toBe(cardForDate('2026-07-20').n);
  });

  // Returning the same day gives back the same draw, still open if it was.
  it('returns the stored draw when it belongs to today', async () => {
    store.set(KEYS.todayOverride, '2026-07-20');
    store.set(KEYS.daily, { date: '2026-07-20', n: 8, revealed: true });
    const state = await loadDaily();
    expect(state.isNew).toBe(false);
    expect(state.draw.revealed).toBe(true);
    expect(state.card.n).toBe(8);
  });

  // A stale card that was opened graduates into the trail.
  it('moves a revealed stale draw into history', async () => {
    store.set(KEYS.todayOverride, '2026-07-20');
    store.set(KEYS.daily, { date: '2026-07-19', n: 3, revealed: true });
    const state = await loadDaily();
    expect(state.isNew).toBe(true);
    expect(state.history).toEqual([{ date: '2026-07-19', n: 3 }]);
  });

  // A stale card never opened is simply dropped — it was never really yours.
  it('discards a stale draw that was never revealed', async () => {
    store.set(KEYS.todayOverride, '2026-07-20');
    store.set(KEYS.daily, { date: '2026-07-19', n: 3, revealed: false });
    const state = await loadDaily();
    expect(state.history).toEqual([]);
  });
});

describe('revealToday', () => {
  // Flipping the card face-up records it, so a reload keeps it open.
  it('marks the draw revealed and persists it', async () => {
    const draw = { date: '2026-07-20', n: 8, revealed: false };
    const revealed = await revealToday(draw);
    expect(revealed.revealed).toBe(true);
    expect(store.get(KEYS.daily)).toEqual(revealed);
  });

  // The passed-in draw is not mutated.
  it('leaves the original draw untouched', async () => {
    const draw = { date: '2026-07-20', n: 8, revealed: false };
    await revealToday(draw);
    expect(draw.revealed).toBe(false);
  });
});

describe('loadHistory', () => {
  // Before any day has rolled over the trail is empty, not undefined.
  it('returns an empty list when nothing is stored', async () => {
    expect(await loadHistory()).toEqual([]);
  });

  // Otherwise it hands back what was recorded.
  it('returns the stored entries', async () => {
    const entries = [{ date: '2026-07-19', n: 1 }];
    store.set(KEYS.history, entries);
    expect(await loadHistory()).toEqual(entries);
  });
});
