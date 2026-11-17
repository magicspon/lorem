import * as stylex from '@stylexjs/stylex'

import { colors } from './tokens.stylex'

// Mixes the shadow colour down, so each depth reads one token.
const shade = (percent: number) =>
  `color-mix(in oklab, ${colors.shadow} ${percent}%, transparent)`

/**
 * Every box shadow in the library. Write `shadows.x`, never a shadow literal.
 * A shadow's colour is a `light-dark()` from `colors`, which resolves where
 * the shadow is drawn, so one list serves both schemes.
 *
 * Steps follow Radix: focus rings on step 8, the hairline round a surface on
 * step 6, and elevation from `colors.shadow`, step 9. A surface that floats
 * draws a hairline as well, because on a dark page a shadow barely shows.
 */
export const shadows = stylex.defineVars({
  /** The halo of a focused control, with a `ring` border. */
  focusRing: `0 0 0 3px ${colors.focusRing}`,
  /** The halo of an `aria-invalid` or focused destructive control. */
  invalidRing: `0 0 0 3px ${colors.invalidRing}`,
  /** A ring of the page colour, keeping overlapped avatars apart. */
  backgroundRing: `0 0 0 2px ${colors.background}`,
  /** A selected card or choice, beside a `primary` border. */
  selected: `0 0 0 1px ${colors.primary}`,
  /** The hairline round a whole-card link, at rest, hovered and focused. */
  cardOutline: `0 0 0 1px ${colors.cardOutline}`,
  cardOutlineHover: `0 0 0 1px ${colors.cardOutlineHover}`,
  cardFocus: `0 0 0 1px ${colors.ring}, 0 0 0 4px ${colors.focusRing}`,
  /** The hairline round a dialog. */
  outline: `0 0 0 1px ${colors.menuRing}`,
  /** A floating panel: popover, select and combobox lists, submenus. */
  popup: `0 0 0 1px ${colors.menuRing}, 0 25px 50px -12px ${shade(55)}`,
  /** A dropdown menu. */
  menu: `0 0 0 1px ${colors.menuRing}, 0 25px 50px -12px ${shade(55)}`,
  /** A chart tooltip card. */
  tooltip: `0 0 0 1px ${colors.menuRing}, 0 10px 24px -12px ${shade(75)}`,
  /** The primary's light round a small lit mark, such as a header's label. */
  glow: `0 0 8px ${colors.primary}`,
  /** A surface lifted just off the page. Pair it with a `border`. */
  raised: `0 1px 3px 0 ${shade(25)}, 0 1px 2px -1px ${shade(25)}`,
  /** A toolbar floating over a canvas. Pair it with a `border`. */
  floating: `0 8px 24px ${shade(30)}`,
  /** A colour picker's thumb: dark hairlines either side of its white ring. */
  colorThumb: `0 0 0 1px ${shade(40)}, inset 0 0 0 1px ${shade(40)}`,
  /** The thumb with a focus halo round it. */
  colorThumbFocus: `0 0 0 1px ${shade(40)}, inset 0 0 0 1px ${shade(40)}, 0 0 0 4px ${colors.focusRing}`,
  /** The hairline inside a colour swatch, so a pale colour keeps its edge. */
  swatch: `inset 0 0 0 1px ${colors.menuRing}`,
  /** The ring round a picked swatch, apart from it by the panel's colour. */
  swatchSelected: `0 0 0 2px ${colors.popover}, 0 0 0 4px ${colors.ring}`,
  /** A border line drawn inside one edge, taking no room. */
  edgeRight: `inset -1px 0 0 ${colors.border}`,
  edgeLeft: `inset 1px 0 0 ${colors.border}`,
  edgeBottom: `inset 0 -1px 0 ${colors.border}`,
})
