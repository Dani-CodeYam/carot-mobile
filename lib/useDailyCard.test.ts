import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { renderHook, waitFor } from '@testing-library/react-native';
import { CAROT_CARDS } from '@/data/cards';
import { loadDaily, revealToday, type DailyState } from '@/lib/dailyCard';
import { useDailyCard } from '@/lib/useDailyCard';

jest.mock('@/lib/dailyCard', () => ({
  loadDaily: jest.fn(),
  revealToday: jest.fn(),
}));

const mockLoadDaily = loadDaily as jest.MockedFunction<typeof loadDaily>;
const mockRevealToday = revealToday as jest.MockedFunction<typeof revealToday>;

const CARD = CAROT_CARDS[3];

function state(overrides: Partial<DailyState> = {}): DailyState {
  return {
    draw: { date: '2026-07-20', n: CARD.n, revealed: false },
    card: CARD,
    history: [],
    isNew: true,
    ...overrides,
  };
}

beforeEach(() => {
  jest.clearAllMocks();
  mockLoadDaily.mockResolvedValue(state());
  mockRevealToday.mockImplementation(async (draw) => ({ ...draw, revealed: true }));
});

describe('useDailyCard', () => {
  // Storage is async, so the first frame has nothing yet — the screen must be
  // able to render that state rather than blanking.
  it('starts empty before storage answers', () => {
    const { result } = renderHook(() => useDailyCard());
    expect(result.current.card).toBeNull();
    expect(result.current.date).toBeNull();
    expect(result.current.revealed).toBe(false);
  });

  // Once loaded the card and its day are available.
  it('exposes the loaded card and its date', async () => {
    const { result } = renderHook(() => useDailyCard());
    await waitFor(() => expect(result.current.card).not.toBeNull());
    expect(result.current.card?.n).toBe(CARD.n);
    expect(result.current.date).toBe('2026-07-20');
  });

  // A card already opened earlier today stays open — the reveal is once a day,
  // not once a visit.
  it('reports an already-revealed card as revealed', async () => {
    mockLoadDaily.mockResolvedValue(
      state({ draw: { date: '2026-07-20', n: CARD.n, revealed: true }, isNew: false }),
    );
    const { result } = renderHook(() => useDailyCard());
    await waitFor(() => expect(result.current.revealed).toBe(true));
  });

  // Tapping turns the card immediately and records it.
  it('reveals optimistically and persists the reveal', async () => {
    const { result } = renderHook(() => useDailyCard());
    await waitFor(() => expect(result.current.card).not.toBeNull());

    result.current.reveal();

    await waitFor(() => expect(result.current.revealed).toBe(true));
    expect(mockRevealToday).toHaveBeenCalledTimes(1);
  });

  // Revealing an open card would rewrite storage for nothing.
  it('does not write again when the card is already revealed', async () => {
    mockLoadDaily.mockResolvedValue(
      state({ draw: { date: '2026-07-20', n: CARD.n, revealed: true }, isNew: false }),
    );
    const { result } = renderHook(() => useDailyCard());
    await waitFor(() => expect(result.current.revealed).toBe(true));

    result.current.reveal();
    expect(mockRevealToday).not.toHaveBeenCalled();
  });

  // Revealing before the load lands must not throw or write a draw that does
  // not exist yet.
  it('ignores a reveal that arrives before the card has loaded', () => {
    const { result } = renderHook(() => useDailyCard());
    expect(() => result.current.reveal()).not.toThrow();
    expect(mockRevealToday).not.toHaveBeenCalled();
  });

  // The screen offers "ver cartas anteriores" only when there is history.
  it('counts past cards', async () => {
    mockLoadDaily.mockResolvedValue(
      state({
        history: [
          { date: '2026-07-19', n: 1 },
          { date: '2026-07-18', n: 2 },
        ],
      }),
    );
    const { result } = renderHook(() => useDailyCard());
    await waitFor(() => expect(result.current.historyCount).toBe(2));
  });

  // A load that resolves after the screen closes must not set state.
  it('ignores a load that lands after unmount', async () => {
    const warn = jest.spyOn(console, 'error').mockImplementation(() => {});
    const { unmount } = renderHook(() => useDailyCard());
    unmount();
    await Promise.resolve();
    expect(warn).not.toHaveBeenCalled();
    warn.mockRestore();
  });
});
