import * as stylex from '@stylexjs/stylex'

import { useLayout, type LayoutProps } from '#/layout/props/use-layout.ts'
import { fonts } from '../../styles/tokens.stylex'
import { typeStyles, type TextSize, type TypeProps } from '../type-styles'

const styles = stylex.create({
  heading: { fontFamily: fonts.heading, fontWeight: 600, textWrap: 'balance' },
  // Large type reads loose at the default tracking, so it is pulled in.
  tight: { letterSpacing: '-0.02em' },
})

const tags = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] as const

/** A heading level, which picks the element and nothing else. */
type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6

// The size a level gets when none is given.
const defaultSize = {
  1: '7',
  2: '6',
  3: '5',
  4: '4',
  5: '3',
  6: '2',
} as const satisfies Record<HeadingLevel, TextSize>

/** Props for `Heading`. */
type HeadingProps = LayoutProps<'h2'> &
  TypeProps & {
    /**
     * The heading's place in the document outline. It sets the element, and
     * the size only when `size` is not given.
     */
    level?: HeadingLevel
  }

/**
 * A heading. `level` keeps the outline correct and `size` sets the look, so a
 * page can use an `h2` that reads small, or an `h1` that reads modest.
 */
function Heading({
  level = 2,
  size = defaultSize[level],
  weight,
  tone,
  align,
  wrap,
  truncate,
  numeric,
  breakAnywhere,
  trim,
  ...props
}: HeadingProps) {
  return useLayout(
    tags[level - 1] ?? 'h2',
    'heading',
    [
      styles.heading,
      Number(size) >= 5 && styles.tight,
      ...typeStyles({
        size,
        weight,
        tone,
        align,
        wrap,
        truncate,
        numeric,
        breakAnywhere,
        trim,
      }),
    ],
    props,
  )
}

export { Heading }
export type { HeadingProps, HeadingLevel }
