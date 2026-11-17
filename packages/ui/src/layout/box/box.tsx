import { display as displays } from '#/layout/props/display.ts'
import { responsiveStyles, type Responsive } from '#/layout/props/responsive.ts'
import * as responsive from '#/layout/props/responsive-styles.ts'
import { useLayout, type LayoutProps } from '#/layout/props/use-layout.ts'

/** A `display` a `Box` takes. */
type BoxDisplay = 'none' | 'inline' | 'inline-block' | 'block' | 'contents'

/** Props for `Box`. */
type BoxProps = LayoutProps<'div'> & {
  /** Hide or show it by breakpoint: `display={{ initial: 'none', md: 'block' }}`. */
  display?: Responsive<BoxDisplay>
}

/**
 * The plainest layout primitive: a `div` with the space props. Use it to pad,
 * offset or hide one thing. Pass `render` to use another element.
 */
function Box({ display, ...props }: BoxProps) {
  return useLayout(
    'div',
    'box',
    // A responsive display needs a value below its first breakpoint.
    responsiveStyles(
      display,
      displays,
      responsive.displayAt,
      typeof display === 'object' ? 'block' : undefined,
    ),
    props,
  )
}

export { Box }
export type { BoxDisplay, BoxProps }
