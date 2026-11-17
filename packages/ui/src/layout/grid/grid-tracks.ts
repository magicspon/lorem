import * as stylex from '@stylexjs/stylex'

import { size } from '../../styles/tokens.stylex'

const LG = '@media (min-width: 64rem)'

// Equal tracks by count. StyleX needs a literal object in `create()`, so each
// count is spelled out. Unequal tracks are the named `templates`.

/** `grid-template-columns`: 1 to 12 equal columns. */
export const columns = stylex.create({
  '1': { gridTemplateColumns: 'repeat(1, minmax(0, 1fr))' },
  '2': { gridTemplateColumns: 'repeat(2, minmax(0, 1fr))' },
  '3': { gridTemplateColumns: 'repeat(3, minmax(0, 1fr))' },
  '4': { gridTemplateColumns: 'repeat(4, minmax(0, 1fr))' },
  '5': { gridTemplateColumns: 'repeat(5, minmax(0, 1fr))' },
  '6': { gridTemplateColumns: 'repeat(6, minmax(0, 1fr))' },
  '7': { gridTemplateColumns: 'repeat(7, minmax(0, 1fr))' },
  '8': { gridTemplateColumns: 'repeat(8, minmax(0, 1fr))' },
  '9': { gridTemplateColumns: 'repeat(9, minmax(0, 1fr))' },
  '10': { gridTemplateColumns: 'repeat(10, minmax(0, 1fr))' },
  '11': { gridTemplateColumns: 'repeat(11, minmax(0, 1fr))' },
  '12': { gridTemplateColumns: 'repeat(12, minmax(0, 1fr))' },
})

/**
 * Named templates of unequal tracks. `main-aside` is one column, then a wide
 * one and a narrow one from `lg` up; `label-value` sizes its first column to
 * the longest label, as a list of terms and details.
 */
export const templates = stylex.create({
  'main-aside': {
    gridTemplateColumns: {
      default: 'minmax(0, 1fr)',
      [LG]: 'minmax(0, 2fr) minmax(0, 1fr)',
    },
  },
  'label-value': { gridTemplateColumns: 'auto 1fr' },
})

/** `grid-template-rows`: 1 to 6 equal rows. */
export const rows = stylex.create({
  '1': { gridTemplateRows: 'repeat(1, minmax(0, 1fr))' },
  '2': { gridTemplateRows: 'repeat(2, minmax(0, 1fr))' },
  '3': { gridTemplateRows: 'repeat(3, minmax(0, 1fr))' },
  '4': { gridTemplateRows: 'repeat(4, minmax(0, 1fr))' },
  '5': { gridTemplateRows: 'repeat(5, minmax(0, 1fr))' },
  '6': { gridTemplateRows: 'repeat(6, minmax(0, 1fr))' },
})

/**
 * `grid-template-columns` that fits as many columns as it can, none narrower
 * than the step (12rem to 24rem). `auto-fit` lets a short row's children
 * share its width, and `min()` lets one column shrink below the step on a
 * screen narrower than it.
 */
export const minChildWidth = stylex.create({
  '48': {
    gridTemplateColumns: `repeat(auto-fit, minmax(min(${size['48']}, 100%), 1fr))`,
  },
  '56': {
    gridTemplateColumns: `repeat(auto-fit, minmax(min(${size['56']}, 100%), 1fr))`,
  },
  '64': {
    gridTemplateColumns: `repeat(auto-fit, minmax(min(${size['64']}, 100%), 1fr))`,
  },
  '72': {
    gridTemplateColumns: `repeat(auto-fit, minmax(min(${size['72']}, 100%), 1fr))`,
  },
  '80': {
    gridTemplateColumns: `repeat(auto-fit, minmax(min(${size['80']}, 100%), 1fr))`,
  },
  '96': {
    gridTemplateColumns: `repeat(auto-fit, minmax(min(${size['96']}, 100%), 1fr))`,
  },
})

/**
 * Like `minChildWidth`, but a column never grows past the step, so a short
 * row of cards keeps their width and starts at the left.
 */
export const cappedChildWidth = stylex.create({
  '80': {
    gridTemplateColumns: `repeat(auto-fill, minmax(min(${size['80']}, 100%), ${size['80']}))`,
  },
})
