import * as React from 'react'
import * as stylex from '@stylexjs/stylex'

import { textStyles } from '#/typography/type-styles.ts'
import { Flex } from '#/layout/index.ts'
import { styleProps, type WithSx } from '#/lib/sx.ts'
import { colors, radii, size, space } from '../../styles/tokens.stylex'

const CHILD_SVG = ':where(*) > svg'
const LINK = ':where(*) a'
const LINK_HOVER = ':where(*) a:hover'
const DESCRIPTION = ':where(*) > [data-slot=alert-description]'
const MD = '@media (min-width: 48rem)'

// The alert carries the default marker.
const styles = stylex.create({
  alert: {
    position: 'relative',
    display: 'grid',
    gridTemplateColumns: { default: null, ':has(> svg)': 'auto 1fr' },
    rowGap: space['2'],
    columnGap: { default: space['1'], ':has(> svg)': space['2'] },
    borderRadius: radii.lg,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: colors.border,
    backgroundColor: colors.card,
    paddingLeft: space['4'],
    paddingRight: {
      default: space['4'],
      ':has([data-slot=alert-action])': size['18'],
    },
    paddingBlock: space['3'],
    textAlign: 'left',
    gridRowEnd: { default: null, [CHILD_SVG]: 'span 2' },
    translate: { default: null, [CHILD_SVG]: `0 ${size['0.5']}` },
  },
  icon: {
    width: { default: '100%', [CHILD_SVG]: size['4'] },
    height: { default: null, [CHILD_SVG]: size['4'] },
  },
  default: { color: colors.cardForeground },
  destructive: {
    color: {
      default: colors.destructive,
      [DESCRIPTION]: `color-mix(in oklab, ${colors.destructive} 90%, transparent)`,
    },
  },
  title: {
    fontWeight: 500,
    gridColumnStart: {
      default: null,
      [stylex.when.ancestor(':has(> svg)')]: '2',
    },
    textDecorationLine: { default: null, [LINK]: 'underline' },
    textUnderlineOffset: { default: null, [LINK]: 3 },
    color: { default: null, [LINK_HOVER]: colors.foreground },
  },
  description: {
    textWrap: { default: 'balance', [MD]: 'pretty' },
    color: { default: colors.mutedForeground, [LINK_HOVER]: colors.foreground },
    textDecorationLine: { default: null, [LINK]: 'underline' },
    textUnderlineOffset: { default: null, [LINK]: 3 },
    marginBottom: {
      default: null,
      ':where(*) p:not(:last-child)': space['4'],
    },
  },
  // Under the title and description, clear of the icon's column.
  actions: {
    gridColumnStart: {
      default: null,
      [stylex.when.ancestor(':has(> svg)')]: '2',
    },
  },
  action: {
    position: 'absolute',
    top: size['2.5'],
    right: size['3'],
  },
})

type DivProps = WithSx<React.ComponentProps<'div'>>

/** A callout for important information. */
function Alert({
  style,
  sx,
  variant,
  ...props
}: DivProps & { variant?: 'default' | 'destructive' | null }) {
  return (
    <div
      data-slot="alert"
      role="alert"
      {...styleProps(
        [
          stylex.defaultMarker(),
          textStyles['2'],
          styles.alert,
          styles.icon,
          styles[variant ?? 'default'],
          sx,
        ],
        style,
      )}
      {...props}
    />
  )
}

/** The alert's heading. */
function AlertTitle({ style, sx, ...props }: DivProps) {
  return (
    <div
      data-slot="alert-title"
      {...styleProps([styles.title, sx], style)}
      {...props}
    />
  )
}

/** The alert's body text. */
function AlertDescription({ style, sx, ...props }: DivProps) {
  return (
    <div
      data-slot="alert-description"
      {...styleProps([textStyles['2'], styles.description, sx], style)}
      {...props}
    />
  )
}

/** A control pinned to the alert's top right. */
function AlertAction({ style, sx, ...props }: DivProps) {
  return (
    <div
      data-slot="alert-action"
      {...styleProps([styles.action, sx], style)}
      {...props}
    />
  )
}

/** Buttons under the description that act on what the alert reports. */
function AlertActions({ sx, ...props }: DivProps) {
  return (
    <Flex
      data-slot="alert-actions"
      wrap="wrap"
      gap="2"
      mt="2"
      sx={[styles.actions, sx]}
      {...props}
    />
  )
}

export { Alert, AlertTitle, AlertDescription, AlertAction, AlertActions }
