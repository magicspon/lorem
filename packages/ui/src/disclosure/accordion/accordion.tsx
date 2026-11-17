import { Accordion as AccordionPrimitive } from '@base-ui/react/accordion'
import * as stylex from '@stylexjs/stylex'
import { ChevronDownIcon, ChevronUpIcon } from 'lucide-react'

import { textStyles } from '#/typography/type-styles.ts'
import { styleProps, type WithSx } from '#/lib/sx.ts'
import { colors, motion, radii, size, space } from '../../styles/tokens.stylex'
import { shadows } from '../../styles/shadows.stylex'

const LINK = ':where(*) a'
const LINK_HOVER = ':where(*) a:hover'

// The trigger carries the default marker.
const styles = stylex.create({
  root: {
    display: 'flex',
    width: '100%',
    flexDirection: 'column',
    overflow: 'hidden',
    borderRadius: radii['2xl'],
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: colors.border,
  },
  item: {
    borderBottomWidth: { default: null, ':not(:last-child)': 1 },
    borderBottomStyle: 'solid',
    borderBottomColor: colors.border,
    backgroundColor: {
      default: null,
      ':is([data-open])': `color-mix(in oklab, ${colors.muted} 50%, transparent)`,
    },
  },
  header: { display: 'flex' },
  trigger: {
    position: 'relative',
    display: 'flex',
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: space['5'],
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: { default: 'transparent', ':focus-visible': colors.ring },
    boxShadow: {
      default: null,
      ':focus-visible': shadows.focusRing,
    },
    padding: space['4'],
    textAlign: 'left',
    fontWeight: 500,
    transitionProperty: 'all',
    transitionDuration: motion.normal,
    transitionTimingFunction: motion.ease,
    outline: 'none',
    textDecorationLine: { default: null, ':hover': 'underline' },
    pointerEvents: { default: null, ':is([aria-disabled=true])': 'none' },
    opacity: { default: null, ':is([aria-disabled=true])': 0.5 },
  },
  icon: {
    pointerEvents: 'none',
    flexShrink: 0,
    marginLeft: 'auto',
    width: size['4'],
    height: size['4'],
    color: colors.mutedForeground,
  },
  iconClosed: {
    display: {
      default: 'block',
      [stylex.when.ancestor(':is([aria-expanded=true])')]: 'none',
    },
  },
  iconOpen: {
    display: {
      default: 'none',
      [stylex.when.ancestor(':is([aria-expanded=true])')]: 'inline',
    },
  },
  panel: {
    overflow: 'hidden',
    paddingInline: space['4'],
  },
  panelInner: {
    height: 'var(--accordion-panel-height)',
    paddingTop: 0,
    paddingBottom: space['4'],
    textDecorationLine: { default: null, [LINK]: 'underline' },
    textUnderlineOffset: { default: null, [LINK]: 3 },
    color: { default: null, [LINK_HOVER]: colors.foreground },
    marginBottom: {
      default: null,
      ':where(*) p:not(:last-child)': space['4'],
    },
  },
})

/** A stack of collapsible sections. */
function Accordion({
  style,
  sx,
  ...props
}: WithSx<AccordionPrimitive.Root.Props>) {
  return (
    <AccordionPrimitive.Root
      data-slot="accordion"
      {...styleProps([styles.root, sx], style)}
      {...props}
    />
  )
}

/** One section: a trigger and its content. */
function AccordionItem({
  style,
  sx,
  ...props
}: WithSx<AccordionPrimitive.Item.Props>) {
  return (
    <AccordionPrimitive.Item
      data-slot="accordion-item"
      {...styleProps([styles.item, sx], style)}
      {...props}
    />
  )
}

/** Toggles its section, with a chevron that flips when open. */
function AccordionTrigger({
  style,
  sx,
  children,
  ...props
}: WithSx<AccordionPrimitive.Trigger.Props>) {
  return (
    <AccordionPrimitive.Header {...stylex.props(styles.header)}>
      <AccordionPrimitive.Trigger
        data-slot="accordion-trigger"
        {...styleProps(
          [stylex.defaultMarker(), textStyles['2'], styles.trigger, sx],
          style,
        )}
        {...props}
      >
        {children}
        <ChevronDownIcon
          data-slot="accordion-trigger-icon"
          {...stylex.props(styles.icon, styles.iconClosed)}
        />
        <ChevronUpIcon
          data-slot="accordion-trigger-icon"
          {...stylex.props(styles.icon, styles.iconOpen)}
        />
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  )
}

/** A section's collapsible content. Overrides style the inner wrapper. */
function AccordionContent({
  style,
  sx,
  children,
  ...props
}: WithSx<AccordionPrimitive.Panel.Props>) {
  // The inner wrapper is a plain div, so it takes the static style only.
  const innerStyle = typeof style === 'function' ? undefined : style

  return (
    <AccordionPrimitive.Panel
      data-slot="accordion-content"
      {...stylex.props([textStyles['2'], styles.panel])}
      {...props}
    >
      <div {...styleProps([styles.panelInner, sx], innerStyle)}>{children}</div>
    </AccordionPrimitive.Panel>
  )
}

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent }
