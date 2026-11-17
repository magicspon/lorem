import * as stylex from '@stylexjs/stylex'

import { colors } from './tokens.stylex'

// The primary mixed down, so a flare tints rather than paints.
const tint = (percent: number) =>
  `color-mix(in oklab, ${colors.primary} ${percent}%, transparent)`

/**
 * The background images that give a surface its finish: the same few on every
 * card, sheet and header, so the polish reads as one system. Layer them in
 * `backgroundImage`, with `surfaceSizes` for their sizes.
 */
export const surfaces = stylex.defineVars({
  /** A hairline of light along a surface's top edge, brightest left of centre. */
  edge: `linear-gradient(90deg, transparent, ${tint(55)} 30%, transparent 75%)`,
  /** A soft glow from a surface's top-left corner. */
  glow: `radial-gradient(120% 90% at 0% 0%, ${tint(7)}, transparent 55%)`,
  /** A rule that runs out from the primary into the border, then fades. */
  rule: `linear-gradient(90deg, ${colors.primary}, ${colors.border} 18%, transparent)`,
})
