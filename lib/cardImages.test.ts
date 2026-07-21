import { describe, expect, it } from '@jest/globals';
import { CAROT_CARDS } from '@/data/cards';
import { CARD_BACK, cardImage } from '@/lib/cardImages';

describe('cardImage', () => {
  // Every card in the deck must resolve to its own artwork — a card whose
  // image is missing would silently render as a face-down back while claiming
  // to be face-up.
  it('resolves artwork for all 22 cards', () => {
    for (const card of CAROT_CARDS) {
      expect(cardImage(card.img)).toBeDefined();
      expect(cardImage(card.img)).not.toBe(CARD_BACK);
    }
  });

  // An unknown filename falls back to the back rather than crashing the render.
  it('falls back to the card back for an unknown filename', () => {
    expect(cardImage('99-does-not-exist.png')).toBe(CARD_BACK);
    expect(cardImage('')).toBe(CARD_BACK);
  });
});
