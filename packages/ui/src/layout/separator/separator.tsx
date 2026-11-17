import { Separator as SeparatorPrimitive } from '@base-ui/react/separator'
import * as stylex from '@stylexjs/stylex'

import { styleProps, type WithSx } from '#/lib/sx.ts'
import { colors, size } from '../../styles/tokens.stylex'

const styles = stylex.create({
  separator: {
    flexShrink: 0,
    backgroundColor: colors.border,
  },
  horizontal: { height: size.px, width: '100%' },
  vertical: { width: size.px, alignSelf: 'stretch' },
})

/** Props for `Separator`. */
type SeparatorProps = WithSx<SeparatorPrimitive.Props>

/** A thin dividing line. */
function Separator({
  style,
  sx,
  orientation = 'horizontal',
  ...props
}: SeparatorProps) {
  return (
    <SeparatorPrimitive
      data-slot="separator"
      orientation={orientation}
      {...styleProps([styles.separator, styles[orientation], sx], style)}
      {...props}
    />
  )
}

export { Separator }
export type { SeparatorProps }
