import * as stylex from '@stylexjs/stylex'
import * as React from 'react'

import { styleProps, type WithSx } from '#/lib/sx.ts'
import { VisuallyHidden } from '#/typography/visually-hidden/index.ts'
import { startEngine, type Engine } from './engine.ts'
import { toSettings, type ScrambledTextOptions } from './settings.ts'

// Adapted from ScrambledText in React Bits (https://reactbits.dev), inspired by
// Tom Miller's GSAP pen. Split into modules and typed for this repo; the motion
// is unchanged.

/** Props for `ScrambledText`. */
type ScrambledTextProps = WithSx<
  Omit<React.ComponentProps<'span'>, 'children' | keyof ScrambledTextOptions>
> &
  ScrambledTextOptions & {
    /** The text. Plain text only, since it is split into letters. */
    children: string
  }

const styles = stylex.create({
  // With the intro on, the text waits unseen until the engine has scrambled
  // it, so the plain text never flashes before the decode. The engine fades
  // it in.
  pending: { opacity: 0 },
})

// Letters are measured once split, so splitting waits for web fonts.
function useFontsReady(): boolean {
  const [ready, setReady] = React.useState(
    () => typeof document === 'undefined' || document.fonts.status === 'loaded',
  )
  React.useEffect(() => {
    if (ready) return undefined
    let live = true
    const done = () => {
      if (live) setReady(true)
    }
    document.fonts.ready.then(done, done)
    return () => {
      live = false
    }
  }, [ready])
  return ready
}

/**
 * Text whose letters scramble, lift, blur or magnify near the pointer, and
 * decode from scrambled characters as it scrolls into view. A `span` that
 * takes its font and colour from around it, so put it inside `Text`. A screen
 * reader reads the text once, as plain text. With the intro on, the text
 * fades in as it starts to decode. For reduced motion, letters never move and
 * the intro is skipped.
 */
function ScrambledText({
  effect,
  radius,
  strength,
  trail,
  duration,
  speed,
  clickBurst,
  scrambleChars,
  scrambleColor,
  intro,
  children,
  sx,
  style,
  ...props
}: ScrambledTextProps) {
  const rootRef = React.useRef<HTMLSpanElement>(null)
  const textRef = React.useRef<HTMLSpanElement>(null)
  const engineRef = React.useRef<Engine | null>(null)
  const fontsReady = useFontsReady()
  const settings = toSettings({
    effect,
    radius,
    strength,
    trail,
    duration,
    speed,
    clickBurst,
    scrambleChars,
    scrambleColor,
    intro,
  })
  // The engine reads the latest settings on every use, so most prop changes
  // need no restart.
  const settingsRef = React.useRef(settings)
  React.useLayoutEffect(() => {
    settingsRef.current = settings
  })

  // New text, or turning the intro on or off, splits the letters again.
  React.useLayoutEffect(() => {
    const root = rootRef.current
    const text = textRef.current
    if (!root || !text || !fontsReady) return undefined
    const engine = startEngine(root, text, () => settingsRef.current)
    engineRef.current = engine
    return () => {
      engine.dispose()
      engineRef.current = null
    }
  }, [children, settings.intro, fontsReady])

  // Letters left mid-lift by the old effect would otherwise stay put.
  React.useEffect(() => {
    engineRef.current?.reset()
  }, [settings.effect])

  return (
    <span
      ref={rootRef}
      data-slot="scrambled-text"
      {...styleProps([sx], style)}
      {...props}
    >
      <VisuallyHidden>{children}</VisuallyHidden>
      {/* Keyed, so React never reconciles text that SplitText has rewritten. */}
      <span
        key={children}
        ref={textRef}
        aria-hidden
        sx={settings.intro && styles.pending}
      >
        {children}
      </span>
    </span>
  )
}

export { ScrambledText }
export type { ScrambledTextProps }
