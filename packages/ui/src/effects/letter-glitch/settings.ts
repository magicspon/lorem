/** What a click does: `tear` rips a glitch along the rows, `burst` sends glitches outward. */
export type LetterGlitchClickEffect = 'tear' | 'burst' | 'none'

/** Everything that changes how `LetterGlitch` looks and moves. */
export type LetterGlitchOptions = {
  /** Up to 8 colours that glitching letters light up in. */
  glitchColors?: readonly string[]
  /** Colour of the letters at rest. */
  baseColor?: string
  /** Characters to draw. Repeat one to make it appear more often. */
  characters?: string
  /** Font for the letters. A web font is drawn once it has loaded. */
  fontFamily?: string
  /** Size of the letters in px, 6 to 96. */
  fontSize?: number
  /** Room around each letter, relative to the font size, 0 to 2. */
  spacing?: number
  /** Share of the grid that shows a letter at rest, 0 to 1. */
  density?: number
  /** Opacity of the letters at rest, 0 to 1. */
  baseOpacity?: number
  /** How often letters glitch, 0 (never) to 1 (constantly). */
  glitchAmount?: number
  /** Tempo of the scrambling and glitches. 0 freezes the letters. */
  speed?: number
  /** Strength of the soft waves of light drifting across the letters, 0 to 1. */
  flow?: number
  /** Fades glitching letters in and out. Off, they flicker on and off. */
  smooth?: boolean
  /** Lights up and scrambles the letters near the cursor. */
  interactive?: boolean
  /** Radius of the area around the cursor that reacts, in px. */
  cursorRadius?: number
  /** What a click does. */
  clickEffect?: LetterGlitchClickEffect
  /** Fades the letters out toward the edges, 0 to 0.5. */
  edgeFade?: number
  /** Clears the letters behind the middle, to keep content there readable, 0 to 1. */
  centerFade?: number
  /** Boots the letters in with a flicker. */
  intro?: boolean
  /** Switches the default colours to dark ink, for light backgrounds. */
  lightMode?: boolean
  /** Opacity of the whole effect, 0 to 1. Lower it to keep content over it readable. */
  opacity?: number
  /** Paints an opaque background. Unset, the canvas is transparent. */
  backgroundColor?: string
  /** Highest device pixel ratio to draw at, capped at 2. */
  dpr?: number
}

/** The options with defaults filled in and every number in range. */
export type Settings = {
  colors: string[]
  baseColor: string
  characters: string
  fontFamily: string
  fontSize: number
  spacing: number
  density: number
  baseOpacity: number
  glitchAmount: number
  speed: number
  flow: number
  smooth: boolean
  interactive: boolean
  cursorRadius: number
  clickEffect: LetterGlitchClickEffect
  edgeFade: number
  centerFade: number
  intro: boolean
  opacity: number
  backgroundColor: string | undefined
  dpr: number | undefined
}

/** The shader's palette holds this many. */
export const MAX_COLORS = 8

const DEFAULT_CHARACTERS =
  'ABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$&*()-_+=/[]{};:<>.,0123456789'
// The `fonts.mono` token's stack, which the canvas cannot read as a variable.
const DEFAULT_FONT = 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace'
const DARK_COLORS = ['#ffffff', '#61dca3']
const LIGHT_COLORS = ['#18181b', '#0f9f6e']

/** `value`, held between `min` and `max`. */
export const clamp = (value: number, min: number, max: number): number =>
  Math.min(max, Math.max(min, value))

/** An ease that starts and ends flat, on 0 to 1. */
export const smoother = (value: number): number => {
  const x = clamp(value, 0, 1)
  return x * x * x * (x * (x * 6 - 15) + 10)
}

/** Fills in the defaults and holds every number in the range the engine expects. */
export function toSettings(o: LetterGlitchOptions): Settings {
  const light = o.lightMode ?? false
  const colors = o.glitchColors?.length
    ? [...o.glitchColors]
    : light
      ? LIGHT_COLORS
      : DARK_COLORS
  return {
    colors: colors.slice(0, MAX_COLORS),
    baseColor: o.baseColor || (light ? '#18181b' : '#ffffff'),
    characters: o.characters || DEFAULT_CHARACTERS,
    fontFamily: o.fontFamily || DEFAULT_FONT,
    fontSize: clamp(o.fontSize ?? 14, 6, 96),
    spacing: clamp(o.spacing ?? 0.6, 0, 2),
    density: clamp(o.density ?? 0.9, 0, 1),
    baseOpacity: clamp(o.baseOpacity ?? 0.16, 0, 1),
    glitchAmount: clamp(o.glitchAmount ?? 0.5, 0, 1),
    speed: Math.max(0, o.speed ?? 1),
    flow: clamp(o.flow ?? 0.5, 0, 1),
    smooth: o.smooth ?? true,
    interactive: o.interactive ?? true,
    cursorRadius: Math.max(0, o.cursorRadius ?? 140),
    clickEffect: o.clickEffect ?? 'tear',
    edgeFade: clamp(o.edgeFade ?? 0, 0, 0.5),
    centerFade: clamp(o.centerFade ?? 0, 0, 1),
    intro: o.intro ?? true,
    opacity: clamp(o.opacity ?? 1, 0, 1),
    backgroundColor: o.backgroundColor,
    dpr: o.dpr,
  }
}
