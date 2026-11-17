import { gsap } from 'gsap'

import { clear, paint, type Letters } from './letters.ts'
import { falloff, isPhysical, type Settings } from './settings.ts'

/** A click's ring, spreading out from where it landed. */
export type Wave = {
  x: number
  y: number
  age: number
  r: number
  fade: number
  reach: number
  life: number
  hit: Uint8Array
}

/** What the loop shares with the pointer handlers. */
export type MotionState = {
  letters: Letters
  pointer: { x: number; y: number; sx: number; sy: number; inside: boolean }
  waves: Wave[]
  fontPx: number
  reduce: boolean
  settings: () => Settings
  /** Measures the letters if their positions are stale. */
  ensureMeasured: () => void
  /** A scramble tween for letter `i`, lasting `length` seconds, revealing after `revealDelay`. */
  scramble: (i: number, length: number, revealDelay?: number) => gsap.TweenVars
}

/** One frame: eases each letter toward the pull of the pointer and of any waves. */
export function step(state: MotionState, dt: number): boolean {
  state.ensureMeasured()
  const { letters, pointer, waves, fontPx } = state
  const s = state.settings()
  const mode = isPhysical(s.effect) && !state.reduce ? s.effect : undefined
  const amount = s.strength
  const width = Math.max(fontPx * 1.3, 16)
  const swell = mode === 'magnify' ? 0.55 : 1
  // Frame-rate independent easing: each rate is a time constant in seconds.
  const follow = 1 - Math.exp(-dt / 0.06)
  const attack = 1 - Math.exp(-dt / 0.08)
  const release = 1 - Math.exp(-dt / Math.max(0.04, s.trail / 3))
  pointer.sx += (pointer.x - pointer.sx) * follow
  pointer.sy += (pointer.y - pointer.sy) * follow

  for (const wave of waves) {
    wave.age += dt
    const t = Math.min(1, wave.age / wave.life)
    wave.r = wave.reach * (1 - (1 - t) * (1 - t))
    wave.fade = t < 0.75 ? 1 : 1 - ((t - 0.75) / 0.25) ** 2
  }

  let busy =
    waves.length > 0 ||
    Math.abs(pointer.x - pointer.sx) + Math.abs(pointer.y - pointer.sy) > 0.2
  letters.points.forEach((p, i) => {
    let target = 0
    let tx = 0
    let ty = 0
    if (mode && pointer.inside) {
      const ax = p.x - pointer.sx
      const ay = p.y - pointer.sy
      target = falloff(Math.hypot(ax, ay), s.radius)
      tx = ax * 0.5 * amount * target
      ty = ay * 0.5 * amount * target
    }
    for (const wave of waves) {
      const ax = p.x - wave.x
      const ay = p.y - wave.y
      const d = Math.hypot(ax, ay)
      const strengthAt = 1 - (0.6 * d) / wave.reach
      if (!wave.hit[i] && d <= wave.r) {
        wave.hit[i] = 1
        const glyph = letters.glyphs[i]
        const length = Math.max(0.2, s.duration * (0.2 + 0.5 * strengthAt))
        if (glyph) gsap.to(glyph, state.scramble(i, length))
      }
      if (mode) {
        const band =
          swell *
          strengthAt *
          wave.fade *
          Math.exp(-(((d - wave.r) / width) ** 2))
        if (band > target) {
          const push = (fontPx * 0.6 * amount * band) / (d || 1)
          target = band
          tx = ax * push
          ty = ay * push
        }
      }
    }
    const k = target > p.energy ? attack : release
    p.energy += (target - p.energy) * k
    if (Math.abs(target - p.energy) > 0.0005) busy = true
    if (mode === 'magnify') {
      p.dx += (tx - p.dx) * k
      p.dy += (ty - p.dy) * k
    }
    if (mode) paint(letters, i, mode, amount, fontPx)
    else if (p.shown) clear(letters, i)
  })

  for (let j = waves.length - 1; j >= 0; j -= 1) {
    const wave = waves[j]
    if (wave && wave.age >= wave.life) waves.splice(j, 1)
  }
  return busy
}

/** Scrambles the letters near the pointer, more briefly the further away they are. */
export function scrambleNearPointer(state: MotionState): void {
  state.ensureMeasured()
  const { radius, duration } = state.settings()
  const { pointer, letters } = state
  letters.points.forEach((p, i) => {
    const glyph = letters.glyphs[i]
    const dist = Math.hypot(pointer.x - p.x, pointer.y - p.y)
    if (glyph && dist < radius) {
      gsap.to(glyph, state.scramble(i, duration * (1 - dist / radius)))
    }
  })
}
