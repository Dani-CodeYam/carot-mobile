import { describe, expect, it } from '@jest/globals';
import {
  clamp,
  isHorizontalSwipe,
  slotSamples,
  type SpreadGeometry,
} from '@/lib/cardPickerLayout';

const GEOM: SpreadGeometry = { peek: 100, drop: 30, tilt: 6, dim: 0.7 };

describe('clamp', () => {
  // Inside the range a value is its own answer — the centre card and its
  // immediate neighbours must keep their exact positions.
  it('leaves values within one card either side untouched', () => {
    expect(clamp(0)).toBe(0);
    expect(clamp(1)).toBe(1);
    expect(clamp(-1)).toBe(-1);
    expect(clamp(0.5)).toBe(0.5);
  });

  // Outer cards must stop compounding, or they end up upside-down.
  it('caps anything further out at one card', () => {
    expect(clamp(2)).toBe(1);
    expect(clamp(-2)).toBe(-1);
    expect(clamp(99)).toBe(1);
  });
});

describe('slotSamples', () => {
  // Each property is sampled at rail-left, rest, rail-right.
  it('returns three samples for every property', () => {
    const s = slotSamples(0, GEOM);
    expect(s.translateX).toHaveLength(3);
    expect(s.translateY).toHaveLength(3);
    expect(s.rotate).toHaveLength(3);
    expect(s.opacity).toHaveLength(3);
  });

  // At rest the centre slot is dead centre, upright, undimmed and not dropped
  // — this is the frame the user actually chooses from.
  it('puts the centre slot at rest upright, centred and at full opacity', () => {
    const s = slotSamples(0, GEOM);
    expect(s.translateX[1]).toBe(0);
    expect(s.translateY[1]).toBe(0);
    expect(s.rotate[1]).toBe('0deg');
    expect(s.opacity[1]).toBe(1);
  });

  // A side card hangs lower, tilts outward and dims — the look the reference
  // spread has.
  it('drops, tilts and dims the neighbouring slots at rest', () => {
    const right = slotSamples(1, GEOM);
    expect(right.translateX[1]).toBe(100);
    expect(right.translateY[1]).toBe(30);
    expect(right.rotate[1]).toBe('6deg');
    expect(right.opacity[1]).toBeCloseTo(0.7);

    const left = slotSamples(-1, GEOM);
    expect(left.translateX[1]).toBe(-100);
    expect(left.rotate[1]).toBe('-6deg');
  });

  // The whole point of the rewrite: as the rail travels one card, the arriving
  // neighbour must land looking exactly like the centre card did — upright,
  // undimmed, not dropped. The earlier version snapped here instead.
  it('lands an arriving neighbour in the exact centre pose', () => {
    const arriving = slotSamples(1, GEOM);
    const centreAtRest = slotSamples(0, GEOM);

    // Rail travelled one card left: sample index 0 for the arriving slot.
    expect(arriving.translateX[0]).toBe(centreAtRest.translateX[1]);
    expect(arriving.translateY[0]).toBe(centreAtRest.translateY[1]);
    expect(arriving.rotate[0]).toBe(centreAtRest.rotate[1]);
    expect(arriving.opacity[0]).toBe(centreAtRest.opacity[1]);
  });

  // Symmetrically, the departing centre card must land exactly where the side
  // card was, so resetting the rail to the new index is invisible.
  it('sends the departing centre card into the exact side pose', () => {
    const centre = slotSamples(0, GEOM);
    const sideAtRest = slotSamples(-1, GEOM);

    expect(centre.translateX[0]).toBe(sideAtRest.translateX[1]);
    expect(centre.translateY[0]).toBe(sideAtRest.translateY[1]);
    expect(centre.rotate[0]).toBe(sideAtRest.rotate[1]);
    expect(centre.opacity[0]).toBeCloseTo(sideAtRest.opacity[1]);
  });

  // Outer slots are already fully tilted and dimmed, and stay that way while
  // they slide — only their position changes.
  it('holds outer slots at the capped tilt and dimming', () => {
    const outer = slotSamples(2, GEOM);
    expect(outer.rotate).toEqual(['6deg', '6deg', '6deg']);
    outer.opacity.forEach((o) => expect(o).toBeCloseTo(0.7));
    expect(outer.translateX).toEqual([100, 200, 300]);
  });
});

describe('isHorizontalSwipe', () => {
  // A tap, or the first pixel of any drag, is not yet an intent to move. The
  // spread must let those through or it swallows the tap that chooses a card.
  it('ignores a stationary or barely-moved finger', () => {
    expect(isHorizontalSwipe({ dx: 0, dy: 0 })).toBe(false);
    expect(isHorizontalSwipe({ dx: 5, dy: 0 })).toBe(false);
    expect(isHorizontalSwipe({ dx: -5, dy: 0 })).toBe(false);
  });

  // Past the threshold a sideways drag is claimed, in either direction —
  // the spread wraps, so neither edge is special.
  it('claims a clear sideways drag either way', () => {
    expect(isHorizontalSwipe({ dx: 7, dy: 0 })).toBe(true);
    expect(isHorizontalSwipe({ dx: -7, dy: 0 })).toBe(true);
    expect(isHorizontalSwipe({ dx: 60, dy: 10 })).toBe(true);
  });

  // The whole point of the predicate: a vertical drag belongs to the page,
  // which still has to scroll even when the finger started on the cards.
  it('leaves a vertical drag alone', () => {
    expect(isHorizontalSwipe({ dx: 0, dy: 40 })).toBe(false);
    expect(isHorizontalSwipe({ dx: 10, dy: 40 })).toBe(false);
    expect(isHorizontalSwipe({ dx: -10, dy: -40 })).toBe(false);
  });

  // Fingers do not travel in straight lines. Demanding a purely horizontal
  // drag rejected most real swipes, so a drag only has to be 1.2x more
  // sideways than not — 30 across and 20 down is a swipe, not a scroll.
  it('accepts a diagonal drag that is mostly sideways', () => {
    expect(isHorizontalSwipe({ dx: 30, dy: 20 })).toBe(true);
    expect(isHorizontalSwipe({ dx: -30, dy: 20 })).toBe(true);
  });

  // ...but not one that is merely sideways-ish. Just past parity still reads
  // as a diagonal scroll, and claiming it would fight the page.
  it('rejects a diagonal drag that is only slightly sideways', () => {
    expect(isHorizontalSwipe({ dx: 22, dy: 20 })).toBe(false);
  });
});
