import { useLayout, type LayoutProps } from '#/layout/props/use-layout.ts'
import { utilities } from '#/styles/utilities.ts'

/** Props for `VisuallyHidden`. */
type VisuallyHiddenProps = LayoutProps<'span'>

/**
 * Text a screen reader reads and the page does not show, such as the name of
 * an icon-only control. A `span`; pass `render={<p />}` or another element
 * when the text needs one.
 */
function VisuallyHidden(props: VisuallyHiddenProps) {
  return useLayout('span', 'visually-hidden', [utilities.srOnly], props)
}

export { VisuallyHidden }
export type { VisuallyHiddenProps }
