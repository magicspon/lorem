import * as stylex from '@stylexjs/stylex'

import { space } from '../../styles/tokens.stylex'

// Margin by space step: one atomic class per step, picked by key at runtime.
// StyleX needs a literal object in `create()`, so each map spells out its steps.

/** All sides. */
export const m = stylex.create({
  '0': { margin: space['0'] },
  '1': { margin: space['1'] },
  '2': { margin: space['2'] },
  '3': { margin: space['3'] },
  '4': { margin: space['4'] },
  '5': { margin: space['5'] },
  '6': { margin: space['6'] },
  '7': { margin: space['7'] },
  '8': { margin: space['8'] },
  '9': { margin: space['9'] },
})

/** Left and right. */
export const mx = stylex.create({
  '0': { marginInline: space['0'] },
  '1': { marginInline: space['1'] },
  '2': { marginInline: space['2'] },
  '3': { marginInline: space['3'] },
  '4': { marginInline: space['4'] },
  '5': { marginInline: space['5'] },
  '6': { marginInline: space['6'] },
  '7': { marginInline: space['7'] },
  '8': { marginInline: space['8'] },
  '9': { marginInline: space['9'] },
})

/** Top and bottom. */
export const my = stylex.create({
  '0': { marginBlock: space['0'] },
  '1': { marginBlock: space['1'] },
  '2': { marginBlock: space['2'] },
  '3': { marginBlock: space['3'] },
  '4': { marginBlock: space['4'] },
  '5': { marginBlock: space['5'] },
  '6': { marginBlock: space['6'] },
  '7': { marginBlock: space['7'] },
  '8': { marginBlock: space['8'] },
  '9': { marginBlock: space['9'] },
})

/** Top. */
export const mt = stylex.create({
  '0': { marginTop: space['0'] },
  '1': { marginTop: space['1'] },
  '2': { marginTop: space['2'] },
  '3': { marginTop: space['3'] },
  '4': { marginTop: space['4'] },
  '5': { marginTop: space['5'] },
  '6': { marginTop: space['6'] },
  '7': { marginTop: space['7'] },
  '8': { marginTop: space['8'] },
  '9': { marginTop: space['9'] },
})

/** Right. */
export const mr = stylex.create({
  '0': { marginRight: space['0'] },
  '1': { marginRight: space['1'] },
  '2': { marginRight: space['2'] },
  '3': { marginRight: space['3'] },
  '4': { marginRight: space['4'] },
  '5': { marginRight: space['5'] },
  '6': { marginRight: space['6'] },
  '7': { marginRight: space['7'] },
  '8': { marginRight: space['8'] },
  '9': { marginRight: space['9'] },
})

/** Bottom. */
export const mb = stylex.create({
  '0': { marginBottom: space['0'] },
  '1': { marginBottom: space['1'] },
  '2': { marginBottom: space['2'] },
  '3': { marginBottom: space['3'] },
  '4': { marginBottom: space['4'] },
  '5': { marginBottom: space['5'] },
  '6': { marginBottom: space['6'] },
  '7': { marginBottom: space['7'] },
  '8': { marginBottom: space['8'] },
  '9': { marginBottom: space['9'] },
})

/** Left. */
export const ml = stylex.create({
  '0': { marginLeft: space['0'] },
  '1': { marginLeft: space['1'] },
  '2': { marginLeft: space['2'] },
  '3': { marginLeft: space['3'] },
  '4': { marginLeft: space['4'] },
  '5': { marginLeft: space['5'] },
  '6': { marginLeft: space['6'] },
  '7': { marginLeft: space['7'] },
  '8': { marginLeft: space['8'] },
  '9': { marginLeft: space['9'] },
})
