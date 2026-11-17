import * as stylex from '@stylexjs/stylex'

import { useLayout, type LayoutProps } from '#/layout/props/use-layout.ts'
import { colors, radii, size } from '../../styles/tokens.stylex'

const styles = stylex.create({
  dot: {
    display: 'inline-block',
    flexShrink: 0,
    borderRadius: radii.full,
  },
  inline: { width: size['2'], height: size['2'] },
  // Pinned to the top right of its parent, which a button already positions.
  corner: {
    position: 'absolute',
    top: size['1'],
    right: size['1'],
    width: size['1.5'],
    height: size['1.5'],
  },
})

const tones = stylex.create({
  primary: { backgroundColor: colors.primary },
  destructive: { backgroundColor: colors.destructive },
  success: { backgroundColor: colors.success },
  warning: { backgroundColor: colors.warning },
})

/** Props for `Dot`. */
type DotProps = LayoutProps<'span'> & {
  tone?: keyof typeof tones
  /** `corner` pins it to its parent's top right, as an unread marker on a button. */
  placement?: 'inline' | 'corner'
}

/**
 * A small coloured dot: a status, a colour key or an unread marker. Give it
 * an `aria-label` when it carries meaning; otherwise it is hidden.
 */
function Dot({ tone = 'primary', placement = 'inline', ...props }: DotProps) {
  return useLayout(
    'span',
    'dot',
    [styles.dot, styles[placement], tones[tone]],
    { 'aria-hidden': props['aria-label'] === undefined, ...props },
  )
}

export { Dot }
export type { DotProps }
