import { Switch as SwitchPrimitive } from '@base-ui/react/switch'
import * as stylex from '@stylexjs/stylex'

import { styleProps, type WithSx } from '#/lib/sx.ts'
import { colors, motion, radii, size } from '../../styles/tokens.stylex'
import { shadows } from '../../styles/shadows.stylex'

const styles = stylex.create({
  root: {
    position: 'relative',
    display: 'inline-flex',
    flexShrink: 0,
    alignItems: 'center',
    padding: 0,
    borderRadius: radii.full,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: {
      default: 'transparent',
      ':focus-visible': colors.ring,
      ':is([aria-invalid=true])': colors.invalidBorder,
    },
    boxShadow: {
      default: null,
      ':focus-visible': shadows.focusRing,
      ':is([aria-invalid=true])': shadows.invalidRing,
    },
    // Mutually exclusive, so no condition depends on rule order.
    backgroundColor: {
      default: colors.switchTrack,
      ':hover:not([data-checked], [data-disabled])': colors.switchTrackHover,
      ':is([data-checked]):not(:hover)': colors.primary,
      ':is([data-checked]):hover': colors.primaryHover,
    },
    cursor: { default: null, ':is([data-disabled])': 'not-allowed' },
    opacity: { default: null, ':is([data-disabled])': 0.5 },
    transitionProperty: 'all',
    transitionDuration: motion.normal,
    transitionTimingFunction: motion.ease,
    outline: 'none',
    // A larger hit area than the visible track.
    '::after': {
      content: '""',
      position: 'absolute',
      insetInline: `-${size['3']}`,
      insetBlock: `-${size['2']}`,
    },
  },
  rootDefault: { height: size['4.6'], width: size['8'] },
  rootSm: { height: size['3.5'], width: size['6'] },
  thumb: {
    pointerEvents: 'none',
    display: 'block',
    borderRadius: radii.full,
    backgroundColor: {
      default: colors.switchThumbOff,
      ':is([data-checked])': colors.switchThumbOn,
    },
    translate: { default: 0, ':is([data-checked])': 'calc(100% - 2px)' },
    transitionProperty: 'translate',
    transitionDuration: motion.normal,
    transitionTimingFunction: motion.ease,
  },
  thumbDefault: { width: size['4'], height: size['4'] },
  thumbSm: { width: size['3'], height: size['3'] },
})

/** Props for `Switch`. */
type SwitchProps = WithSx<
  SwitchPrimitive.Root.Props & { size?: 'sm' | 'default' }
>

/** An on/off toggle. */
function Switch({ style, sx, size = 'default', ...props }: SwitchProps) {
  const isSmall = size === 'sm'

  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      data-size={size}
      {...styleProps(
        [styles.root, isSmall ? styles.rootSm : styles.rootDefault, sx],
        style,
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        {...stylex.props(
          styles.thumb,
          isSmall ? styles.thumbSm : styles.thumbDefault,
        )}
      />
    </SwitchPrimitive.Root>
  )
}

export { Switch }
export type { SwitchProps }
