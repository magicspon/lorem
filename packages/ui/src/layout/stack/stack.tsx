import {
  directionStyles,
  flexStyles,
  type FlexLayoutProps,
} from '#/layout/flex/flex.tsx'
import type { Responsive } from '#/layout/props/responsive.ts'
import { useLayout, type LayoutProps } from '#/layout/props/use-layout.ts'

/** Props for `Stack`. */
type StackProps = LayoutProps<'div'> &
  FlexLayoutProps & {
    /**
     * Turn the column into a row from a breakpoint up, such as a sidebar that
     * sits above the content on a phone: `direction={{ md: 'row' }}`.
     */
    direction?: Responsive<'column' | 'row'>
  }

/**
 * A column of children with a gap between them: `Flex direction="column"`
 * under a name that says what it is for.
 */
function Stack({
  display,
  direction,
  align,
  justify,
  wrap,
  gap,
  gapX,
  gapY,
  ...props
}: StackProps) {
  const own = flexStyles({ display, align, justify, wrap, gap, gapX, gapY })
  return useLayout(
    'div',
    'stack',
    [...own, ...directionStyles(direction, 'column')],
    props,
  )
}

export { Stack }
export type { StackProps }
