import { Radio as RadioPrimitive } from '@base-ui/react/radio'
import { RadioGroup as RadioGroupPrimitive } from '@base-ui/react/radio-group'
import * as stylex from '@stylexjs/stylex'

import { styleProps, type WithSx } from '#/lib/sx.ts'
import { colors, radii, size, space } from '../../styles/tokens.stylex'
import { shadows } from '../../styles/shadows.stylex'

// Base UI renders a span, which never matches `:disabled`, and marks it
// with `data-disabled` instead.
const DISABLED = ':is([data-disabled])'

const styles = stylex.create({
  group: {
    display: 'grid',
    width: '100%',
    gap: space['3'],
  },
  item: {
    position: 'relative',
    display: 'flex',
    aspectRatio: '1',
    width: size['4'],
    height: size['4'],
    flexShrink: 0,
    padding: 0,
    borderRadius: radii.full,
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
    outline: 'none',
    cursor: { default: null, [DISABLED]: 'not-allowed' },
    opacity: { default: null, [DISABLED]: 0.5 },
    // A larger hit area than the visible circle.
    '::after': {
      content: '""',
      position: 'absolute',
      insetInline: `-${size['3']}`,
      insetBlock: `-${size['2']}`,
    },
  },
  indicator: {
    display: 'flex',
    width: size['4'],
    height: size['4'],
    alignItems: 'center',
    justifyContent: 'center',
  },
  dot: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: size['2'],
    height: size['2'],
    translate: '-50% -50%',
    borderRadius: radii.full,
    backgroundColor: colors.primaryForeground,
  },
})

/** A set of radio items with one value. */
function RadioGroup({
  style,
  sx,
  ...props
}: WithSx<RadioGroupPrimitive.Props>) {
  return (
    <RadioGroupPrimitive
      data-slot="radio-group"
      {...styleProps([styles.group, sx], style)}
      {...props}
    />
  )
}

/** One option in a radio group. */
function RadioGroupItem({
  style,
  sx,
  ...props
}: WithSx<RadioPrimitive.Root.Props>) {
  return (
    <RadioPrimitive.Root
      data-slot="radio-group-item"
      {...styleProps([styles.item, sx], style)}
      {...props}
    >
      <RadioPrimitive.Indicator
        data-slot="radio-group-indicator"
        {...stylex.props(styles.indicator)}
      >
        <span sx={styles.dot} />
      </RadioPrimitive.Indicator>
    </RadioPrimitive.Root>
  )
}

export { RadioGroup, RadioGroupItem }
