import * as stylex from '@stylexjs/stylex'

import { colors, fontSize, lineHeight } from '../styles/tokens.stylex'

// The props `Text` and `Heading` share, as static maps keyed by the prop's
// value. StyleX needs a literal object in `create()`, so each step is spelled out.

// StyleX selectors must be literals in the file that uses them.
const MD = '@media (min-width: 48rem)'

// Cut the leading above the first line and below the last, so spacing around
// text measures from its glyphs rather than its line box.
const TRIM = 'trim-both cap alphabetic'

/**
 * Font size, its line height and the leading trim, by step of the type
 * scale. The one place any of them is set: a part that is not `Text` or `Heading` composes a
 * step before its own styles (`sx={[textStyles['2'], styles.label]}`).
 */
export const textStyles = stylex.create({
  '1': {
    fontSize: fontSize['1'],
    lineHeight: lineHeight['1'],
    textBox: TRIM,
  },
  '2': {
    fontSize: fontSize['2'],
    lineHeight: lineHeight['2'],
    textBox: TRIM,
  },
  '3': {
    fontSize: fontSize['3'],
    lineHeight: lineHeight['3'],
    textBox: TRIM,
  },
  '4': {
    fontSize: fontSize['4'],
    lineHeight: lineHeight['4'],
    textBox: TRIM,
  },
  '5': {
    fontSize: fontSize['5'],
    lineHeight: lineHeight['5'],
    textBox: TRIM,
  },
  '6': {
    fontSize: fontSize['6'],
    lineHeight: lineHeight['6'],
    textBox: TRIM,
  },
  '7': {
    fontSize: fontSize['7'],
    lineHeight: lineHeight['6'],
    textBox: TRIM,
  },
  '8': {
    fontSize: fontSize['8'],
    lineHeight: lineHeight['8'],
    textBox: TRIM,
  },
  '9': {
    fontSize: fontSize['9'],
    lineHeight: lineHeight['9'],
    textBox: TRIM,
  },
  // Text typed into a control: step 3 on a phone, since iOS Safari zooms into
  // a focused control set smaller than 16px, and step 2 from `md` up.
  // Untrimmed: a control clips its text to the line box, so a trimmed one
  // cuts off descenders and the dots on i and j.
  control: {
    fontSize: { default: fontSize['3'], [MD]: fontSize['2'] },
    lineHeight: { default: lineHeight['3'], [MD]: lineHeight['2'] },
    textBox: 'normal',
  },
})

/** Font weight. */
const weight = stylex.create({
  regular: { fontWeight: 400 },
  medium: { fontWeight: 500 },
  semibold: { fontWeight: 600 },
  bold: { fontWeight: 700 },
})

/** Text colour, by role. `default` inherits, so text in a part takes its colour. */
const tone = stylex.create({
  default: { color: 'inherit' },
  strong: { color: colors.foreground },
  muted: { color: colors.mutedForeground },
  accent: { color: colors.primaryText },
  destructive: { color: colors.destructive },
})

/** Text alignment. */
const align = stylex.create({
  start: { textAlign: 'start' },
  center: { textAlign: 'center' },
  end: { textAlign: 'end' },
})

/** How lines break: `nowrap` keeps one line, `pretty` and `balance` even out the rag. */
const wrap = stylex.create({
  wrap: { whiteSpace: 'normal' },
  nowrap: { whiteSpace: 'nowrap' },
  pretty: { textWrap: 'pretty' },
  balance: { textWrap: 'balance' },
})

const options = stylex.create({
  // One line, cut with an ellipsis. A flex child also needs `minWidth: 0`.
  // Untrimmed, as clipped text would lose its descenders.
  truncate: {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    textBox: 'normal',
  },
  // Figures of equal width, so a column of numbers lines up.
  numeric: { fontVariantNumeric: 'tabular-nums' },
  // Long unbroken strings, such as URLs and ids, wrap instead of overflowing.
  breakAnywhere: { overflowWrap: 'anywhere' },
  trim: { textBox: TRIM },
  // The full line box, where it matters, such as text beside an icon.
  untrimmed: { textBox: 'normal' },
})

/** A step of the type scale. */
export type TextSize = Exclude<keyof typeof textStyles, 'control'>
/** A font weight. */
export type TextWeight = keyof typeof weight
/** A text colour role. */
export type TextTone = keyof typeof tone
/** A text alignment. */
export type TextAlign = keyof typeof align

/** The typographic props `Text` and `Heading` share. */
export type TypeProps = {
  size?: TextSize
  weight?: TextWeight
  tone?: TextTone
  align?: TextAlign
  wrap?: keyof typeof wrap
  /** Keep to one line and cut with an ellipsis. The line is left untrimmed. */
  truncate?: boolean
  /** Use figures of equal width, for numbers in a column. */
  numeric?: boolean
  /** Let a long unbroken string wrap anywhere. */
  breakAnywhere?: boolean
  /**
   * Trim the leading above the first line and below the last. On by default;
   * pass `false` where the full line box matters, such as text beside an icon.
   */
  trim?: boolean
}

/** Resolves the shared typographic props to their styles, in a fixed order. */
export function typeStyles(props: TypeProps) {
  return [
    props.size && textStyles[props.size],
    props.weight && weight[props.weight],
    props.tone && tone[props.tone],
    props.align && align[props.align],
    props.wrap && wrap[props.wrap],
    props.truncate && options.truncate,
    props.numeric && options.numeric,
    props.breakAnywhere && options.breakAnywhere,
    // After the size, so `trim={false}` undoes the step's own trim. A truncated
    // line is never trimmed: its `overflow: hidden` would clip the descenders.
    props.trim === false || props.truncate ? options.untrimmed : options.trim,
  ] as const
}
