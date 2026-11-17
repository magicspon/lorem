import * as stylex from '@stylexjs/stylex'

import { useLayout, type LayoutProps } from '#/layout/props/use-layout.ts'
import { colors, radii, size, space } from '../../styles/tokens.stylex'
import { shadows } from '../../styles/shadows.stylex'
import { textStyles } from '../type-styles'

const styles = stylex.create({
  kbd: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: size['5'],
    height: size['5'],
    paddingInline: space['1'],
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: colors.border,
    borderRadius: radii.sm,
    backgroundColor: colors.muted,
    color: colors.mutedForeground,
    fontFamily: 'inherit',
    fontWeight: 500,
    // The lower edge reads as a key's side.
    boxShadow: shadows.edgeBottom,
  },
})

/** Props for `Kbd`. */
type KbdProps = LayoutProps<'kbd'>

/** A key, or a key combination, the user presses. */
function Kbd(props: KbdProps) {
  return useLayout('kbd', 'kbd', [textStyles['1'], styles.kbd], props)
}

export { Kbd }
export type { KbdProps }
