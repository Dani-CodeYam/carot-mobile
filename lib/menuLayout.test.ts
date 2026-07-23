import { describe, expect, it } from '@jest/globals';
import { MENU_PANEL_MAX, menuPanelWidth } from '@/lib/menuLayout';

describe('menuPanelWidth', () => {
  // On a narrow phone the fraction wins — the panel is a slice of the screen,
  // leaving a strip of the page visible at the left edge.
  it('takes a fraction of the screen on a narrow phone', () => {
    expect(menuPanelWidth(320)).toBeCloseTo(320 * 0.82);
  });

  // A typical phone is still under the cap, so the fraction still governs.
  it('stays on the fraction just below the cap', () => {
    const width = menuPanelWidth(390);
    expect(width).toBeCloseTo(390 * 0.82);
    expect(width).toBeLessThan(MENU_PANEL_MAX);
  });

  // On a wide screen the fraction would exceed the cap, so the cap governs and
  // the panel stops growing.
  it('caps the panel on a tablet-width screen', () => {
    expect(menuPanelWidth(768)).toBe(MENU_PANEL_MAX);
  });

  // Right where the fraction meets the cap it should not exceed it.
  it('never returns more than the cap at the crossover width', () => {
    const crossover = MENU_PANEL_MAX / 0.82;
    expect(menuPanelWidth(crossover)).toBeCloseTo(MENU_PANEL_MAX);
    expect(menuPanelWidth(crossover + 50)).toBe(MENU_PANEL_MAX);
  });

  // A degenerate zero width collapses to zero rather than a negative or the cap.
  it('collapses to zero for a zero-width screen', () => {
    expect(menuPanelWidth(0)).toBe(0);
  });
});
