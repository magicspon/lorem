import type * as React from 'react'
import * as stylex from '@stylexjs/stylex'

import { styleProps, type WithSx } from '#/lib/sx.ts'
import { animations } from '#/styles/animations.ts'
import { colors, radii, size } from '../../styles/tokens.stylex'

const styles = stylex.create({
  skeleton: {
    borderRadius: radii.xl,
    backgroundColor: colors.muted,
  },
})

// Widths in percent, so the lines read as text of varying length.
const variants = stylex.create({
  heading: { width: '50%', height: size['5'] },
  // The last of several lines is shorter, as a paragraph's last line is.
  text: {
    height: size['3'],
    width: { default: '70%', ':last-child:not(:first-child)': '45%' },
  },
  avatar: { width: size['8'], height: size['8'], borderRadius: radii.full },
  block: { width: '100%', aspectRatio: '16 / 9', borderRadius: radii['2xl'] },
})

/** Props for `Skeleton`. */
type SkeletonProps = WithSx<React.ComponentProps<'div'>> & {
  /** The shape it stands in for. Without one, size it with `sx`. */
  variant?: keyof typeof variants
}

/** A pulsing placeholder. */
function Skeleton({ style, sx, variant, ...props }: SkeletonProps) {
  return (
    <div
      data-slot="skeleton"
      {...styleProps(
        [animations.pulse, styles.skeleton, variant && variants[variant], sx],
        style,
      )}
      {...props}
    />
  )
}

export { Skeleton }
export type { SkeletonProps }
