import { Tabs as TabsPrimitive } from '@base-ui/react/tabs'
import * as stylex from '@stylexjs/stylex'

import { textStyles } from '#/typography/type-styles.ts'
import { stateStyleProps, styleProps, type WithSx } from '#/lib/sx.ts'
import { colors, motion, radii, size, space } from '../../styles/tokens.stylex'
import { shadows } from '../../styles/shadows.stylex'

const SVG = ':where(*) svg'
const DISABLED = ':is(:disabled, [aria-disabled=true])'

/** `page` spaces tabs that switch the main content of a screen. */
type TabsVariant = 'default' | 'page'

/** `sidebar` is a `line` list with a fixed width, for vertical tabs. */
type TabsListVariant = 'default' | 'line' | 'sidebar'

// The tabs root and list carry the default marker.
const styles = stylex.create({
  tabs: { display: 'flex', gap: space['2'] },
  // A page's sections sit further from a list beside them than above them.
  pageHorizontal: { gap: space['4'] },
  pageVertical: { gap: space['5'] },
  horizontal: { flexDirection: 'column' },
  // The list keeps its own height beside a taller panel.
  vertical: { alignItems: 'flex-start' },
  list: {
    display: 'inline-flex',
    width: 'fit-content',
    // Never wider than the tabs, and never squeezed by the panel beside it.
    maxWidth: '100%',
    flexShrink: 0,
    alignItems: 'center',
    justifyContent: 'center',
    padding: size['0.75'],
    color: colors.mutedForeground,
    height: {
      default: null,
      [stylex.when.ancestor(
        ':is([data-slot=tabs][data-orientation=horizontal])',
      )]: size['9'],
      [stylex.when.ancestor(
        ':is([data-slot=tabs][data-orientation=vertical])',
      )]: 'fit-content',
    },
    flexDirection: {
      default: null,
      [stylex.when.ancestor(
        ':is([data-slot=tabs][data-orientation=vertical])',
      )]: 'column',
    },
    borderRadius: {
      default: radii['4xl'],
      [stylex.when.ancestor(
        ':is([data-slot=tabs][data-orientation=vertical])',
      )]: radii['2xl'],
      ':is([data-variant=line], [data-variant=sidebar])': 0,
    },
  },
  listDefault: { backgroundColor: colors.muted },
  listLine: { gap: space['1'], backgroundColor: 'transparent' },
  listSidebar: { width: size['52'] },
  trigger: {
    position: 'relative',
    display: 'inline-flex',
    height: { default: 'calc(100% - 1px)', [SVG]: size['4'] },
    width: {
      default: null,
      [stylex.when.ancestor(
        ':is([data-slot=tabs][data-orientation=vertical])',
      )]: '100%',
      [SVG]: size['4'],
    },
    flex: 1,
    alignItems: 'center',
    justifyContent: {
      default: 'center',
      [stylex.when.ancestor(
        ':is([data-slot=tabs][data-orientation=vertical])',
      )]: 'flex-start',
    },
    gap: space['1'],
    borderRadius: radii.xl,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: {
      default: 'transparent',
      ':focus-visible': colors.ring,
      ':is([data-active]):not(:focus-visible)': colors.tabActiveBorder,
      // A line tab has no border at rest, but still draws the focus ring.
      [stylex.when.ancestor(
        ':is([data-slot=tabs-list]:is([data-variant=line], [data-variant=sidebar]))',
      )]: { default: 'transparent', ':focus-visible': colors.ring },
    },
    paddingLeft: {
      default: space['2'],
      [stylex.when.ancestor(
        ':is([data-slot=tabs][data-orientation=vertical])',
      )]: space['2'],
      ':has([data-icon=inline-start])': space['1'],
    },
    paddingRight: {
      default: space['2'],
      [stylex.when.ancestor(
        ':is([data-slot=tabs][data-orientation=vertical])',
      )]: space['2'],
      ':has([data-icon=inline-end])': space['1'],
    },
    paddingBlock: {
      default: space['1'],
      [stylex.when.ancestor(
        ':is([data-slot=tabs][data-orientation=vertical])',
      )]: space['1'],
    },
    fontWeight: 500,
    whiteSpace: 'nowrap',
    color: {
      default: colors.tabForeground,
      ':is(:hover, [data-active])': colors.foreground,
    },
    backgroundColor: {
      default: null,
      ':is([data-active])': colors.tabActiveBackground,
      [stylex.when.ancestor(
        ':is([data-slot=tabs-list]:is([data-variant=line], [data-variant=sidebar]))',
      )]: 'transparent',
    },
    boxShadow: {
      default: null,
      ':focus-visible': shadows.focusRing,
    },
    outline: 'none',
    transitionProperty: 'all',
    transitionDuration: motion.normal,
    transitionTimingFunction: motion.ease,
    pointerEvents: { default: null, [DISABLED]: 'none', [SVG]: 'none' },
    opacity: { default: null, [DISABLED]: 0.5 },
    flexShrink: { default: null, [SVG]: 0 },
    // Shown on the active tab of a `line` list. Set here and read by `::after`,
    // as StyleX types reject conditions inside a pseudo-element.
    '--tab-underline-opacity': {
      default: '0',
      [stylex.when.ancestor(
        ':is([data-slot=tabs-list]:is([data-variant=line], [data-variant=sidebar]))',
      )]: {
        default: '0',
        ':is([data-active])': '1',
      },
    },
    '::after': {
      content: '""',
      position: 'absolute',
      backgroundColor: colors.foreground,
      opacity: 'var(--tab-underline-opacity)',
      transitionProperty: 'opacity',
      transitionDuration: motion.normal,
      transitionTimingFunction: motion.ease,
    },
  },
  // Tabs pass their orientation in state, so the underline is placed from it.
  underlineHorizontal: {
    '::after': {
      insetInline: 0,
      bottom: `-${size['1.25']}`,
      height: size['0.5'],
    },
  },
  underlineVertical: {
    '::after': { insetBlock: 0, right: `-${size['1']}`, width: size['0.5'] },
  },
  content: {
    flex: 1,
    // Base UI puts the panel in the tab order, so it shows focus as a control does.
    borderRadius: radii.xl,
    outline: 'none',
    boxShadow: {
      default: null,
      ':focus-visible': shadows.focusRing,
    },
  },
})

const listVariants = {
  default: [styles.listDefault],
  line: [styles.listLine],
  sidebar: [styles.listLine, styles.listSidebar],
} as const

const pageGap = {
  horizontal: styles.pageHorizontal,
  vertical: styles.pageVertical,
} as const

/** Root of a set of tabs. Holds the selected value. */
function Tabs({
  style,
  sx,
  orientation = 'horizontal',
  variant = 'default',
  ...props
}: WithSx<TabsPrimitive.Root.Props> & { variant?: TabsVariant }) {
  return (
    <TabsPrimitive.Root
      data-slot="tabs"
      data-orientation={orientation}
      {...styleProps(
        [
          stylex.defaultMarker(),
          styles.tabs,
          styles[orientation],
          variant === 'page' && pageGap[orientation],
          sx,
        ],
        style,
      )}
      {...props}
    />
  )
}

/** Holds the tab triggers. */
function TabsList({
  style,
  sx,
  variant = 'default',
  ...props
}: WithSx<TabsPrimitive.List.Props> & {
  variant?: TabsListVariant | null
}) {
  const listVariant = variant ?? 'default'
  return (
    <TabsPrimitive.List
      data-slot="tabs-list"
      data-variant={listVariant}
      {...styleProps(
        [stylex.defaultMarker(), styles.list, listVariants[listVariant], sx],
        style,
      )}
      {...props}
    />
  )
}

/** Selects its panel. */
function TabsTrigger({ style, sx, ...props }: WithSx<TabsPrimitive.Tab.Props>) {
  return (
    <TabsPrimitive.Tab
      data-slot="tabs-trigger"
      {...stateStyleProps(
        (state: TabsPrimitive.Tab.State) => [
          textStyles['2'],
          styles.trigger,
          state.orientation === 'vertical'
            ? styles.underlineVertical
            : styles.underlineHorizontal,
          sx,
        ],
        style,
      )}
      {...props}
    />
  )
}

/** The panel for one tab. */
function TabsContent({
  style,
  sx,
  ...props
}: WithSx<TabsPrimitive.Panel.Props>) {
  return (
    <TabsPrimitive.Panel
      data-slot="tabs-content"
      {...styleProps([textStyles['2'], styles.content, sx], style)}
      {...props}
    />
  )
}

export { Tabs, TabsList, TabsTrigger, TabsContent }
