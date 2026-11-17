import { gsap } from 'gsap'
import { ScrambleTextPlugin } from 'gsap/ScrambleTextPlugin'
import { SplitText } from 'gsap/SplitText'

import { clear, measure, splitLetters } from './letters.ts'
import { scrambleNearPointer, step, type MotionState } from './motion.ts'
import { isPhysical, type Settings } from './settings.ts'

gsap.registerPlugin(SplitText, ScrambleTextPlugin)

/** A running effect. */
export type Engine = {
  /** Puts every letter back at rest, for a change of effect. */
  reset: () => void
  /** Stops everything and restores the original text. */
  dispose: () => void
}

/**
 * Splits `textEl` into letters and makes them react to the pointer over
 * `root`. Reads `settings` on every use, so a prop change needs no restart.
 */
export function startEngine(
  root: HTMLElement,
  textEl: HTMLElement,
  settings: () => Settings,
): Engine {
  const letters = splitLetters(textEl)
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  let measured = false
  let raf = 0
  let last = 0
  let moveFrame = 0

  const state: MotionState = {
    letters,
    pointer: { x: 0, y: 0, sx: 0, sy: 0, inside: false },
    waves: [],
    fontPx: 16,
    reduce,
    settings,
    ensureMeasured: () => {
      if (measured) return
      state.fontPx = measure(root, textEl, letters)
      measured = true
    },
    scramble: (i, length, revealDelay = 0) => {
      const { speed, scrambleChars, scrambleColor } = settings()
      const glyph = letters.glyphs[i]
      const text = letters.originals[i] ?? ''
      return {
        overwrite: true,
        duration: length,
        ease: 'none',
        scrambleText: { text, chars: scrambleChars, speed, revealDelay },
        onUpdate: () => {
          if (!glyph) return
          const scrambled = glyph.textContent !== text
          glyph.style.color = scrambleColor && scrambled ? scrambleColor : ''
        },
      }
    },
  }
  const { scramble } = state

  // The intro holds the letters scrambled until the text scrolls into view.
  let decode: gsap.core.Timeline | undefined
  let observer: IntersectionObserver | undefined
  // The text starts hidden while the intro is on, and shows once scrambled.
  const fadeIn = (fade: number) =>
    gsap.to(textEl, { opacity: 1, duration: fade, ease: 'power1.out' })
  if (settings().intro && reduce) fadeIn(0)
  if (settings().intro && !reduce) {
    const pace = settings().duration
    const timeline = gsap.timeline({ paused: true })
    const count = letters.glyphs.length
    letters.glyphs.forEach((glyph, i) => {
      const reveal = 0.15 + pace * (0.75 * (i / count) + 0.25 * Math.random())
      timeline.to(glyph, scramble(i, reveal + 0.1, reveal), 0)
    })
    timeline.time(0.001)
    observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return
        observer?.disconnect()
        fadeIn(0.4)
        timeline.play()
      },
      { rootMargin: '0px 0px -10% 0px' },
    )
    observer.observe(root)
    decode = timeline
  }

  const tick = (now: number) => {
    raf = 0
    const dt = last ? Math.min(0.05, (now - last) / 1000) : 1 / 60
    last = now
    if (step(state, dt)) raf = requestAnimationFrame(tick)
    else last = 0
  }
  const wake = () => {
    if (!raf) raf = requestAnimationFrame(tick)
  }

  // A pointer's position within `root`, undoing any scale on an ancestor.
  const toLocal = (e: PointerEvent): [number, number] => {
    const rect = root.getBoundingClientRect()
    const scaleX = root.offsetWidth ? rect.width / root.offsetWidth : 1
    const scaleY = root.offsetHeight ? rect.height / root.offsetHeight : 1
    return [
      (e.clientX - rect.left) / (scaleX || 1),
      (e.clientY - rect.top) / (scaleY || 1),
    ]
  }

  const handleEnter = () => {
    measured = false
  }
  const handleMove = (e: PointerEvent) => {
    const { pointer } = state
    const [x, y] = toLocal(e)
    pointer.x = x
    pointer.y = y
    if (!pointer.inside) {
      pointer.sx = x
      pointer.sy = y
      pointer.inside = true
    }
    if (isPhysical(settings().effect)) {
      if (!reduce) wake()
    } else if (!moveFrame) {
      moveFrame = requestAnimationFrame(() => {
        moveFrame = 0
        scrambleNearPointer(state)
      })
    }
  }
  const handleLeave = () => {
    state.pointer.inside = false
    wake()
  }
  const handleDown = (e: PointerEvent) => {
    if (!settings().clickBurst) return
    if (e.pointerType === 'mouse' && e.button !== 0) return
    state.ensureMeasured()
    const [x, y] = toLocal(e)
    // The ring reaches the furthest letter, then a little past it.
    let reach = 0
    for (const p of letters.points) {
      reach = Math.max(reach, Math.hypot(p.x - x, p.y - y))
    }
    reach += state.fontPx
    if (state.waves.length > 3) state.waves.shift()
    const life = 0.45 + reach / 1100
    const hit = new Uint8Array(letters.chars.length)
    state.waves.push({ x, y, age: 0, r: 0, fade: 1, reach, life, hit })
    wake()
  }

  const resize = new ResizeObserver(() => {
    measured = false
  })
  resize.observe(root)
  root.addEventListener('pointerenter', handleEnter)
  root.addEventListener('pointermove', handleMove)
  root.addEventListener('pointerleave', handleLeave)
  root.addEventListener('pointerdown', handleDown)

  return {
    reset: () => {
      for (const p of letters.points) {
        p.energy = 0
        p.dx = 0
        p.dy = 0
      }
      letters.chars.forEach((_, i) => clear(letters, i))
    },
    dispose: () => {
      root.removeEventListener('pointerenter', handleEnter)
      root.removeEventListener('pointermove', handleMove)
      root.removeEventListener('pointerleave', handleLeave)
      root.removeEventListener('pointerdown', handleDown)
      resize.disconnect()
      cancelAnimationFrame(raf)
      cancelAnimationFrame(moveFrame)
      observer?.disconnect()
      decode?.kill()
      gsap.killTweensOf([textEl, ...letters.glyphs])
      letters.revert()
    },
  }
}
