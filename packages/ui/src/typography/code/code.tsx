import * as stylex from '@stylexjs/stylex'

import { useLayout, type LayoutProps } from '#/layout/props/use-layout.ts'
import { colors, radii, space } from '../../styles/tokens.stylex'

const styles = stylex.create({
  // Slightly smaller than the text around it, since monospace reads large.
  code: {
    paddingInline: space['1'],
    borderRadius: radii.sm,
    backgroundColor: colors.muted,
    fontSize: '0.9em',
  },
  // A block keeps its line breaks and scrolls rather than wrapping.
  block: {
    display: 'block',
    padding: space['3'],
    borderRadius: radii.md,
    overflowX: 'auto',
    whiteSpace: 'pre',
  },
})

/** Props for `Code`. */
type CodeProps = LayoutProps<'code'> & {
  /** Set the code apart as its own block. Render it in a `pre`. */
  block?: boolean
}

/**
 * Code in monospace on a muted fill: a name inline in a sentence, or a
 * snippet as a block with `block` and `render={<pre />}`.
 */
function Code({ block, ...props }: CodeProps) {
  return useLayout('code', 'code', [styles.code, block && styles.block], props)
}

export { Code }
export type { CodeProps }
