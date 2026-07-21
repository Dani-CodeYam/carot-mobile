import { afterEach, beforeEach, describe, expect, it, jest } from '@jest/globals';
import { act, renderHook } from '@testing-library/react-native';
import { CAROT_CARDS, type Card } from '@/data/cards';
import { TURN_DELAY_MS, useTurnUp } from '@/lib/useTurnUp';

const CARD = CAROT_CARDS[0];
const OTHER = CAROT_CARDS[1];

beforeEach(() => {
  jest.useFakeTimers();
});

afterEach(() => {
  jest.useRealTimers();
});

describe('useTurnUp', () => {
  // With no card chosen there is nothing to turn.
  it('stays face-down when there is no card', () => {
    const { result } = renderHook(() => useTurnUp(null));
    act(() => {
      jest.advanceTimersByTime(TURN_DELAY_MS * 4);
    });
    expect(result.current).toBe(false);
  });

  // The card must be on screen face-down first — turning immediately would
  // skip the flip the whole reveal is built around.
  it('is still face-down in the moment the card arrives', () => {
    const { result } = renderHook(() => useTurnUp(CARD));
    expect(result.current).toBe(false);
  });

  // And still face-down partway through the delay.
  it('has not turned before the delay has elapsed', () => {
    const { result } = renderHook(() => useTurnUp(CARD));
    act(() => {
      jest.advanceTimersByTime(TURN_DELAY_MS - 1);
    });
    expect(result.current).toBe(false);
  });

  // Then it turns on its own, with no further interaction.
  it('turns face-up once the delay has elapsed', () => {
    const { result } = renderHook(() => useTurnUp(CARD));
    act(() => {
      jest.advanceTimersByTime(TURN_DELAY_MS);
    });
    expect(result.current).toBe(true);
  });

  // "Elegir otra carta" clears the card; the next one has to start face-down
  // again or the spread would reopen onto an already-revealed card.
  it('returns to face-down when the card is cleared', () => {
    const { result, rerender } = renderHook<boolean, { card: Card | null }>(
      ({ card }) => useTurnUp(card),
      { initialProps: { card: CARD } },
    );
    act(() => {
      jest.advanceTimersByTime(TURN_DELAY_MS);
    });
    expect(result.current).toBe(true);

    rerender({ card: null });
    expect(result.current).toBe(false);
  });

  // Choosing a different card re-runs the whole turn, rather than inheriting
  // the previous card's face-up state.
  it('turns again for a newly chosen card', () => {
    const { result, rerender } = renderHook<boolean, { card: Card | null }>(
      ({ card }) => useTurnUp(card),
      { initialProps: { card: CARD } },
    );
    act(() => {
      jest.advanceTimersByTime(TURN_DELAY_MS);
    });

    rerender({ card: OTHER });
    expect(result.current).toBe(false);
    act(() => {
      jest.advanceTimersByTime(TURN_DELAY_MS);
    });
    expect(result.current).toBe(true);
  });

  // Leaving the screen mid-turn must not leave a timer to fire into an
  // unmounted component.
  it('cancels a pending turn when unmounted', () => {
    const { unmount } = renderHook(() => useTurnUp(CARD));
    unmount();
    expect(() => {
      act(() => {
        jest.advanceTimersByTime(TURN_DELAY_MS * 2);
      });
    }).not.toThrow();
    expect(jest.getTimerCount()).toBe(0);
  });
});
