import { Button as ButtonPrimitive } from '@base-ui/react/button'
import * as stylex from '@stylexjs/stylex'
import { LoaderCircleIcon } from 'lucide-react'

import { textStyles } from '#/typography/type-styles.ts'
import { styleProps, type WithSx } from '#/lib/sx.ts'
import { animations } from '../../styles/animations'
import { colors, motion, radii, size, space } from '../../styles/tokens.stylex'
import { shadows } from '../../styles/shadows.stylex'

type ButtonVariant =
  | 'default'
  | 'outline'
  | 'secondary'
  | 'ghost'
  | 'destructive'
  | 'link'
  | 'nav'
  | 'dock'
  | 'field'
  | 'filter'

type ButtonSize =
  | 'default'
  | 'xs'
  | 'sm'
  | 'lg'
  | 'icon'
  | 'icon-xs'
  | 'icon-sm'
  | 'icon-lg'
  | 'avatar'

// Each property's conditions exclude one another, since StyleX does not keep
// them in the order they are written. Pressed beats open, and open beats hover.
const HOVER = ':hover:not(:active, [aria-expanded=true])'
const PRESSED = ':active'
const OPEN = ':is([aria-expanded=true]):not(:active)'

// `:where(*) svg` styles icons passed as children. StyleX has no descendant
// selector API, but it compiles this key as one.
const base = stylex.create({
  root: {
    // So a `Dot` can sit on the button's corner.
    position: 'relative',
    display: 'inline-flex',
    flexShrink: 0,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 0,
    borderRadius: radii['4xl'],
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
    backgroundColor: 'transparent',
    backgroundClip: 'padding-box',
    color: 'inherit',
    fontFamily: 'inherit',
    fontWeight: 500,
    whiteSpace: 'nowrap',
    cursor: 'pointer',
    transitionProperty: 'all',
    transitionDuration: motion.normal,
    transitionTimingFunction: motion.ease,
    outline: 'none',
    userSelect: 'none',
    translate: { default: null, ':not([aria-haspopup]):active': '0 1px' },
    pointerEvents: {
      default: null,
      ':is(:disabled, [data-disabled])': 'none',
      ':where(*) svg': 'none',
    },
    // A loading button is disabled too, but keeps its full colour.
    opacity: {
      default: null,
      ':is(:disabled, [data-disabled]):not([aria-busy=true])': 0.5,
    },
    width: { default: null, ':where(*) svg': size['4'] },
    height: { default: null, ':where(*) svg': size['4'] },
  },
})

// While loading, the label stays in place, invisible, so the button keeps its
// size and its accessible name; the spinner sits over it, centred.
const busy = stylex.create({
  label: {
    display: 'flex',
    alignItems: 'center',
    gap: 'inherit',
    opacity: 0,
  },
  spinner: {
    position: 'absolute',
    inset: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    display: 'flex',
  },
})

const variants = stylex.create({
  default: {
    backgroundColor: {
      default: colors.primary,
      ':hover:not(:active)': colors.primaryHover,
      [PRESSED]: colors.primaryPressed,
    },
    color: colors.primaryForeground,
  },
  outline: {
    borderColor: {
      default: colors.border,
      ':focus-visible': colors.ring,
      ':is([aria-invalid=true])': colors.invalidBorder,
    },
    backgroundColor: {
      default: colors.controlBackground,
      [HOVER]: colors.controlHover,
      [PRESSED]: colors.controlPressed,
      [OPEN]: colors.muted,
    },
    color: {
      default: null,
      ':is(:hover, :active, [aria-expanded=true])': colors.foreground,
    },
  },
  secondary: {
    backgroundColor: {
      default: colors.secondary,
      [HOVER]: colors.secondaryHover,
      [PRESSED]: colors.secondaryPressed,
      [OPEN]: colors.secondary,
    },
    color: colors.secondaryForeground,
  },
  ghost: {
    backgroundColor: {
      default: null,
      [HOVER]: colors.ghostHover,
      [PRESSED]: colors.pressed,
      [OPEN]: colors.muted,
    },
    color: {
      default: null,
      ':is(:hover, :active, [aria-expanded=true])': colors.foreground,
    },
  },
  destructive: {
    backgroundColor: {
      default: colors.destructiveSubtle,
      ':hover:not(:active)': colors.destructiveSubtleHover,
      [PRESSED]: colors.destructiveSubtlePressed,
    },
    color: colors.destructive,
    borderColor: {
      default: 'transparent',
      ':focus-visible': colors.destructiveFocusBorder,
      ':is([aria-invalid=true])': colors.invalidBorder,
    },
    boxShadow: {
      default: null,
      ':focus-visible': shadows.invalidRing,
      ':is([aria-invalid=true])': shadows.invalidRing,
    },
  },
  link: {
    color: colors.primaryText,
    textUnderlineOffset: 4,
    textDecorationLine: { default: null, ':hover': 'underline' },
  },
  // A link in a list of pages: ghost, set to the start, and filled on the
  // current page, which hover leaves alone.
  nav: {
    justifyContent: 'flex-start',
    backgroundColor: {
      default: null,
      ':hover:not(:active, [aria-current=page])': colors.ghostHover,
      ':active:not([aria-current=page])': colors.pressed,
      ':is([aria-current=page])': colors.muted,
    },
    color: {
      default: null,
      ':is(:hover, :active, [aria-current=page])': colors.foreground,
    },
    // A count badge sits at the link's end.
    marginLeft: { default: null, ':where(*) > [data-slot=badge]': 'auto' },
  },
  // A page's icon in a floating dock: `nav`, centred on its icon.
  dock: { justifyContent: 'center' },
  // Added to `outline`: a button that opens a picker and shows its value, as
  // a date field does, set out like a text input.
  field: {
    justifyContent: 'flex-start',
    width: { default: '100%', ':where(*) svg': size['4'] },
    fontWeight: 400,
  },
  // A column's filter button: muted until its filter is set, which
  // `data-active` marks. Hovered or open, it keeps the foreground colour.
  filter: {
    backgroundColor: {
      default: null,
      [HOVER]: colors.ghostHover,
      [PRESSED]: colors.pressed,
      [OPEN]: colors.muted,
    },
    color: {
      default: colors.mutedForeground,
      ':is(:hover, :active, [aria-expanded=true])': colors.foreground,
      ':is([data-active]):not(:hover, :active, [aria-expanded=true])':
        colors.primaryText,
    },
  },
})

// `field` builds on `outline` and `dock` on `nav`; every other variant
// stands alone.
const variantStyles = {
  default: [variants.default],
  outline: [variants.outline],
  secondary: [variants.secondary],
  ghost: [variants.ghost],
  destructive: [variants.destructive],
  link: [variants.link],
  nav: [variants.nav],
  dock: [variants.nav, variants.dock],
  field: [variants.outline, variants.field],
  filter: [variants.filter],
} as const

// Padding shrinks on the side that holds a `data-icon` child.
const sizes = stylex.create({
  default: {
    height: { default: size['9'], ':where(*) svg': size['4'] },
    gap: space['1'],
    paddingLeft: {
      default: space['3'],
      ':has([data-icon=inline-start])': space['2'],
    },
    paddingRight: {
      default: space['3'],
      ':has([data-icon=inline-end])': space['2'],
    },
  },
  xs: {
    height: { default: size['6'], ':where(*) svg': size['3'] },
    width: { default: null, ':where(*) svg': size['3'] },
    gap: space['1'],
    paddingLeft: {
      default: space['2'],
      ':has([data-icon=inline-start])': space['2'],
    },
    paddingRight: {
      default: space['2'],
      ':has([data-icon=inline-end])': space['2'],
    },
  },
  sm: {
    height: { default: size['8'], ':where(*) svg': size['4'] },
    gap: space['1'],
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
    height: { default: size['10'], ':where(*) svg': size['4'] },
    gap: space['1'],
    paddingLeft: {
      default: space['4'],
      ':has([data-icon=inline-start])': space['3'],
    },
    paddingRight: {
      default: space['4'],
      ':has([data-icon=inline-end])': space['3'],
    },
  },
  icon: {
    width: { default: size['9'], ':where(*) svg': size['4'] },
    height: { default: size['9'], ':where(*) svg': size['4'] },
  },
  'icon-xs': {
    width: { default: size['6'], ':where(*) svg': size['3'] },
    height: { default: size['6'], ':where(*) svg': size['3'] },
  },
  'icon-sm': {
    width: { default: size['8'], ':where(*) svg': size['4'] },
    height: { default: size['8'], ':where(*) svg': size['4'] },
  },
  'icon-lg': {
    width: { default: size['10'], ':where(*) svg': size['4'] },
    height: { default: size['10'], ':where(*) svg': size['4'] },
  },
  // An avatar and a name: tight at the avatar's side.
  avatar: {
    height: { default: size['9'], ':where(*) svg': size['4'] },
    gap: space['2'],
    paddingLeft: space['1'],
    paddingRight: space['2'],
  },
})

/** Variant and size choices shared by `Button` and `buttonStyles`. */
interface ButtonVariantProps {
  variant?: ButtonVariant | null
  size?: ButtonSize | null
}

/**
 * The StyleX styles for a button look, for composing into other parts or
 * spreading onto an element with `stylex.props`.
 */
function buttonStyles({ variant, size }: ButtonVariantProps = {}) {
  return [
    size === 'xs' ? textStyles['1'] : textStyles['2'],
    base.root,
    ...variantStyles[variant ?? 'default'],
    sizes[size ?? 'default'],
  ] as const
}

/** Props for `Button`. */
type ButtonProps = WithSx<ButtonPrimitive.Props & ButtonVariantProps> & {
  /** Swaps the label for a spinner, at the same size, and blocks clicks. */
  loading?: boolean
}

/** A button with shadcn's variants and sizes. */
function Button({
  style,
  sx,
  variant = 'default',
  size = 'default',
  loading = false,
  disabled,
  children,
  ...props
}: ButtonProps) {
  return (
    <ButtonPrimitive
      data-slot="button"
      {...styleProps([...buttonStyles({ variant, size }), sx], style)}
      // Focus stays on a button that starts loading after a key press.
      focusableWhenDisabled={loading || undefined}
      {...props}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
    >
      {loading ? (
        <>
          <span sx={busy.label}>{children}</span>
          <span data-slot="button-spinner" aria-hidden sx={busy.spinner}>
            <span sx={[busy.icon, animations.spin]}>
              <LoaderCircleIcon />
            </span>
          </span>
        </>
      ) : (
        children
      )}
    </ButtonPrimitive>
  )
}

export { Button, buttonStyles }
export type { ButtonProps, ButtonSize, ButtonVariant, ButtonVariantProps }
