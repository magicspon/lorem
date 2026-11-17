import { Checkbox as CheckboxPrimitive } from '@base-ui/react/checkbox'
import * as stylex from '@stylexjs/stylex'
import { CheckIcon } from 'lucide-react'

import { styleProps, type WithSx } from '#/lib/sx.ts'
import { colors, motion, radii, size } from '../../styles/tokens.stylex'
import { shadows } from '../../styles/shadows.stylex'

// Base UI renders a span, which never matches `:disabled`, and marks it
// with `data-disabled` instead.
const DISABLED = ':is([data-disabled])'

const styles = stylex.create({
  root: {
    position: 'relative',
    display: 'flex',
    width: size['4'],
    height: size['4'],
    flexShrink: 0,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 0,
    borderRadius: radii.xl,
    borderWidth: 1,
    borderStyle: 'solid',
    // Mutually exclusive, so no condition depends on rule order: an error
    // border beats focus, and focus beats checked.
    borderColor: {
      default: colors.input,
      ':is([data-checked]):not(:focus-visible, [aria-invalid=true])':
        colors.primary,
      ':focus-visible:not([aria-invalid=true])': colors.ring,
      ':is([aria-invalid=true]):not([aria-checked=true])': colors.invalidBorder,
      ':is([aria-invalid=true][aria-checked=true])': colors.primary,
    },
    boxShadow: {
      default: null,
      ':focus-visible': shadows.focusRing,
      ':is([aria-invalid=true])': shadows.invalidRing,
    },
    backgroundColor: {
      default: colors.checkboxBackground,
      ':hover:not([data-checked], [data-disabled])': colors.controlHover,
      ':is([data-checked])': colors.primary,
    },
    color: { default: null, ':is([data-checked])': colors.primaryForeground },
    transitionProperty: 'box-shadow',
    transitionDuration: motion.normal,
    transitionTimingFunction: motion.ease,
    outline: 'none',
    cursor: { default: null, [DISABLED]: 'not-allowed' },
    opacity: { default: null, [DISABLED]: 0.5 },
    // A larger hit area than the visible box.
    '::after': {
      content: '""',
      position: 'absolute',
      insetInline: `-${size['3']}`,
      insetBlock: `-${size['2']}`,
    },
  },
  indicator: {
    display: 'grid',
    placeContent: 'center',
    color: 'currentColor',
    transitionProperty: 'none',
    width: { default: null, ':where(*) > svg': size['3.5'] },
    height: { default: null, ':where(*) > svg': size['3.5'] },
  },
})

/** Props for `Checkbox`. */
type CheckboxProps = WithSx<CheckboxPrimitive.Root.Props>

/** A checkbox. */
function Checkbox({ style, sx, ...props }: CheckboxProps) {
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      {...styleProps([styles.root, sx], style)}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        data-slot="checkbox-indicator"
        {...stylex.props(styles.indicator)}
      >
        <CheckIcon />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  )
}

export { Checkbox }
export type { CheckboxProps }
