import * as stylex from '@stylexjs/stylex'

import { space } from '../../styles/tokens.stylex'

// StyleX needs literal objects, so every value is spelled out per breakpoint;
// the four breakpoints of each prop follow one pattern.
//
// A responsive prop sets one custom property per breakpoint, and the element
// reads the nearest one at or below the viewport's width. A later StyleX style
// replaces an earlier one's whole property, so a breakpoint cannot be added as
// a second `flexDirection`; the custom properties sidestep that. `base` resets
// them to `initial` on the element itself, so it never inherits a parent's.

const SM = '@media (min-width: 40rem)'
const MD = '@media (min-width: 48rem)'
const LG = '@media (min-width: 64rem)'

const displayBase = stylex.create({
  base: {
    '--r-display-initial': 'initial',
    '--r-display-sm': 'initial',
    '--r-display-md': 'initial',
    '--r-display-lg': 'initial',
    display: {
      default: 'var(--r-display-initial)',
      [SM]: 'var(--r-display-sm, var(--r-display-initial))',
      [MD]: 'var(--r-display-md, var(--r-display-sm, var(--r-display-initial)))',
      [LG]: 'var(--r-display-lg, var(--r-display-md, var(--r-display-sm, var(--r-display-initial))))',
    },
  },
})

const displayInitial = stylex.create({
  none: { '--r-display-initial': 'none' },
  inline: { '--r-display-initial': 'inline' },
  'inline-block': { '--r-display-initial': 'inline-block' },
  block: { '--r-display-initial': 'block' },
  contents: { '--r-display-initial': 'contents' },
  flex: { '--r-display-initial': 'flex' },
  'inline-flex': { '--r-display-initial': 'inline-flex' },
  grid: { '--r-display-initial': 'grid' },
  'inline-grid': { '--r-display-initial': 'inline-grid' },
})

const displaySm = stylex.create({
  none: { '--r-display-sm': 'none' },
  inline: { '--r-display-sm': 'inline' },
  'inline-block': { '--r-display-sm': 'inline-block' },
  block: { '--r-display-sm': 'block' },
  contents: { '--r-display-sm': 'contents' },
  flex: { '--r-display-sm': 'flex' },
  'inline-flex': { '--r-display-sm': 'inline-flex' },
  grid: { '--r-display-sm': 'grid' },
  'inline-grid': { '--r-display-sm': 'inline-grid' },
})

const displayMd = stylex.create({
  none: { '--r-display-md': 'none' },
  inline: { '--r-display-md': 'inline' },
  'inline-block': { '--r-display-md': 'inline-block' },
  block: { '--r-display-md': 'block' },
  contents: { '--r-display-md': 'contents' },
  flex: { '--r-display-md': 'flex' },
  'inline-flex': { '--r-display-md': 'inline-flex' },
  grid: { '--r-display-md': 'grid' },
  'inline-grid': { '--r-display-md': 'inline-grid' },
})

const displayLg = stylex.create({
  none: { '--r-display-lg': 'none' },
  inline: { '--r-display-lg': 'inline' },
  'inline-block': { '--r-display-lg': 'inline-block' },
  block: { '--r-display-lg': 'block' },
  contents: { '--r-display-lg': 'contents' },
  flex: { '--r-display-lg': 'flex' },
  'inline-flex': { '--r-display-lg': 'inline-flex' },
  grid: { '--r-display-lg': 'grid' },
  'inline-grid': { '--r-display-lg': 'inline-grid' },
})

/** `display` by breakpoint. */
export const displayAt = {
  base: displayBase.base,
  initial: displayInitial,
  sm: displaySm,
  md: displayMd,
  lg: displayLg,
}

const directionBase = stylex.create({
  base: {
    '--r-direction-initial': 'initial',
    '--r-direction-sm': 'initial',
    '--r-direction-md': 'initial',
    '--r-direction-lg': 'initial',
    flexDirection: {
      default: 'var(--r-direction-initial)',
      [SM]: 'var(--r-direction-sm, var(--r-direction-initial))',
      [MD]: 'var(--r-direction-md, var(--r-direction-sm, var(--r-direction-initial)))',
      [LG]: 'var(--r-direction-lg, var(--r-direction-md, var(--r-direction-sm, var(--r-direction-initial))))',
    },
  },
})

const directionInitial = stylex.create({
  row: { '--r-direction-initial': 'row' },
  column: { '--r-direction-initial': 'column' },
  'row-reverse': { '--r-direction-initial': 'row-reverse' },
  'column-reverse': { '--r-direction-initial': 'column-reverse' },
})

const directionSm = stylex.create({
  row: { '--r-direction-sm': 'row' },
  column: { '--r-direction-sm': 'column' },
  'row-reverse': { '--r-direction-sm': 'row-reverse' },
  'column-reverse': { '--r-direction-sm': 'column-reverse' },
})

const directionMd = stylex.create({
  row: { '--r-direction-md': 'row' },
  column: { '--r-direction-md': 'column' },
  'row-reverse': { '--r-direction-md': 'row-reverse' },
  'column-reverse': { '--r-direction-md': 'column-reverse' },
})

const directionLg = stylex.create({
  row: { '--r-direction-lg': 'row' },
  column: { '--r-direction-lg': 'column' },
  'row-reverse': { '--r-direction-lg': 'row-reverse' },
  'column-reverse': { '--r-direction-lg': 'column-reverse' },
})

/** `flexDirection` by breakpoint. */
export const directionAt = {
  base: directionBase.base,
  initial: directionInitial,
  sm: directionSm,
  md: directionMd,
  lg: directionLg,
}

const gapBase = stylex.create({
  base: {
    '--r-gap-initial': 'initial',
    '--r-gap-sm': 'initial',
    '--r-gap-md': 'initial',
    '--r-gap-lg': 'initial',
    gap: {
      default: 'var(--r-gap-initial)',
      [SM]: 'var(--r-gap-sm, var(--r-gap-initial))',
      [MD]: 'var(--r-gap-md, var(--r-gap-sm, var(--r-gap-initial)))',
      [LG]: 'var(--r-gap-lg, var(--r-gap-md, var(--r-gap-sm, var(--r-gap-initial))))',
    },
  },
})

const gapInitial = stylex.create({
  '0': { '--r-gap-initial': space['0'] },
  '1': { '--r-gap-initial': space['1'] },
  '2': { '--r-gap-initial': space['2'] },
  '3': { '--r-gap-initial': space['3'] },
  '4': { '--r-gap-initial': space['4'] },
  '5': { '--r-gap-initial': space['5'] },
  '6': { '--r-gap-initial': space['6'] },
  '7': { '--r-gap-initial': space['7'] },
  '8': { '--r-gap-initial': space['8'] },
  '9': { '--r-gap-initial': space['9'] },
})

const gapSm = stylex.create({
  '0': { '--r-gap-sm': space['0'] },
  '1': { '--r-gap-sm': space['1'] },
  '2': { '--r-gap-sm': space['2'] },
  '3': { '--r-gap-sm': space['3'] },
  '4': { '--r-gap-sm': space['4'] },
  '5': { '--r-gap-sm': space['5'] },
  '6': { '--r-gap-sm': space['6'] },
  '7': { '--r-gap-sm': space['7'] },
  '8': { '--r-gap-sm': space['8'] },
  '9': { '--r-gap-sm': space['9'] },
})

const gapMd = stylex.create({
  '0': { '--r-gap-md': space['0'] },
  '1': { '--r-gap-md': space['1'] },
  '2': { '--r-gap-md': space['2'] },
  '3': { '--r-gap-md': space['3'] },
  '4': { '--r-gap-md': space['4'] },
  '5': { '--r-gap-md': space['5'] },
  '6': { '--r-gap-md': space['6'] },
  '7': { '--r-gap-md': space['7'] },
  '8': { '--r-gap-md': space['8'] },
  '9': { '--r-gap-md': space['9'] },
})

const gapLg = stylex.create({
  '0': { '--r-gap-lg': space['0'] },
  '1': { '--r-gap-lg': space['1'] },
  '2': { '--r-gap-lg': space['2'] },
  '3': { '--r-gap-lg': space['3'] },
  '4': { '--r-gap-lg': space['4'] },
  '5': { '--r-gap-lg': space['5'] },
  '6': { '--r-gap-lg': space['6'] },
  '7': { '--r-gap-lg': space['7'] },
  '8': { '--r-gap-lg': space['8'] },
  '9': { '--r-gap-lg': space['9'] },
})

/** `gap` by breakpoint. */
export const gapAt = {
  base: gapBase.base,
  initial: gapInitial,
  sm: gapSm,
  md: gapMd,
  lg: gapLg,
}

const columnsBase = stylex.create({
  base: {
    '--r-columns-initial': 'initial',
    '--r-columns-sm': 'initial',
    '--r-columns-md': 'initial',
    '--r-columns-lg': 'initial',
    gridTemplateColumns: {
      default: 'var(--r-columns-initial)',
      [SM]: 'var(--r-columns-sm, var(--r-columns-initial))',
      [MD]: 'var(--r-columns-md, var(--r-columns-sm, var(--r-columns-initial)))',
      [LG]: 'var(--r-columns-lg, var(--r-columns-md, var(--r-columns-sm, var(--r-columns-initial))))',
    },
  },
})

const columnsInitial = stylex.create({
  '1': { '--r-columns-initial': 'repeat(1, minmax(0, 1fr))' },
  '2': { '--r-columns-initial': 'repeat(2, minmax(0, 1fr))' },
  '3': { '--r-columns-initial': 'repeat(3, minmax(0, 1fr))' },
  '4': { '--r-columns-initial': 'repeat(4, minmax(0, 1fr))' },
  '5': { '--r-columns-initial': 'repeat(5, minmax(0, 1fr))' },
  '6': { '--r-columns-initial': 'repeat(6, minmax(0, 1fr))' },
  '7': { '--r-columns-initial': 'repeat(7, minmax(0, 1fr))' },
  '8': { '--r-columns-initial': 'repeat(8, minmax(0, 1fr))' },
  '9': { '--r-columns-initial': 'repeat(9, minmax(0, 1fr))' },
  '10': { '--r-columns-initial': 'repeat(10, minmax(0, 1fr))' },
  '11': { '--r-columns-initial': 'repeat(11, minmax(0, 1fr))' },
  '12': { '--r-columns-initial': 'repeat(12, minmax(0, 1fr))' },
})

const columnsSm = stylex.create({
  '1': { '--r-columns-sm': 'repeat(1, minmax(0, 1fr))' },
  '2': { '--r-columns-sm': 'repeat(2, minmax(0, 1fr))' },
  '3': { '--r-columns-sm': 'repeat(3, minmax(0, 1fr))' },
  '4': { '--r-columns-sm': 'repeat(4, minmax(0, 1fr))' },
  '5': { '--r-columns-sm': 'repeat(5, minmax(0, 1fr))' },
  '6': { '--r-columns-sm': 'repeat(6, minmax(0, 1fr))' },
  '7': { '--r-columns-sm': 'repeat(7, minmax(0, 1fr))' },
  '8': { '--r-columns-sm': 'repeat(8, minmax(0, 1fr))' },
  '9': { '--r-columns-sm': 'repeat(9, minmax(0, 1fr))' },
  '10': { '--r-columns-sm': 'repeat(10, minmax(0, 1fr))' },
  '11': { '--r-columns-sm': 'repeat(11, minmax(0, 1fr))' },
  '12': { '--r-columns-sm': 'repeat(12, minmax(0, 1fr))' },
})

const columnsMd = stylex.create({
  '1': { '--r-columns-md': 'repeat(1, minmax(0, 1fr))' },
  '2': { '--r-columns-md': 'repeat(2, minmax(0, 1fr))' },
  '3': { '--r-columns-md': 'repeat(3, minmax(0, 1fr))' },
  '4': { '--r-columns-md': 'repeat(4, minmax(0, 1fr))' },
  '5': { '--r-columns-md': 'repeat(5, minmax(0, 1fr))' },
  '6': { '--r-columns-md': 'repeat(6, minmax(0, 1fr))' },
  '7': { '--r-columns-md': 'repeat(7, minmax(0, 1fr))' },
  '8': { '--r-columns-md': 'repeat(8, minmax(0, 1fr))' },
  '9': { '--r-columns-md': 'repeat(9, minmax(0, 1fr))' },
  '10': { '--r-columns-md': 'repeat(10, minmax(0, 1fr))' },
  '11': { '--r-columns-md': 'repeat(11, minmax(0, 1fr))' },
  '12': { '--r-columns-md': 'repeat(12, minmax(0, 1fr))' },
})

const columnsLg = stylex.create({
  '1': { '--r-columns-lg': 'repeat(1, minmax(0, 1fr))' },
  '2': { '--r-columns-lg': 'repeat(2, minmax(0, 1fr))' },
  '3': { '--r-columns-lg': 'repeat(3, minmax(0, 1fr))' },
  '4': { '--r-columns-lg': 'repeat(4, minmax(0, 1fr))' },
  '5': { '--r-columns-lg': 'repeat(5, minmax(0, 1fr))' },
  '6': { '--r-columns-lg': 'repeat(6, minmax(0, 1fr))' },
  '7': { '--r-columns-lg': 'repeat(7, minmax(0, 1fr))' },
  '8': { '--r-columns-lg': 'repeat(8, minmax(0, 1fr))' },
  '9': { '--r-columns-lg': 'repeat(9, minmax(0, 1fr))' },
  '10': { '--r-columns-lg': 'repeat(10, minmax(0, 1fr))' },
  '11': { '--r-columns-lg': 'repeat(11, minmax(0, 1fr))' },
  '12': { '--r-columns-lg': 'repeat(12, minmax(0, 1fr))' },
})

/** `gridTemplateColumns` by breakpoint. */
export const columnsAt = {
  base: columnsBase.base,
  initial: columnsInitial,
  sm: columnsSm,
  md: columnsMd,
  lg: columnsLg,
}
