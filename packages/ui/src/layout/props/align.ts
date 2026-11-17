import * as stylex from '@stylexjs/stylex'

// Alignment shared by Flex, Stack and Grid. Keys are the prop values, so a
// prop's type is `keyof` its map and an unknown value is a type error.

/** `align-items`. */
export const align = stylex.create({
  start: { alignItems: 'flex-start' },
  center: { alignItems: 'center' },
  end: { alignItems: 'flex-end' },
  baseline: { alignItems: 'baseline' },
  stretch: { alignItems: 'stretch' },
})

/** `justify-content`. */
export const justify = stylex.create({
  start: { justifyContent: 'flex-start' },
  center: { justifyContent: 'center' },
  end: { justifyContent: 'flex-end' },
  between: { justifyContent: 'space-between' },
})

/** A value of the `align` prop. */
export type Align = keyof typeof align

/** A value of the `justify` prop. */
export type Justify = keyof typeof justify
