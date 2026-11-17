import * as stylex from '@stylexjs/stylex'

import {
  amber,
  amberDark,
  blackA,
  blue,
  blueDark,
  crimson,
  crimsonDark,
  green,
  greenDark,
  mint,
  mintA,
  mintDark,
  mintDarkA,
  orange,
  orangeDark,
  red,
  redA,
  redDark,
  redDarkA,
  sage,
  sageA,
  sageDark,
  sageDarkA,
  violet,
  violetDark,
} from './radix.stylex'

// Each token holds both schemes. `light-dark()` resolves where the colour is
// used, against that element's `color-scheme`: the system's by default (see
// `globals.css`), or the one `lightTheme` or `darkTheme` sets.
const ld = (light: string, dark: string) => `light-dark(${light}, ${dark})`

/**
 * Colour tokens, from Radix Colors (https://www.radix-ui.com/colors). Each
 * takes the step Radix designs for its use: 1–2 app backgrounds, 3–5 component
 * fills (rest, hover, pressed), 6 borders of surfaces, 7 borders of controls,
 * 8 hovered borders and focus rings, 9–10 solid fills (rest, hover) and
 * shadows, 11–12 text (low and high contrast). The `A` scales are the same steps with alpha, for fills
 * over any surface. Sage is the neutral Radix pairs with mint, the primary.
 */
export const colors = stylex.defineVars({
  background: ld(sage[1], sageDark[1]),
  foreground: ld(sage[12], sageDark[12]),
  card: ld('#ffffff', sageDark[2]),
  cardForeground: ld(sage[12], sageDark[12]),
  popover: ld('#ffffff', sageDark[2]),
  popoverForeground: ld(sage[12], sageDark[12]),
  primary: ld(mint[9], mintDark[9]),
  /** Text on a `primary` fill. Mint's solid step is bright, so Radix puts dark text on it. */
  primaryForeground: mint[12],
  /** Text in the primary's colour, such as a link. Step 11, since step 9 is too light to read. */
  primaryText: ld(mint[11], mintDark[11]),
  secondary: ld(sage[3], sageDark[3]),
  secondaryForeground: ld(sage[12], sageDark[12]),
  muted: ld(sage[3], sageDark[3]),
  mutedForeground: ld(sage[11], sageDark[11]),
  accent: ld(sage[3], sageDark[3]),
  accentForeground: ld(sage[12], sageDark[12]),
  destructive: ld(red[9], redDark[9]),
  /** A good state, such as online. */
  success: ld(green[9], greenDark[9]),
  /** A state that needs attention soon. */
  warning: ld(amber[9], amberDark[9]),
  border: ld(sage[6], sageDark[6]),
  input: ld(sage[7], sageDark[7]),
  ring: ld(sage[8], sageDark[8]),

  /*
   * Interaction states. Every control reads these rather than mixing its own,
   * so the library sets hover, pressed and focus once. Each pressed fill sits
   * one step past its hover.
   */
  /** The 3px halo every focused control draws, with a `ring` border. */
  focusRing: ld(sageA[8], sageDarkA[8]),
  /** Primary fill, hovered and pressed. Radix has no pressed solid step. */
  primaryHover: ld(mint[10], mintDark[10]),
  primaryPressed: `color-mix(in oklab, ${ld(mint[10], mintDark[10])}, ${ld(sage[12], sageDark[12])} 10%)`,
  /** Secondary fill, hovered and pressed. */
  secondaryHover: ld(sage[4], sageDark[4]),
  secondaryPressed: ld(sage[5], sageDark[5]),
  /** Fill of a bordered control (input, select, outline button) at rest. */
  controlBackground: ld(sageA[2], sageDarkA[2]),
  /** Fill of a bordered control while pressed. */
  controlPressed: ld(sageA[4], sageDarkA[4]),
  /** Border of a focused destructive button. */
  destructiveFocusBorder: ld(red[8], redDark[8]),
  /** Destructive fill while pressed. */
  destructiveSubtlePressed: ld(redA[5], redDarkA[5]),
  /** Switch track when off and hovered. */
  switchTrackHover: ld(sage[7], sageDark[7]),
  /** The hairline round a whole-card link, at rest and hovered. */
  cardOutline: ld(sageA[7], sageDarkA[7]),
  cardOutlineHover: ld(sageA[8], sageDarkA[8]),

  /** Border of an `aria-invalid` control. */
  invalidBorder: ld(red[7], redDark[7]),
  /** Ring of an `aria-invalid` or focused destructive control. */
  invalidRing: ld(redA[8], redDarkA[8]),
  /** Destructive button fill, at rest and hovered. */
  destructiveSubtle: ld(redA[3], redDarkA[3]),
  destructiveSubtleHover: ld(redA[4], redDarkA[4]),
  /** Ghost button fill on hover. */
  ghostHover: ld(sageA[4], sageDarkA[4]),
  /** Fill of a list item or toggle while pressed, a step past its hover. */
  pressed: ld(sageA[5], sageDarkA[5]),
  /** Switch track when off. */
  switchTrack: ld(sage[6], sageDark[6]),
  /** Switch thumb, on and off. */
  switchThumbOn: '#ffffff',
  switchThumbOff: ld('#ffffff', sageDark[12]),
  /** Unchecked checkbox and radio fill. */
  checkboxBackground: 'transparent',
  /** Fill of a bordered control on hover, a step past `controlBackground`. */
  controlHover: ld(sageA[3], sageDarkA[3]),
  /** The hairline round a popup, menu, tooltip or dialog. */
  menuRing: ld(sageA[6], sageDarkA[6]),
  /**
   * The colour of every elevation shadow, which mixes it down. Step 9, as
   * Radix gives shadows; dark takes `blackA`, since a dark alpha step lightens.
   */
  shadow: ld(sageA[9], blackA[9]),
  /** Tab trigger text, and the active tab's fill and border. */
  tabForeground: ld(sage[11], sageDark[11]),
  tabActiveBackground: ld('#ffffff', sageDarkA[3]),
  tabActiveBorder: ld('transparent', sageDarkA[6]),
  /** Drawer popup border. */
  drawerBorder: ld('#ffffff', sageDarkA[4]),
  /** Border and fill of a choice card whose control is checked. */
  choiceCardBorder: ld(mint[7], mintDark[7]),
  choiceCardBackground: ld(mintA[2], mintDarkA[2]),

  /**
   * Categorical chart series, ordered: mint, blue, violet, orange and crimson.
   * Hues spread round the wheel so no series reads as more important than
   * another, and the first is the primary's. Dark takes step 10, a step
   * lighter, so each series keeps its contrast against a dark card.
   */
  chart1: ld(mint[9], mintDark[10]),
  chart2: ld(blue[9], blueDark[10]),
  chart3: ld(violet[9], violetDark[10]),
  chart4: ld(orange[9], orangeDark[10]),
  chart5: ld(crimson[9], crimsonDark[10]),
  /** Fill of the band or crosshair that follows the focused chart value. */
  chartCursor: ld(sageA[3], sageDarkA[3]),
})

/** Corner radii, scaled from a 0.625rem base. */
export const radii = stylex.defineVars({
  sm: 'calc(0.25rem * 0.6)',
  md: 'calc(0.25rem * 0.8)',
  lg: '0.25rem',
  xl: 'calc(0.25rem * 1.4)',
  '2xl': 'calc(0.25rem * 1.8)',
  '3xl': 'calc(0.25rem * 2.2)',
  '4xl': 'calc(0.25rem * 2.6)',
  /** A pill or a circle, whatever the element's size. */
  full: '9999px',
})

/**
 * The space scale, for gap, padding and margin only. Nine steps, as in Radix
 * Themes: the key is the step, not a length, so the scale stays short and
 * every layout prop takes one of these keys.
 *
 * Constants, not variables, so a step inlines as a plain length and can be
 * negated or nested in `calc()`.
 */
export const space = stylex.defineConsts({
  '0': '0',
  '1': '0.25rem',
  '2': '0.5rem',
  '3': '0.75rem',
  '4': '1rem',
  '5': '1.5rem',
  '6': '2rem',
  '7': '2.5rem',
  '8': '3rem',
  '9': '4rem',
})

/** A step of the space scale, the type every layout prop takes. */
export type Space = keyof typeof space

/**
 * Fixed dimensions: control heights, icon sizes, offsets and container widths.
 * Keyed by the length's multiple of 0.25rem, so `size['9']` is 2.25rem. Only
 * the lengths in use are listed; add one here rather than writing it literally.
 */
export const size = stylex.defineConsts({
  /** A hairline: a separator, or a visually hidden element. */
  px: '1px',
  '0.5': '0.125rem',
  '0.75': '0.1875rem',
  '1': '0.25rem',
  '1.25': '0.3125rem',
  '1.5': '0.375rem',
  '2': '0.5rem',
  '2.5': '0.625rem',
  '3': '0.75rem',
  '3.5': '0.875rem',
  '4': '1rem',
  '4.6': '1.15rem',
  '5': '1.25rem',
  '5.5': '1.375rem',
  '6': '1.5rem',
  '7': '1.75rem',
  '8': '2rem',
  '9': '2.25rem',
  '9.5': '2.375rem',
  '10': '2.5rem',
  '11': '2.75rem',
  '12': '3rem',
  '16': '4rem',
  '18': '4.5rem',
  '20': '5rem',
  '24': '6rem',
  '25': '6.25rem',
  '28': '7rem',
  '32': '8rem',
  '36': '9rem',
  '40': '10rem',
  '44': '11rem',
  '48': '12rem',
  '52': '13rem',
  '56': '14rem',
  '60': '15rem',
  '64': '16rem',
  '72': '18rem',
  '80': '20rem',
  '90': '22.5rem',
  '96': '24rem',
  '288': '72rem',
})

/** A fixed dimension from the size scale. */
export type Size = keyof typeof size
/** Font families. Geist Mono is loaded by `globals.css`. */
export const fonts = stylex.defineVars({
  // The whole product is set in Geist Mono, so every family points at it.
  // A list rather than bare `monospace`, which browsers shrink to 13px.
  sans: "'Geist Mono Variable', ui-monospace, monospace",
  heading: "'Geist Mono Variable', ui-monospace, monospace",
  mono: "'Geist Mono Variable', ui-monospace, monospace",
})

/**
 * The type scale, in nine steps as in Radix Themes. Set it through
 * `textStyles` in `typography/type-styles.ts`, never directly.
 */
export const fontSize = stylex.defineConsts({
  '1': '0.75rem',
  '2': '0.875rem',
  '3': '1rem',
  '4': '1.125rem',
  '5': '1.25rem',
  '6': '1.5rem',
  '7': '1.75rem',
  '8': '2.1875rem',
  '9': '3.75rem',
})

/** The line height paired with each step of `fontSize`. */
export const lineHeight = stylex.defineConsts({
  '1': '1rem',
  '2': '1.25rem',
  '3': '1.5rem',
  '4': '1.625rem',
  '5': '1.75rem',
  '6': '1.875rem',
  '7': '2.25rem',
  '8': '2.5rem',
  '9': '3.75rem',
})

/** A step of the type scale. */
export type FontSize = keyof typeof fontSize

/** Shared transition timing. */
export const motion = stylex.defineConsts({
  ease: 'cubic-bezier(0.4, 0, 0.2, 1)',
  fast: '100ms',
  normal: '150ms',
})
