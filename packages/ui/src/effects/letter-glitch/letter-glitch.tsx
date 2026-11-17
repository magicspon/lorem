import * as React from 'react'
import * as stylex from '@stylexjs/stylex'

import { useSystemColorScheme } from '#/actions/color-scheme-toggle/index.ts'
import { styleProps, type WithSx } from '#/lib/sx.ts'
import { startEngine, type Engine } from './engine.ts'
import { toSettings, type LetterGlitchOptions } from './settings.ts'

// Adapted from LetterGlitch in React Bits (https://reactbits.dev), split into
// modules and typed for this repo. The drawing and timing are unchanged.

const styles = stylex.create({
  fill: {
    position: 'relative',
    width: '100%',
    height: '100%',
    overflow: 'hidden',
  },
  // Behind everything on the page, and out of the way of clicks. The effect
  // still follows the cursor, since it listens on the window.
  backdrop: {
    position: 'fixed',
    inset: 0,
    zIndex: -1,
    overflow: 'hidden',
    pointerEvents: 'none',
  },
  canvas: {
    position: 'absolute',
    inset: 0,
    display: 'block',
    width: '100%',
    height: '100%',
  },
})

/** Props for `LetterGlitch`. */
type LetterGlitchProps = WithSx<
  Omit<React.ComponentProps<'div'>, 'children' | keyof LetterGlitchOptions>
> &
  LetterGlitchOptions & {
    /** `fill` fills its parent, which sets the size. `backdrop` sits fixed behind the whole page. */
    variant?: 'fill' | 'backdrop'
  }

/**
 * A field of letters that scramble and glitch, drawn with WebGL 2. It is
 * decoration, so it is hidden from assistive technology. It follows the
 * system's colour scheme unless `lightMode` is set, holds still for people who
 * ask for reduced motion, and stays empty where WebGL 2 is missing.
 */
function LetterGlitch({
  variant = 'fill',
  lightMode,
  glitchColors,
  baseColor,
  characters,
  fontFamily,
  fontSize,
  spacing,
  density,
  baseOpacity,
  glitchAmount,
  speed,
  flow,
  smooth,
  interactive,
  cursorRadius,
  clickEffect,
  edgeFade,
  centerFade,
  intro,
  opacity,
  backgroundColor,
  dpr,
  sx,
  style,
  ...props
}: LetterGlitchProps) {
  const scheme = useSystemColorScheme()
  const containerRef = React.useRef<HTMLDivElement>(null)
  const canvasRef = React.useRef<HTMLCanvasElement>(null)
  const engineRef = React.useRef<Engine | null>(null)
  const settings = toSettings({
    lightMode: lightMode ?? scheme === 'light',
    glitchColors,
    baseColor,
    characters,
    fontFamily,
    fontSize,
    spacing,
    density,
    baseOpacity,
    glitchAmount,
    speed,
    flow,
    smooth,
    interactive,
    cursorRadius,
    clickEffect,
    edgeFade,
    centerFade,
    intro,
    opacity,
    backgroundColor,
    dpr,
  })
  // The engine reads the latest settings each frame, so a prop change needs
  // no restart: only a wake, for a loop that has gone idle.
  const settingsRef = React.useRef(settings)
  React.useLayoutEffect(() => {
    settingsRef.current = settings
    engineRef.current?.wake()
  })

  React.useEffect(() => {
    const container = containerRef.current
    const canvas = canvasRef.current
    if (!container || !canvas) return undefined
    const engine = startEngine(container, canvas, () => settingsRef.current)
    engineRef.current = engine
    return () => {
      engine?.dispose()
      engineRef.current = null
    }
  }, [])

  return (
    <div
      ref={containerRef}
      data-slot="letter-glitch"
      aria-hidden
      {...styleProps([styles[variant], sx], style)}
      {...props}
    >
      <canvas ref={canvasRef} {...stylex.props(styles.canvas)} />
    </div>
  )
}

export { LetterGlitch }
export type { LetterGlitchProps }
