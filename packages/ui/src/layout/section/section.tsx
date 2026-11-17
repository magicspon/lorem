import * as stylex from '@stylexjs/stylex'

import { space } from '../../styles/tokens.stylex'
import { useLayout, type LayoutProps } from '#/layout/props/use-layout.ts'

const styles = stylex.create({
  '1': { paddingBlock: space['5'] },
  '2': { paddingBlock: space['7'] },
  '3': { paddingBlock: space['9'] },
})

/** Props for `Section`. */
type SectionProps = LayoutProps<'section'> & {
  /** The vertical padding: 1.5rem (`1`), 2.5rem (`2`) or 4rem (`3`). */
  size?: keyof typeof styles
}

/** A `section` with vertical padding, to separate the parts of a page. */
function Section({ size = '3', ...props }: SectionProps) {
  return useLayout('section', 'section', [styles[size]], props)
}

export { Section }
export type { SectionProps }
