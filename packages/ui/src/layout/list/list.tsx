import * as stylex from '@stylexjs/stylex'

import { colors, space, type Space } from '../../styles/tokens.stylex'
import * as gaps from '#/layout/props/gap.ts'
import { useLayout, type LayoutProps } from '#/layout/props/use-layout.ts'

const styles = stylex.create({
  list: {
    display: 'flex',
    flexDirection: 'column',
    margin: 0,
    padding: 0,
    listStyle: 'none',
  },
  // A marker needs room outside the item, so it brings its own indent.
  disc: { listStyle: 'disc', paddingLeft: space['5'] },
  decimal: { listStyle: 'decimal', paddingLeft: space['5'] },
  // A rule between items, not under the last.
  divided: {
    borderBottomWidth: { default: null, ':where(*) > :not(:last-child)': 1 },
    borderBottomStyle: {
      default: null,
      ':where(*) > :not(:last-child)': 'solid',
    },
    borderBottomColor: {
      default: null,
      ':where(*) > :not(:last-child)': colors.border,
    },
  },
})

/** Props for `List`. */
type ListProps = LayoutProps<'ul'> & {
  gap?: Space
  /** Show bullets or numbers. Render an `ol` for `decimal`. */
  marker?: 'disc' | 'decimal'
  /** `divided` draws a rule between items. */
  variant?: 'default' | 'divided'
}

/**
 * A `ul` with the browser's bullets and indent removed and a gap between
 * items. Pass `render={<ol />}` for an ordered list.
 */
function List({ gap, marker, variant = 'default', ...props }: ListProps) {
  return useLayout(
    'ul',
    'list',
    [
      styles.list,
      marker && styles[marker],
      variant === 'divided' && styles.divided,
      gap && gaps.gap[gap],
    ],
    props,
  )
}

/** Props for `ListItem`. */
type ListItemProps = LayoutProps<'li'>

/** One item of a `List`. */
function ListItem(props: ListItemProps) {
  return useLayout('li', 'list-item', [], props)
}

export { List, ListItem }
export type { ListProps, ListItemProps }
