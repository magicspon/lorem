import * as stylex from '@stylexjs/stylex'

import { space } from '../../styles/tokens.stylex'

// Gap by space step: one atomic class per step, picked by key at runtime.
// StyleX needs a literal object in `create()`, so each map spells out its steps.

/** `gap`. */
export const gap = stylex.create({
  '0': { gap: space['0'] },
  '1': { gap: space['1'] },
  '2': { gap: space['2'] },
  '3': { gap: space['3'] },
  '4': { gap: space['4'] },
  '5': { gap: space['5'] },
  '6': { gap: space['6'] },
  '7': { gap: space['7'] },
  '8': { gap: space['8'] },
  '9': { gap: space['9'] },
})

/** `column-gap`. */
export const gapX = stylex.create({
  '0': { columnGap: space['0'] },
  '1': { columnGap: space['1'] },
  '2': { columnGap: space['2'] },
  '3': { columnGap: space['3'] },
  '4': { columnGap: space['4'] },
  '5': { columnGap: space['5'] },
  '6': { columnGap: space['6'] },
  '7': { columnGap: space['7'] },
  '8': { columnGap: space['8'] },
  '9': { columnGap: space['9'] },
})

/** `row-gap`. */
export const gapY = stylex.create({
  '0': { rowGap: space['0'] },
  '1': { rowGap: space['1'] },
  '2': { rowGap: space['2'] },
  '3': { rowGap: space['3'] },
  '4': { rowGap: space['4'] },
  '5': { rowGap: space['5'] },
  '6': { rowGap: space['6'] },
  '7': { rowGap: space['7'] },
  '8': { rowGap: space['8'] },
  '9': { rowGap: space['9'] },
})
