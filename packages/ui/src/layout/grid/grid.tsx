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
  cappedChildWidth,
  columns,
  minChildWidth,
  rows,
  templates,
} from './grid-tracks'
import {
  mapResponsive,
  responsiveStyles,
  type Responsive,
} from '#/layout/props/responsive.ts'
import * as responsive from '#/layout/props/responsive-styles.ts'
import { useLayout, type LayoutProps } from '#/layout/props/use-layout.ts'
import type { Space } from '../../styles/tokens.stylex'

const gridDisplay = {
  grid: 'grid',
  inline: 'inline-grid',
  none: 'none',
} as const

const flow = stylex.create({
  row: { gridAutoFlow: 'row' },
  column: { gridAutoFlow: 'column' },
  dense: { gridAutoFlow: 'dense' },
  'row-dense': { gridAutoFlow: 'row dense' },
  'column-dense': { gridAutoFlow: 'column dense' },
})

/** Props for `Grid`. */
type GridProps = LayoutProps<'div'> & {
  display?: Responsive<keyof typeof gridDisplay>
  /**
   * Equal columns, 1 to 12, or one count per breakpoint:
   * `columns={{ initial: '1', md: '3' }}`. Unequal tracks are a `template`.
   */
  columns?: Responsive<keyof typeof columns>
  /** A named layout of unequal columns: `main-aside` or `label-value`. */
  template?: keyof typeof templates
  /**
   * As many columns as fit, none narrower than this step of the size scale.
   * The grid reflows with its own width, so it needs no breakpoints.
   */
  minChildWidth?: keyof typeof minChildWidth
  /** As `minChildWidth`, but no column grows wider than the step. */
  maxChildWidth?: keyof typeof cappedChildWidth
  /** Equal rows, 1 to 6. */
  rows?: keyof typeof rows
  flow?: keyof typeof flow
  align?: Align
  justify?: Justify
  gap?: Responsive<Space>
  gapX?: Space
  gapY?: Space
}

/** Lays its children out on a grid of equal tracks. */
function Grid({
  display = 'grid',
  columns: cols,
  template,
  minChildWidth: minWidth,
  maxChildWidth: maxWidth,
  rows: rowCount,
  flow: autoFlow,
  align: alignItems,
  justify: justifyContent,
  gap,
  gapX,
  gapY,
  ...props
}: GridProps) {
  return useLayout(
    'div',
    'grid',
    [
      ...responsiveStyles(
        mapResponsive(display, (step) => gridDisplay[step]),
        displays,
        responsive.displayAt,
        'grid',
      ),
      ...responsiveStyles(cols, columns, responsive.columnsAt),
      template && templates[template],
      minWidth && minChildWidth[minWidth],
      maxWidth && cappedChildWidth[maxWidth],
      rowCount && rows[rowCount],
      autoFlow && flow[autoFlow],
      alignItems && align[alignItems],
      justifyContent && justify[justifyContent],
      ...responsiveStyles(gap, gaps.gap, responsive.gapAt),
      gapX && gaps.gapX[gapX],
      gapY && gaps.gapY[gapY],
    ],
    props,
  )
}

export { Grid }
export type { GridProps }
