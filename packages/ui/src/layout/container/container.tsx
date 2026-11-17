import * as stylex from '@stylexjs/stylex'

import { useLayout, type LayoutProps } from '#/layout/props/use-layout.ts'

// Widths past the size scale stay literal. Steps follow Radix Themes.
const styles = stylex.create({
  container: { width: '100%', marginInline: 'auto' },
  '1': { maxWidth: '28rem' },
  '2': { maxWidth: '43rem' },
  '3': { maxWidth: '55rem' },
  '4': { maxWidth: '71rem' },
  '5': { maxWidth: '87.5rem' },
})

// Centred by default; `start` and `end` hold it to one side of a wider parent.
const alignment = stylex.create({
  start: { marginInlineEnd: 'auto', marginInlineStart: 0 },
  center: {},
  end: { marginInlineStart: 'auto', marginInlineEnd: 0 },
})

/** Props for `Container`. */
type ContainerProps = LayoutProps<'div'> & {
  /** The maximum width, from 28rem (`1`) to 71rem (`4`), or 87.5rem (`5`). */
  size?: '1' | '2' | '3' | '4' | '5'
  /** Where it sits in a parent wider than its cap. */
  align?: keyof typeof alignment
}

/** Centres its content and caps its width. Pair it with `px` for a gutter. */
function Container({ size = '4', align = 'center', ...props }: ContainerProps) {
  return useLayout(
    'div',
    'container',
    [styles.container, styles[size], alignment[align]],
    props,
  )
}

export { Container }
export type { ContainerProps }
