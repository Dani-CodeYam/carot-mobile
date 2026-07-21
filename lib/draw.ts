/**
 * Drawing a card outside the daily ritual.
 *
 * Unlike the daily card — which is pinned to the date so it can't be rerolled
 * (see lib/dailyCard) — these draws are open. Both the message and the question
 * flow shuffle the deck and let you choose a card from the spread, so the
 * shuffle is the draw; nothing here picks a card for you.
 */
import { CAROT_CARDS, type Card } from '@/data/cards';

/**
 * The whole deck in random order, for the pick-your-own-card spread.
 *
 * Shuffling matters: the spread shows 22 identical backs, so if position 12
 * were always La Luna the "choice" would just be picking a number. Shuffled,
 * choosing a face-down card is a real draw — as at a table.
 *
 * Fisher-Yates, and deliberately not `sort(() => Math.random() - 0.5)`, which
 * is not a uniform shuffle and visibly favours leaving cards near where they
 * started.
 */
export function shuffledDeck(): Card[] {
  const deck = [...CAROT_CARDS];
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  return deck;
}

/**
 * The card a `?n=` deep link asks for, or null when the link doesn't name one.
 *
 * Null is the ordinary case, not an error: it means "no card was requested",
 * and the screen opens the spread instead. Anything that isn't a whole number
 * inside the deck — a word, a decimal, a negative, an index past the last card
 * — is treated the same way, since a bad link should still land you somewhere
 * sensible rather than on an error.
 */
export function cardFromParam(n: string | undefined): Card | null {
  if (n === undefined || n.trim() === '') return null;
  const index = Number(n);
  if (!Number.isInteger(index)) return null;
  return CAROT_CARDS[index] ?? null;
}
