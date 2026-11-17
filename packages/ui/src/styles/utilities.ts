import * as stylex from '@stylexjs/stylex'

import { colors, fonts, size } from './tokens.stylex'

/** Small styles that several components reuse. */
export const utilities = stylex.create({
  /**
   * The page's own look, for the element a theme is applied to, so the
   * theme's colours and font reach everything inside it.
   */
  page: {
    fontFamily: fonts.sans,
    backgroundColor: colors.background,
    color: colors.foreground,
  },
  /** Hides content visually but keeps it for screen readers. */
  srOnly: {
    position: 'absolute',
    width: size.px,
    height: size.px,
    padding: 0,
    margin: `-${size.px}`,
    overflow: 'hidden',
    clip: 'rect(0, 0, 0, 0)',
    whiteSpace: 'nowrap',
    borderWidth: 0,
  },
})
