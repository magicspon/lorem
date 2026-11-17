import { Toggle as TogglePrimitive } from '@base-ui/react/toggle'
import * as stylex from '@stylexjs/stylex'

import { textStyles } from '#/typography/type-styles.ts'
import { styleProps, type WithSx } from '#/lib/sx.ts'
import { colors, motion, radii, size, space } from '../../styles/tokens.stylex'
import { shadows } from '../../styles/shadows.stylex'

const SVG = ':where(*) svg'
const DISABLED = ':is(:disabled, [data-disabled])'

type ToggleVariant = 'default' | 'outline'
type ToggleSize = 'default' | 'sm' | 'lg'

const base = stylex.create({
  root: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: space['1'],
    borderRadius: radii['4xl'],
    borderWidth: 0,
    borderStyle: 'solid',
    borderColor: {
      default: null,
      ':focus-visible': colors.ring,
      ':is([aria-invalid=true])': colors.invalidBorder,
    },
    boxShadow: {
      default: null,
      ':focus-visible': shadows.focusRing,
    },
    // Mutually exclusive, so no condition depends on rule order: pressing
    // beats on, and on beats hover.
    backgroundColor: {
      default: 'transparent',
      ':hover:not(:active, [aria-pressed=true])': colors.ghostHover,
      ':active': colors.pressed,
      ':is([aria-pressed=true]):not(:active)': colors.muted,
    },
    color: { default: null, ':is(:hover, :active)': colors.foreground },
    fontWeight: 500,
    whiteSpace: 'nowrap',
    cursor: 'pointer',
    transitionProperty: 'color, background-color, border-color',
    transitionDuration: motion.normal,
    transitionTimingFunction: motion.ease,
    outline: 'none',
    pointerEvents: { default: null, [DISABLED]: 'none', [SVG]: 'none' },
    opacity: { default: null, [DISABLED]: 0.5 },
    flexShrink: { default: null, [SVG]: 0 },
    width: { default: null, [SVG]: size['4'] },
  },
})

const variants = stylex.create({
  default: {},
  outline: {
    borderWidth: 1,
    borderColor: {
      default: colors.input,
      ':focus-visible': colors.ring,
      ':is([aria-invalid=true])': colors.invalidBorder,
    },
  },
})

// Padding shrinks on the side that holds a `data-icon` child.
const sizes = stylex.create({
  default: {
    height: { default: size['9'], [SVG]: size['4'] },
    minWidth: size['9'],
    paddingLeft: {
      default: space['3'],
      ':has([data-icon=inline-start])': space['2'],
    },
    paddingRight: {
      default: space['3'],
      ':has([data-icon=inline-end])': space['2'],
    },
  },
  sm: {
    height: { default: size['8'], [SVG]: size['4'] },
    minWidth: size['8'],
    paddingLeft: {
      default: space['3'],
      ':has([data-icon=inline-start])': space['2'],
    },
    paddingRight: {
      default: space['3'],
      ':has([data-icon=inline-end])': space['2'],
    },
  },
  lg: {
    height: { default: size['10'], [SVG]: size['4'] },
    minWidth: size['10'],
    paddingLeft: {
      default: space['4'],
      ':has([data-icon=inline-start])': space['3'],
    },
    paddingRight: {
      default: space['4'],
      ':has([data-icon=inline-end])': space['3'],
    },
  },
})

/** Variant and size choices shared by `Toggle` and `ToggleGroup`. */
interface ToggleVariantProps {
  variant?: ToggleVariant | null
  size?: ToggleSize | null
}

/** The StyleX styles for a toggle look, for composing into other parts. */
function toggleStyles({ variant, size }: ToggleVariantProps = {}) {
  return [
    textStyles['2'],
    base.root,
    variants[variant ?? 'default'],
    sizes[size ?? 'default'],
  ] as const
}

/** A two-state button. */
function Toggle({
  style,
  sx,
  variant = 'default',
  size = 'default',
  ...props
}: WithSx<TogglePrimitive.Props> & ToggleVariantProps) {
  return (
    <TogglePrimitive
      data-slot="toggle"
      {...styleProps([...toggleStyles({ variant, size }), sx], style)}
      {...props}
    />
  )
}

export { Toggle, toggleStyles }
export type { ToggleSize, ToggleVariant, ToggleVariantProps }
