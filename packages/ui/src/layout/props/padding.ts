import * as stylex from '@stylexjs/stylex'

import { space } from '../../styles/tokens.stylex'

// Padding by space step: one atomic class per step, picked by key at runtime.
// StyleX needs a literal object in `create()`, so each map spells out its steps.

/** All sides. */
export const p = stylex.create({
  '0': { padding: space['0'] },
  '1': { padding: space['1'] },
  '2': { padding: space['2'] },
  '3': { padding: space['3'] },
  '4': { padding: space['4'] },
  '5': { padding: space['5'] },
  '6': { padding: space['6'] },
  '7': { padding: space['7'] },
  '8': { padding: space['8'] },
  '9': { padding: space['9'] },
})

/** Left and right. */
export const px = stylex.create({
  '0': { paddingInline: space['0'] },
  '1': { paddingInline: space['1'] },
  '2': { paddingInline: space['2'] },
  '3': { paddingInline: space['3'] },
  '4': { paddingInline: space['4'] },
  '5': { paddingInline: space['5'] },
  '6': { paddingInline: space['6'] },
  '7': { paddingInline: space['7'] },
  '8': { paddingInline: space['8'] },
  '9': { paddingInline: space['9'] },
})

/** Top and bottom. */
export const py = stylex.create({
  '0': { paddingBlock: space['0'] },
  '1': { paddingBlock: space['1'] },
  '2': { paddingBlock: space['2'] },
  '3': { paddingBlock: space['3'] },
  '4': { paddingBlock: space['4'] },
  '5': { paddingBlock: space['5'] },
  '6': { paddingBlock: space['6'] },
  '7': { paddingBlock: space['7'] },
  '8': { paddingBlock: space['8'] },
  '9': { paddingBlock: space['9'] },
})

/** Top. */
export const pt = stylex.create({
  '0': { paddingTop: space['0'] },
  '1': { paddingTop: space['1'] },
  '2': { paddingTop: space['2'] },
  '3': { paddingTop: space['3'] },
  '4': { paddingTop: space['4'] },
  '5': { paddingTop: space['5'] },
  '6': { paddingTop: space['6'] },
  '7': { paddingTop: space['7'] },
  '8': { paddingTop: space['8'] },
  '9': { paddingTop: space['9'] },
})

/** Right. */
export const pr = stylex.create({
  '0': { paddingRight: space['0'] },
  '1': { paddingRight: space['1'] },
  '2': { paddingRight: space['2'] },
  '3': { paddingRight: space['3'] },
  '4': { paddingRight: space['4'] },
  '5': { paddingRight: space['5'] },
  '6': { paddingRight: space['6'] },
  '7': { paddingRight: space['7'] },
  '8': { paddingRight: space['8'] },
  '9': { paddingRight: space['9'] },
})

/** Bottom. */
export const pb = stylex.create({
  '0': { paddingBottom: space['0'] },
  '1': { paddingBottom: space['1'] },
  '2': { paddingBottom: space['2'] },
  '3': { paddingBottom: space['3'] },
  '4': { paddingBottom: space['4'] },
  '5': { paddingBottom: space['5'] },
  '6': { paddingBottom: space['6'] },
  '7': { paddingBottom: space['7'] },
  '8': { paddingBottom: space['8'] },
  '9': { paddingBottom: space['9'] },
})

/** Left. */
export const pl = stylex.create({
  '0': { paddingLeft: space['0'] },
  '1': { paddingLeft: space['1'] },
  '2': { paddingLeft: space['2'] },
  '3': { paddingLeft: space['3'] },
  '4': { paddingLeft: space['4'] },
  '5': { paddingLeft: space['5'] },
  '6': { paddingLeft: space['6'] },
  '7': { paddingLeft: space['7'] },
  '8': { paddingLeft: space['8'] },
  '9': { paddingLeft: space['9'] },
})
