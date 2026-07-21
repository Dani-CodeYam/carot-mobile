import { describe, expect, it } from '@jest/globals';
import { CAROT_CARDS } from '@/data/cards';
import { cardFromParam, shuffledDeck } from '@/lib/draw';

describe('shuffledDeck', () => {
  // Every card is dealt exactly once — a spread that dropped or repeated a
  // card would let you choose one that cannot be revealed.
  it('returns all 22 arcana with no duplicates and no omissions', () => {
    const deck = shuffledDeck();
    expect(deck).toHaveLength(CAROT_CARDS.length);
    expect(new Set(deck.map((c) => c.n)).size).toBe(CAROT_CARDS.length);
  });

  // The source deck is module-level and shared; shuffling in place would
  // reorder it for the daily card and the gallery too.
  it('leaves the source deck untouched', () => {
    const before = CAROT_CARDS.map((c) => c.n);
    shuffledDeck();
    expect(CAROT_CARDS.map((c) => c.n)).toEqual(before);
  });

  // Two shuffles landing in the same order 22! times over is impossible in
  // practice, so identical results across several draws means it is not
  // actually shuffling.
  it('produces a different order across repeated draws', () => {
    const orders = new Set(
      Array.from({ length: 8 }, () => shuffledDeck().map((c) => c.n).join()),
    );
    expect(orders.size).toBeGreaterThan(1);
  });

  // Position must not predict the arcana, or choosing a face-down card would
  // just be picking a number.
  it('does not always put the same card first', () => {
    const firsts = new Set(Array.from({ length: 20 }, () => shuffledDeck()[0].n));
    expect(firsts.size).toBeGreaterThan(1);
  });
});

describe('cardFromParam', () => {
  // The ordinary case: no deep link, so the screen opens the spread.
  it('returns null when no index is given', () => {
    expect(cardFromParam(undefined)).toBeNull();
  });

  // A valid index names its card.
  it('returns the card at a valid index', () => {
    expect(cardFromParam('0')?.n).toBe(CAROT_CARDS[0].n);
    expect(cardFromParam('21')?.n).toBe(CAROT_CARDS[21].n);
  });

  // Past the end of the deck there is no card to show.
  it('returns null for an index beyond the last card', () => {
    expect(cardFromParam('22')).toBeNull();
    expect(cardFromParam('999')).toBeNull();
  });

  // A negative index must not wrap round to the end of the deck.
  it('returns null for a negative index', () => {
    expect(cardFromParam('-1')).toBeNull();
  });

  // Junk in the URL should land you on the spread, not an error.
  it('returns null for non-integer input', () => {
    expect(cardFromParam('abc')).toBeNull();
    expect(cardFromParam('1.5')).toBeNull();
    expect(cardFromParam('')).toBeNull();
    expect(cardFromParam('  ')).toBeNull();
  });
});
