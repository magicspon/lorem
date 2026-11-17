import * as stylex from '@stylexjs/stylex'

import { fontSize } from '../styles/tokens.stylex'

// Leading trimmed as on the type scale, so spacing measures from the glyphs.
const TRIM = 'trim-both cap alphabetic'

// At full scale the text is as wide as the window allows, up to this cap.
// The cap keeps a long word, at about 0.6em a letter in Geist Mono, inside
// the widest container.
const MAX_VW = 13
const MAX_REM = 8

const styles = stylex.create({
  // Token values are inlined only in static styles, not inside a dynamic
  // one's template, so the floor reaches the size through a variable.
  floor: { '--fluid-text-floor': fontSize['4'] },
  // The size follows the window, between step 4 of the type scale, below
  // which display text stops reading as the page's subject, and the cap.
  fluid: (scale: number, lineHeight: number) => ({
    fontSize: `max(var(--fluid-text-floor), min(${scale * MAX_VW}vw, ${scale * MAX_REM}rem))`,
    lineHeight,
    textBox: TRIM,
  }),
})

/**
 * Display text sized by `scale`, off the type scale, for text that should
 * fill the space it is given. `scale` runs from 0, the smallest (step 4),
 * to 1, a word or two filling the window. Lines sit tighter as text grows,
 * since large type needs less leading. Pass the result as `sx` to `Text`.
 */
export function fluidTextStyles(scale: number) {
  const clamped = Math.min(Math.max(scale, 0), 1)
  return [
    styles.floor,
    styles.fluid(clamped, 1.1 + 0.4 * (1 - clamped)),
  ] as const
}
