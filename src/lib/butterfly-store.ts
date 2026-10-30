/**
 * Butterfly continuity store.
 *
 * The butterfly is ONE continuous character across the whole website.
 * Section One keeps a single live DOM node (never destroys it) and, when the
 * visitor scrolls away, records where the butterfly left the viewport here.
 * Section Two (and beyond) should read `getState()` and continue flying the
 * SAME character from that point — render the same <Butterfly/> component
 * and keep the node mounted rather than re-creating it.
 */

export type ButterflyState = {
  /** True once the visitor scrolled away from Section One. */
  exited: boolean;
  /** Normalized exit position (0..1) of the butterfly's viewport point. */
  x: number;
  y: number;
};

const state: ButterflyState = { exited: false, x: 0.5, y: 0.5 };

export const BUTTERFLY_EXIT_EVENT = "senjun:butterfly-exited";

export const butterflyStore = {
  getState: (): ButterflyState => ({ ...state }),
  setExited(x: number, y: number) {
    state.exited = true;
    state.x = x;
    state.y = y;
  },
  reset() {
    state.exited = false;
  },
};
