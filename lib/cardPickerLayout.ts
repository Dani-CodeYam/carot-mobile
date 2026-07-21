/**
 * Where each card in the spread sits, and how it looks getting there.
 *
 * The spread is a fixed ring of slots that never move in the tree — the rail
 * "travels" by animating every slot at once. For a slot resting `offset` cards
 * from the centre, this gives the three samples an animation needs: how it
 * looks with the rail one card left, at rest, and one card right.
 *
 * Three samples are enough because every property below is linear between
 * whole-card positions, so interpolating across them reproduces the whole move
 * exactly. Kept separate from the component because it is plain arithmetic —
 * the part worth testing without rendering anything.
 */

export interface SpreadGeometry {
  /** Distance between neighbouring card centres, in px. */
  peek: number;
  /** How far below centre a side card hangs, in px. */
  drop: number;
  /** How far a side card tilts, in degrees. */
  tilt: number;
  /** Opacity of a side card; the centre one is always 1. */
  dim: number;
}

export interface SlotSamples {
  translateX: number[];
  translateY: number[];
  rotate: string[];
  opacity: number[];
}

/**
 * Past one card from the centre, nothing changes further — a card two out and
 * a card five out are both simply "at the side". Without this the tilt and the
 * dimming would keep compounding and the outer cards would end up upside-down
 * and invisible.
 */
export function clamp(value: number): number {
  return Math.max(-1, Math.min(1, value));
}

/**
 * The three sample positions for a slot: rail one card left, at rest, one card
 * right. Feed alongside an input range of [-peek, 0, peek].
 */
export function slotSamples(offset: number, geom: SpreadGeometry): SlotSamples {
  const at = [offset - 1, offset, offset + 1];

  return {
    translateX: at.map((o) => o * geom.peek),
    translateY: at.map((o) => Math.abs(clamp(o)) * geom.drop),
    rotate: at.map((o) => `${clamp(o) * geom.tilt}deg`),
    opacity: at.map((o) => geom.dim + (1 - geom.dim) * (1 - Math.abs(clamp(o)))),
  };
}
