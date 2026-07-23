/**
 * How wide the slide-in menu panel should be for a given screen width.
 *
 * The panel takes most of the screen but never all of it — a strip of the
 * covered screen stays visible at the left edge so the menu reads as laid over
 * the page rather than a new one. It's capped at a comfortable column width so
 * it doesn't sprawl edge-to-edge on a tablet.
 */

/** The widest the panel is ever allowed to get, in px. */
export const MENU_PANEL_MAX = 320;

/** The share of the screen the panel wants when that's under the cap. */
export const MENU_PANEL_FRACTION = 0.82;

export function menuPanelWidth(screenWidth: number): number {
  return Math.min(MENU_PANEL_MAX, screenWidth * MENU_PANEL_FRACTION);
}
