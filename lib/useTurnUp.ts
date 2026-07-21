/**
 * Turns a chosen card face-up a beat after it arrives.
 *
 * Both the message and the question flow hand you a card you picked yourself,
 * and both want the same thing: the card lands face-down and *then* turns, so
 * the reveal is something you watch rather than something already done. Mount
 * it face-up and the flip animation never plays — you just arrive at an open
 * card, which reads as a missing step.
 *
 * Clearing the card (drawing again, asking again) puts it back face-down, so
 * the caller doesn't have to remember to reset a second piece of state.
 */
import { useEffect, useState } from 'react';
import type { Card } from '@/data/cards';

/** Long enough for the card to be on screen before it starts turning. */
export const TURN_DELAY_MS = 120;

export function useTurnUp(card: Card | null, delayMs = TURN_DELAY_MS): boolean {
  const [turned, setTurned] = useState(false);

  useEffect(() => {
    // Face-down first, on EVERY change of card — not only when the card is
    // cleared. Swapping one card straight for another would otherwise inherit
    // the previous card's face-up state and skip the flip entirely.
    setTurned(false);
    if (!card) return;

    const turn = setTimeout(() => setTurned(true), delayMs);
    return () => clearTimeout(turn);
  }, [card, delayMs]);

  return turned;
}
