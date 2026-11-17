import { mergeProps } from '@base-ui/react/merge-props'
import { useRender } from '@base-ui/react/use-render'
import * as stylex from '@stylexjs/stylex'

import { textStyles } from '#/typography/type-styles.ts'
import { type WithSx } from '#/lib/sx.ts'
import { colors, motion, radii, size, space } from '../../styles/tokens.stylex'
import { shadows } from '../../styles/shadows.stylex'

const CHILD_SVG = ':where(*) > svg'
// A badge rendered as a link reacts to hover.
const LINK_HOVER = ':is(a):hover'

type BadgeVariant =
  | 'default'
  | 'secondary'
  | 'destructive'
  | 'outline'
  | 'ghost'
  | 'link'

const base = stylex.create({
  root: {
    display: 'inline-flex',
    height: {
      default: size['5'],
      [CHILD_SVG]: `${size['3']} !important`,
    },
    width: {
      default: 'fit-content',
      [CHILD_SVG]: `${size['3']} !important`,
    },
    flexShrink: 0,
    alignItems: 'center',
    justifyContent: 'center',
    gap: space['1'],
    overflow: 'hidden',
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
    },
    paddingLeft: {
      default: space['2'],
      ':has([data-icon=inline-start])': space['1'],
    },
    paddingRight: {
      default: space['2'],
      ':has([data-icon=inline-end])': space['1'],
    },
    paddingBlock: space['1'],
    fontWeight: 500,
    whiteSpace: 'nowrap',
    transitionProperty: 'all',
    transitionDuration: motion.normal,
    transitionTimingFunction: motion.ease,
    pointerEvents: { default: null, [CHILD_SVG]: 'none' },
  },
})

const variants = stylex.create({
  default: {
    backgroundColor: {
      default: colors.primary,
      [LINK_HOVER]: colors.primaryHover,
    },
    color: colors.primaryForeground,
  },
  secondary: {
    backgroundColor: {
      default: colors.secondary,
      [LINK_HOVER]: colors.secondaryHover,
    },
    color: colors.secondaryForeground,
  },
  destructive: {
    backgroundColor: {
      default: colors.destructiveSubtle,
      [LINK_HOVER]: colors.destructiveSubtleHover,
    },
    color: colors.destructive,
    boxShadow: {
      default: null,
      ':focus-visible': shadows.invalidRing,
    },
  },
  outline: {
    borderColor: {
      default: colors.border,
      ':focus-visible': colors.ring,
      ':is([aria-invalid=true])': colors.invalidBorder,
    },
    backgroundColor: {
      default: colors.controlBackground,
      [LINK_HOVER]: colors.controlHover,
    },
    color: colors.foreground,
  },
  ghost: {
    backgroundColor: { default: null, ':hover': colors.ghostHover },
    color: { default: null, ':hover': colors.foreground },
  },
  link: {
    color: colors.primaryText,
    textUnderlineOffset: 4,
    textDecorationLine: { default: null, ':hover': 'underline' },
  },
})

/** Props for `Badge`. */
type BadgeProps = WithSx<useRender.ComponentProps<'span'>> & {
  variant?: BadgeVariant | null
}

/** A small label. Pass `render` to use another element, such as a link. */
function Badge({ variant = 'default', sx, render, ...props }: BadgeProps) {
  const resolved = stylex.props(
    [textStyles['1'], base.root],
    variants[variant ?? 'default'],
    sx,
  )

  return useRender({
    defaultTagName: 'span',
    props: mergeProps<'span'>(
      { className: resolved.className, style: resolved.style },
      props,
    ),
    render,
    state: {
      slot: 'badge',
      variant,
    },
  })
}

export { Badge }
export type { BadgeProps, BadgeVariant }
