import { useLayout, type LayoutProps } from '#/layout/props/use-layout.ts'
import { typeStyles, type TypeProps } from '../type-styles'

/** Props for `Text`. */
type TextProps = LayoutProps<'span'> & TypeProps

/**
 * Body text. A `span` that inherits its size and colour unless told
 * otherwise; pass `render={<p />}` for a paragraph or `render={<div />}` for
 * a block. Takes the space props, as the layout primitives do.
 */
function Text({
  size,
  weight,
  tone,
  align,
  wrap,
  truncate,
  numeric,
  breakAnywhere,
  trim,
  ...props
}: TextProps) {
  return useLayout(
    'span',
    'text',
    typeStyles({
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
    props,
  )
}

export { Text }
export type { TextProps }
