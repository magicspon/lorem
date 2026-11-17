import { mergeProps } from '@base-ui/react/merge-props'
import { useRender } from '@base-ui/react/use-render'
import * as React from 'react'
import * as stylex from '@stylexjs/stylex'

import { textStyles } from '#/typography/type-styles.ts'
import { Flex, type FlexProps } from '#/layout/index.ts'
import type { WithSx, Sx } from '#/lib/sx.ts'
import { colors, fonts, radii, space } from '../../styles/tokens.stylex'
import { shadows } from '../../styles/shadows.stylex'

const FIRST_IMG = ':where(*) > img:first-child'
const LAST_IMG = ':where(*) > img:last-child'

const styles = stylex.create({
  card: {
    display: 'flex',
    flexDirection: 'column',
    borderRadius: radii['3xl'],
    backgroundColor: colors.card,
    paddingTop: {
      default: 'var(--card-spacing)',
      ':has(> img:first-child)': 0,
    },
    paddingBottom: 'var(--card-spacing)',
    color: colors.cardForeground,
    borderTopLeftRadius: { default: null, [FIRST_IMG]: radii.xl },
    borderTopRightRadius: { default: null, [FIRST_IMG]: radii.xl },
    borderBottomLeftRadius: { default: null, [LAST_IMG]: radii.xl },
    borderBottomRightRadius: { default: null, [LAST_IMG]: radii.xl },
  },
  shadow: {
    boxShadow: shadows.cardOutline,
  },
  // Inside a surface that already frames its content: no outline, fill or
  // padding, so the content lines up with the surface's own.
  flat: {
    '--card-inset': '0px',
    backgroundColor: 'transparent',
    boxShadow: 'none',
    paddingTop: 0,
    paddingBottom: 0,
    borderRadius: 0,
  },
  // A whole card that is one link or button: it shows focus and answers hover.
  interactive: {
    cursor: 'pointer',
    outline: 'none',
    // Focus draws the ring every control draws, outside the hairline.
    boxShadow: {
      default: shadows.cardOutline,
      ':hover:not(:focus-visible)': shadows.cardOutlineHover,
      ':focus-visible': shadows.cardFocus,
    },
  },
  clip: {
    overflow: 'hidden',
  },
  // Parts read the spacing, so the gap sets it alongside.
  default: { '--card-spacing': space['5'], gap: 'var(--card-spacing)' },
  sm: { '--card-spacing': space['4'], gap: 'var(--card-spacing)' },
  header: {
    containerType: 'inline-size',
    containerName: 'card-header',
    display: 'grid',
    gridAutoRows: 'min-content',
    gridTemplateColumns: {
      default: null,
      ':has([data-slot=card-action])': '1fr auto',
    },
    gridTemplateRows: {
      default: null,
      ':has([data-slot=card-description])': 'auto auto',
    },
    alignItems: 'start',
    rowGap: space['3'],
    columnGap: space['4'],
    // A rule sets the header off from what follows it, with the card's
    // spacing on both sides.
    paddingBottom: {
      default: null,
      ':not(:last-child)': 'var(--card-spacing)',
    },
    borderBottomWidth: { default: null, ':not(:last-child)': 1 },
    borderBottomStyle: { default: null, ':not(:last-child)': 'solid' },
    borderBottomColor: { default: null, ':not(:last-child)': colors.border },
    borderTopLeftRadius: radii.xl,
    borderTopRightRadius: radii.xl,
    paddingInline: 'var(--card-inset, var(--card-spacing))',
  },
  title: {
    fontFamily: fonts.heading,
    fontWeight: 600,
    letterSpacing: '-0.01em',
  },
  // A headline figure under its label, the full width of the header, so a
  // long figure can't squeeze the action out of the card.
  stat: {
    gridColumn: '1 / -1',
    fontWeight: 600,
    fontVariantNumeric: 'tabular-nums',
  },
  description: {
    color: colors.mutedForeground,
  },
  action: {
    gridColumnStart: '2',
    gridRowStart: '1',
    // Beside a stat, the action keeps to the label's row.
    gridRowEnd: {
      default: 'span 2',
      [stylex.when.ancestor(
        ':has(> [data-slot=card-title][data-variant=stat])',
      )]: 'span 1',
    },
    alignSelf: 'start',
    justifySelf: 'end',
  },
  content: { paddingInline: 'var(--card-inset, var(--card-spacing))' },
  footer: {
    borderBottomLeftRadius: radii.xl,
    borderBottomRightRadius: radii.xl,
    paddingInline: 'var(--card-inset, var(--card-spacing))',
  },
})

/** Props every card part takes: a `div` that `render` can swap for another element. */
type CardPartProps = WithSx<useRender.ComponentProps<'div'>>

const FlatContext = React.createContext(false)

/** Draws every card inside it flat: no frame, so it sits in a surface that has one. */
const FlatCards = FlatContext.Provider

/** Props for `CardFooter`: where its actions sit, and the gap between them. */
type CardFooterProps = CardPartProps & Pick<FlexProps, 'justify' | 'gap'>

/** Props for `Card`. */
type CardProps = CardPartProps & {
  size?: 'default' | 'sm'
  /**
   * The whole card is one control: render it as a link or button, and it
   * shows focus and answers hover. Its parts must hold nothing interactive.
   */
  interactive?: boolean

  /**
   * apply overflow hidden to the card body root, the default behaviour
   */
  clip?: boolean

  /**
   * apply card shadow, the default is true
   */
  shadow?: boolean
}

/**
 * Renders one card part. `mergeProps` joins class names and styles, so the
 * consumer's `style` and `sx` come after the part's own.
 */
function useCardPart(
  slot: string,
  partStyles: Sx | ReadonlyArray<Sx>,
  { sx, render, ...props }: CardPartProps,
  state?: Record<string, string>,
) {
  const resolved = stylex.props(partStyles, sx)

  return useRender({
    defaultTagName: 'div',
    props: mergeProps<'div'>(
      { className: resolved.className, style: resolved.style },
      props,
    ),
    render,
    // `state` becomes `data-*` attributes, so `slot` sets `data-slot`.
    state: { slot, ...state },
  })
}

/** A framed container for related content. Pass `render` to use another element. */
function Card({
  size = 'default',
  interactive,
  clip = true,
  shadow = true,
  ...props
}: CardProps) {
  const flat = React.useContext(FlatContext)
  return useCardPart(
    'card',
    [
      textStyles['2'],
      styles.card,
      styles[size],
      interactive === true && styles.interactive,
      clip === true && styles.clip,
      flat && styles.flat,
      shadow && styles.shadow,
    ],
    props,
    { size },
  )
}

/** Holds the title, description and action. */
function CardHeader(props: CardPartProps) {
  // The marker lets the action make room for a stat title.
  return useCardPart(
    'card-header',
    [stylex.defaultMarker(), styles.header],
    props,
  )
}

/** Props for `CardTitle`. */
type CardTitleProps = CardPartProps & {
  /** `stat` is a headline figure, under the description that labels it. */
  variant?: 'default' | 'stat'
}

/** The card's heading. */
function CardTitle({ variant = 'default', ...props }: CardTitleProps) {
  return useCardPart(
    'card-title',
    [
      textStyles['3'],
      styles.title,
      variant === 'stat' && [textStyles['7'], styles.stat],
    ],
    props,
    { variant },
  )
}

/** Muted text under the title. */
function CardDescription(props: CardPartProps) {
  return useCardPart(
    'card-description',
    [textStyles['2'], styles.description],
    props,
  )
}

/** A control placed at the header's top right. */
function CardAction(props: CardPartProps) {
  return useCardPart('card-action', styles.action, props)
}

/** The card's main content. */
function CardContent(props: CardPartProps) {
  // The marker lets nested parts, such as a calendar, drop their fill.
  return useCardPart(
    'card-content',
    [stylex.defaultMarker(), styles.content],
    props,
  )
}

/** Holds the card's actions. */
function CardFooter({ sx, justify, gap, ...props }: CardFooterProps) {
  return (
    <Flex
      data-slot="card-footer"
      align="center"
      justify={justify}
      gap={gap}
      sx={[styles.footer, sx]}
      {...props}
    />
  )
}

export {
  Card,
  FlatCards,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
}
export type { CardFooterProps, CardProps, CardPartProps, CardTitleProps }
