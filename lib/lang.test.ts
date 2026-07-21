import { describe, expect, it } from '@jest/globals';
import { formatDay, t } from '@/lib/lang';

describe('formatDay', () => {
  // The daily card's date line, in the reader's language.
  it('formats a day in Spanish', () => {
    expect(formatDay('2026-07-20', 'es')).toBe('Lunes, 20 de julio');
  });

  // The same day, read in English.
  it('formats a day in English', () => {
    expect(formatDay('2026-07-20', 'en')).toBe('Monday, July 20');
  });

  // Spanish lowercases weekdays and months; only the sentence starts capital.
  // CSS `capitalize` would give "Lunes, 20 De Julio", which is why this is
  // done in code.
  it('capitalizes only the first letter in Spanish', () => {
    const text = formatDay('2026-07-20', 'es');
    expect(text.startsWith('Lunes')).toBe(true);
    expect(text).toContain('de julio');
    expect(text).not.toContain('De Julio');
  });

  // A date string is parsed as a local calendar day, so the weekday cannot
  // drift by one across timezones.
  it('reads the date as a local day, not UTC', () => {
    expect(formatDay('2026-01-01', 'en')).toBe('Thursday, January 1');
  });

  // Single-digit days carry no padding once rendered.
  it('renders single-digit days without a leading zero', () => {
    expect(formatDay('2026-07-05', 'en')).toBe('Sunday, July 5');
  });
});

describe('t', () => {
  // Each language returns its own copy.
  it('returns the Spanish string for a key', () => {
    expect(t('es', 'dailyTitle')).toBe('Carta del día');
  });

  // The same key resolves to the English copy.
  it('returns the English string for the same key', () => {
    expect(t('en', 'dailyTitle')).toBe('Card of the day');
  });

  // Every key must exist in both languages — a missing one would render
  // `undefined` on screen rather than falling back.
  it('has a non-empty string for every key in both languages', () => {
    const keys = ['dailyTitle', 'tapToReveal', 'messageTitle', 'pickIntro',
      'questionTitle', 'askCards', 'drawAnother', 'askAnother', 'welcome',
      'messageEntry', 'questionEntry', 'historyTitle', 'seeHistory'] as const;
    for (const key of keys) {
      for (const lang of ['es', 'en'] as const) {
        expect(t(lang, key).length).toBeGreaterThan(0);
      }
    }
  });

  // The two languages must actually differ, or a key was copy-pasted.
  it('differs between languages for translated copy', () => {
    expect(t('es', 'messageEntry')).not.toBe(t('en', 'messageEntry'));
    expect(t('es', 'historyTitle')).not.toBe(t('en', 'historyTitle'));
  });
});
