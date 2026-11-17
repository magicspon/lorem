import * as stylex from '@stylexjs/stylex'

import { colors, fonts, motion, radii, size, space } from './tokens.stylex'
import { shadows } from './shadows.stylex'

// StyleX selectors must be literals in the file that uses them.
const SVG = ':where(*) svg'

/**
 * Styles several components share. A part composes them first and its own
 * styles after, so any property it sets replaces the shared one whole.
 */
export const field = stylex.create({
  /** Bordered text control: Input, Textarea, Select.Trigger. Compose after `textStyles.control`. */
  control: {
    width: '100%',
    minWidth: 0,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: {
      default: colors.input,
      ':focus-visible': colors.ring,
      ':is([aria-invalid=true])': colors.invalidBorder,
    },
    borderRadius: radii['4xl'],
    backgroundColor: {
      default: colors.controlBackground,
      ':hover:not(:disabled, :focus-visible)': colors.controlHover,
    },
    boxShadow: {
      default: null,
      ':focus-visible': shadows.focusRing,
      ':is([aria-invalid=true])': shadows.invalidRing,
    },
    paddingInline: space['3'],
    transitionProperty: 'color, background-color, border-color',
    transitionDuration: motion.normal,
    transitionTimingFunction: motion.ease,
    outline: 'none',
    cursor: { default: null, ':disabled': 'not-allowed' },
    opacity: { default: null, ':disabled': 0.5 },
    '::placeholder': { color: colors.mutedForeground },
  },
})

export const popup = stylex.create({
  /** Floating panel look: popover, menus, select and combobox lists. */
  surface: {
    borderRadius: radii['2xl'],
    backgroundColor: colors.popover,
    color: colors.popoverForeground,
    boxShadow: shadows.popup,
    outline: 'none',
  },
  /** Wraps a popup so it stacks above the page. */
  positioner: {
    isolation: 'isolate',
    zIndex: 50,
    outline: 'none',
  },
})

export const menu = stylex.create({
  /** A row in a menu, select or combobox list. Compose after `textStyles['2']`. */
  item: {
    position: 'relative',
    display: 'flex',
    cursor: 'default',
    alignItems: 'center',
    gap: space['2'],
    borderRadius: radii.xl,
    paddingBlock: space['2'],
    paddingInline: space['3'],
    outline: 'none',
    userSelect: 'none',
    // Mutually exclusive: pressing beats the highlight.
    backgroundColor: {
      default: null,
      ':is(:focus, [data-highlighted]):not(:active)': colors.accent,
      ':active': colors.pressed,
    },
    color: {
      default: null,
      ':is(:focus, [data-highlighted], :active)': colors.accentForeground,
    },
    pointerEvents: {
      default: null,
      ':is([data-disabled])': 'none',
      [SVG]: 'none',
    },
    opacity: { default: null, ':is([data-disabled])': 0.5 },
    flexShrink: { default: null, [SVG]: 0 },
    width: { default: null, [SVG]: size['4'] },
    height: { default: null, [SVG]: size['4'] },
  },
  /** Items that span the list, as in select and combobox. */
  fullWidth: {
    width: { default: '100%', [SVG]: size['4'] },
  },
  /** Room on the right for a check indicator. */
  withIndicator: { paddingRight: space['6'] },
  /** Lines the text up with items that have a leading icon. */
  inset: { paddingLeft: size['9.5'] },
  /** Holds the check mark of a selected item. */
  indicator: {
    pointerEvents: 'none',
    position: 'absolute',
    right: size['2'],
    display: 'flex',
    width: size['4'],
    height: size['4'],
    alignItems: 'center',
    justifyContent: 'center',
  },
  /** A heading over menu items. Compose after `textStyles['1']`. */
  label: {
    paddingInline: space['3'],
    paddingBlock: space['2'],
    color: colors.mutedForeground,
  },
  separator: {
    marginInline: `-${space['1']}`,
    marginBlock: space['1'],
    height: size.px,
    backgroundColor: `color-mix(in oklab, ${colors.border} 50%, transparent)`,
  },
})

const SM = '@media (min-width: 40rem)'

export const dialog = stylex.create({
  /** The dimmed, blurred backdrop behind a modal. Compose with `animations.fade`. */
  overlay: {
    position: 'fixed',
    inset: 0,
    isolation: 'isolate',
    zIndex: 50,
    backgroundColor: 'rgb(0 0 0 / 80%)',
    backdropFilter: {
      default: null,
      '@supports (backdrop-filter: blur(0))': 'blur(4px)',
    },
  },
  /** A panel centred in the viewport. Compose after `textStyles['2']`, with `animations.zoom`. */
  panel: {
    position: 'fixed',
    top: '50%',
    left: '50%',
    zIndex: 50,
    display: 'grid',
    width: '100%',
    maxWidth: { default: `calc(100% - ${size['8']})`, [SM]: '28rem' },
    translate: '-50% -50%',
    gap: space['5'],
    borderRadius: radii['4xl'],
    backgroundColor: colors.popover,
    padding: space['5'],
    color: colors.popoverForeground,
    boxShadow: shadows.outline,
    outline: 'none',
  },
  /** A roomy panel for a task of its own: tall, with the body scrolling between header and footer. Compose after `panel`. */
  panelLarge: {
    gridTemplateRows: 'auto minmax(0, 1fr) auto',
    gap: space['6'],
    boxSizing: 'border-box',
    maxWidth: { default: `calc(100% - ${size['8']})`, [SM]: size['288'] },
    height: `calc(100dvh - ${size['16']})`,
    maxHeight: size['288'],
    padding: { default: space['5'], [SM]: space['7'] },
  },
  /** A mid-width panel for a list: it hugs its content up to the viewport, the body scrolling past that. Compose after `panel`. */
  panelMedium: {
    gridTemplateRows: 'auto minmax(0, 1fr) auto',
    gap: space['5'],
    boxSizing: 'border-box',
    maxWidth: { default: `calc(100% - ${size['8']})`, [SM]: '40rem' },
    maxHeight: `calc(100dvh - ${size['16']})`,
    padding: { default: space['5'], [SM]: space['6'] },
  },
  /** The part of a large or medium panel that scrolls. */
  body: { minHeight: 0, overflowY: 'auto', paddingInline: space['1'] },
  // The footer stacks its actions on a phone, primary last, and rows them after.
  footer: {
    flexDirection: { default: 'column-reverse', [SM]: 'row' },
    justifyContent: { default: null, [SM]: 'flex-end' },
  },
  /** Compose after `textStyles['3']`. */
  title: {
    margin: 0,
    fontFamily: fonts.heading,
    fontWeight: 500,
  },
  /** Compose after `textStyles['2']`. `:where(*) > a` styles links passed as children. */
  description: {
    margin: 0,
    color: {
      default: colors.mutedForeground,
      ':where(*) > a:hover': colors.foreground,
    },
    textDecorationLine: { default: null, ':where(*) > a': 'underline' },
    textUnderlineOffset: { default: null, ':where(*) > a': 3 },
  },
})
