import * as stylex from '@stylexjs/stylex'

import { colors, radii } from '../../styles/tokens.stylex'
import { shadows } from '../../styles/shadows.stylex'

const styles = stylex.create({
  link: {
    textUnderlineOffset: 4,
    textDecorationLine: { default: 'none', ':hover': 'underline' },
    borderRadius: radii.sm,
    outline: 'none',
    boxShadow: {
      default: null,
      ':focus-visible': shadows.focusRing,
    },
  },
  // An inline link in running text is underlined, so it reads as a link
  // without relying on colour.
  inline: {
    textDecorationLine: 'underline',
    textDecorationColor: {
      default: `color-mix(in oklab, currentColor 40%, transparent)`,
      ':hover': 'currentColor',
    },
  },
})

const tones = stylex.create({
  // Keeps the text's colour: a title or table cell that is also a link.
  inherit: { color: 'inherit' },
  accent: { color: colors.primaryText },
  muted: {
    color: { default: colors.mutedForeground, ':hover': colors.foreground },
  },
})

/** Options for `linkStyles`. */
type LinkStyleOptions = {
  tone?: keyof typeof tones
  /** Underline at rest, for a link inside a sentence. */
  inline?: boolean
}

/**
 * The StyleX styles for a text link. A link stays a link: pass these to the
 * app's `Link` or an `a` as `sx={linkStyles()}`.
 */
function linkStyles({ tone = 'inherit', inline }: LinkStyleOptions = {}) {
  return [styles.link, tones[tone], inline && styles.inline] as const
}

export { linkStyles }
export type { LinkStyleOptions }
