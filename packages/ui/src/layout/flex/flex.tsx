import * as stylex from '@stylexjs/stylex'

import {
  align,
  justify,
  type Align,
  type Justify,
} from '#/layout/props/align.ts'
import { display as displays } from '#/layout/props/display.ts'
import * as gaps from '#/layout/props/gap.ts'
import {
  mapResponsive,
  responsiveStyles,
  type Responsive,
} from '#/layout/props/responsive.ts'
import * as responsive from '#/layout/props/responsive-styles.ts'
import { useLayout, type LayoutProps } from '#/layout/props/use-layout.ts'
import type { Space } from '../../styles/tokens.stylex'

const direction = stylex.create({
  row: { flexDirection: 'row' },
  column: { flexDirection: 'column' },
  'row-reverse': { flexDirection: 'row-reverse' },
  'column-reverse': { flexDirection: 'column-reverse' },
})

const wrap = stylex.create({
  nowrap: { flexWrap: 'nowrap' },
  wrap: { flexWrap: 'wrap' },
  'wrap-reverse': { flexWrap: 'wrap-reverse' },
})

const flexDisplay = {
  flex: 'flex',
  inline: 'inline-flex',
  none: 'none',
} as const

/** A flex direction. */
type FlexDirection = keyof typeof direction

/** The flex props `Flex` and `Stack` share. */
type FlexLayoutProps = {
  display?: Responsive<keyof typeof flexDisplay>
  align?: Align
  justify?: Justify
  wrap?: keyof typeof wrap
  gap?: Responsive<Space>
  gapX?: Space
  gapY?: Space
}

/** Props for `Flex`. */
type FlexProps = LayoutProps<'div'> &
  FlexLayoutProps & { direction?: Responsive<FlexDirection> }

/** Resolves the flex props to styles, in the order they apply. */
function flexStyles(props: FlexLayoutProps) {
  return [
    ...responsiveStyles(
      mapResponsive(props.display, (step) => flexDisplay[step]),
      displays,
      responsive.displayAt,
      'flex',
    ),
    props.align && align[props.align],
    props.justify && justify[props.justify],
    props.wrap && wrap[props.wrap],
    ...responsiveStyles(props.gap, gaps.gap, responsive.gapAt),
    props.gapX && gaps.gapX[props.gapX],
    props.gapY && gaps.gapY[props.gapY],
  ]
}

/** Resolves `direction`, with the default the primitive lays out in. */
function directionStyles(
  value: Responsive<FlexDirection> | undefined,
  fallback: FlexDirection,
) {
  return responsiveStyles(value, direction, responsive.directionAt, fallback)
}

/**
 * Lays its children out in a row or column. Gaps come from the space scale.
 * `direction`, `display` and `gap` take a value per breakpoint:
 * `direction={{ initial: 'column', md: 'row' }}`.
 */
function Flex({
  display,
  direction: dir,
  align,
  justify,
  wrap,
  gap,
  gapX,
  gapY,
  ...props
}: FlexProps) {
  const own = flexStyles({ display, align, justify, wrap, gap, gapX, gapY })
  // Row is the browser's default, so a plain `Flex` adds no direction class.
  const flow = dir === undefined ? [] : directionStyles(dir, 'row')
  return useLayout('div', 'flex', [...own, ...flow], props)
}

export { Flex, directionStyles, flexStyles }
export type { FlexDirection, FlexProps, FlexLayoutProps }
