import { describe, expect, it } from '@jest/globals';
import { CAROT_CARDS, cardText } from '@/data/cards';

const CARD = CAROT_CARDS[0];

describe('cardText', () => {
  // Spanish is the deck's own language — the field is used as written.
  it('returns the Spanish text unchanged', () => {
    expect(cardText(CARD, 'meaning', 'es')).toBe(CARD.meaning);
    expect(cardText(CARD, 'quote', 'es')).toBe(CARD.quote);
  });

  // English reads from the parallel `_en` fields.
  it('returns the English translation when asked for English', () => {
    expect(cardText(CARD, 'meaning', 'en')).toBe(CARD.meaning_en);
    expect(cardText(CARD, 'quote', 'en')).toBe(CARD.quote_en);
  });

  // A missing translation falls back to Spanish rather than rendering blank —
  // an untranslated card should still say something.
  it('falls back to Spanish when a translation is empty', () => {
    const partial = { ...CARD, meaning_en: '' };
    expect(cardText(partial, 'meaning', 'en')).toBe(CARD.meaning);
  });

  // Every card in the deck must have text in both languages.
  it('has non-empty text for all 22 cards in both languages', () => {
    for (const card of CAROT_CARDS) {
      for (const lang of ['es', 'en'] as const) {
        expect(cardText(card, 'meaning', lang).length).toBeGreaterThan(0);
        expect(cardText(card, 'quote', lang).length).toBeGreaterThan(0);
      }
    }
  });
});
