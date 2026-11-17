import * as stylex from '@stylexjs/stylex'

import { useLayout, type LayoutProps } from '#/layout/props/use-layout.ts'
import { colors, space } from '../../styles/tokens.stylex'
import { typeStyles, type TypeProps } from '../type-styles'

const styles = stylex.create({
  blockquote: {
    borderInlineStartWidth: 3,
    borderInlineStartStyle: 'solid',
    borderInlineStartColor: colors.border,
    paddingInlineStart: space['4'],
    color: colors.mutedForeground,
  },
})

/** Props for `Blockquote`. */
type BlockquoteProps = LayoutProps<'blockquote'> & TypeProps

/** A quotation set off from the text by a rule on its leading edge. */
function Blockquote({
  size,
  weight,
  tone,
  align,
  wrap,
  truncate,
  numeric,
  breakAnywhere,
  ...props
}: BlockquoteProps) {
  return useLayout(
    'blockquote',
    'blockquote',
    [
      styles.blockquote,
      ...typeStyles({
        size,
        weight,
        tone,
        align,
        wrap,
        truncate,
        numeric,
        breakAnywhere,
      }),
    ],
    props,
  )
}

export { Blockquote }
export type { BlockquoteProps }
