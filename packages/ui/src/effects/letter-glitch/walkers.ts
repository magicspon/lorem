import { cellAt, ignite, randomColor, type Field } from './field.ts'
import type { LetterGlitchClickEffect } from './settings.ts'

// A point that moves across the grid, lighting each cell it crosses.
type Walker = {
  x: number
  y: number
  angle: number
  life: number
  span: number
  speed: number
  color: number
  carry: number
  after: number
  wiggle: number
  branch: number
}

type WalkerInput = Omit<Walker, 'carry' | 'after' | 'wiggle' | 'branch'> &
  Partial<Walker>

const MAX_WALKERS = 48

/** The click effects, which run as walkers across the grid. */
export type Walkers = {
  /** Starts a click's effect at a canvas point. */
  spawn: (
    x: number,
    y: number,
    effect: LetterGlitchClickEffect,
    reach: number,
    ratio: number,
  ) => void
  step: (dt: number) => void
  clear: () => void
  count: () => number
}

/** The click effects over `field`. */
export function createWalkers(f: Field): Walkers {
  const walkers: Walker[] = []
  const add = (walker: WalkerInput) => {
    if (walkers.length < MAX_WALKERS)
      walkers.push({ carry: 0, after: 0, wiggle: 0, branch: 0, ...walker })
  }

  // Fast walkers both ways along the clicked row and its neighbours, each
  // a little later and shorter, so the rows look torn.
  const tear = (x: number, y: number, ratio: number) => {
    const center = cellAt(f, x, y)
    if (center < 0) return
    const r0 = Math.floor(center / f.cols)
    const width = f.cols * f.cellW
    for (let dr = -2; dr <= 2; dr++) {
      const r = r0 + dr
      if (r < 0 || r >= f.rows) continue
      const weight = 1 - Math.abs(dr) / 3
      if (dr !== 0 && Math.random() > 0.3 + 0.6 * weight) continue
      const color = randomColor(f)
      const rowY = f.originY + (r + 0.5) * f.cellH
      const shift = (Math.random() - 0.5) * 6 * f.cellW * (1 - weight)
      for (const angle of [0, Math.PI]) {
        const life = width * (0.12 + 0.5 * weight * (0.4 + 0.6 * Math.random()))
        add({
          x: x + shift,
          y: rowY,
          angle,
          life,
          span: life,
          speed: (2200 + Math.random() * 1200) * ratio,
          after: Math.abs(dr) * 0.035 + Math.random() * 0.03,
          color,
        })
      }
    }
  }

  // Wandering rays out from the click, which sometimes branch.
  const rays = (x: number, y: number, reach: number, ratio: number) => {
    const count = 5 + ((Math.random() * 3) | 0)
    const turn = Math.random() * Math.PI * 2
    for (let k = 0; k < count; k++) {
      const life = reach * (0.25 + Math.random() * 0.3)
      add({
        x,
        y,
        angle: turn + (k / count) * Math.PI * 2 + (Math.random() - 0.5) * 0.4,
        life,
        span: life,
        speed: (700 + Math.random() * 400) * ratio,
        wiggle: 0.2,
        branch: 0.03,
        color: randomColor(f),
      })
    }
  }

  const spawn: Walkers['spawn'] = (x, y, effect, reach, ratio) => {
    const center = cellAt(f, x, y)
    if (center < 0 || effect === 'none') return
    ignite(f, center, 1, 0.08, 0.8, randomColor(f))
    if (effect === 'burst') rays(x, y, reach, ratio)
    else tear(x, y, ratio)
  }

  const walk = (w: Walker, dt: number) => {
    // One cell per step, whichever way it heads.
    const step = Math.max(
      1,
      Math.abs(Math.cos(w.angle)) * f.cellW +
        Math.abs(Math.sin(w.angle)) * f.cellH * 0.6,
    )
    w.carry += w.speed * dt
    while (w.carry >= step && w.life > 0) {
      w.carry -= step
      w.life -= step
      w.angle += (Math.random() - 0.5) * w.wiggle
      w.x += Math.cos(w.angle) * step
      w.y += Math.sin(w.angle) * step
      const i = cellAt(f, w.x, w.y)
      if (i < 0) {
        w.life = 0
        break
      }
      const left = w.life / w.span
      const hold = 0.03 + Math.random() * 0.05
      ignite(f, i, 0.5 + 0.5 * left, hold, 0.5 + 0.5 * left, w.color)
      if (w.branch && Math.random() < w.branch) {
        const side = Math.random() < 0.5 ? -1 : 1
        add({
          ...w,
          angle: w.angle + side * (0.5 + Math.random() * 0.5),
          life: w.life * (0.45 + Math.random() * 0.3),
          carry: 0,
          branch: 0,
        })
      }
    }
  }

  const step = (dt: number) => {
    for (let k = walkers.length - 1; k >= 0; k--) {
      const w = walkers[k]
      if (!w) continue
      if (w.after > 0) {
        w.after -= dt
        continue
      }
      walk(w, dt)
      if (w.life <= 0) walkers.splice(k, 1)
    }
  }

  return {
    spawn,
    step,
    clear: () => {
      walkers.length = 0
    },
    count: () => walkers.length,
  }
}
