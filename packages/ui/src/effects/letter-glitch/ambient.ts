import {
  cellAt,
  ignite,
  randomColor,
  randomGlyph,
  type Field,
} from './field.ts'
import type { Pointer } from './pointer.ts'
import type { Settings } from './settings.ts'

// Shares of the grid, a second, that scramble at rest and that glitch.
const REST_RATE = 0.2
const GLITCH_RATE = 0.1

/**
 * Fractions of an event carried between frames, so a low rate still fires
 * now and then instead of rounding down to never.
 */
export type Carry = { rest: number; glitch: number; cursor: number }

/** Scrambles resting letters and starts random glitches, some in short runs. */
export function ambient(f: Field, dt: number, s: Settings, carry: Carry): void {
  const count = f.cells.length
  if (s.speed <= 0 || !count) return
  carry.rest += count * REST_RATE * s.speed * dt
  let changes = Math.min(count, carry.rest | 0)
  carry.rest -= changes
  while (changes-- > 0) {
    const i = (Math.random() * count) | 0
    if ((f.cells[i]?.slot ?? 0) < 0) {
      f.data[i * 4] = randomGlyph(f)
      f.dirty = true
    }
  }
  const tempo = Math.max(s.speed, 0.2)
  carry.glitch += count * s.glitchAmount ** 1.6 * GLITCH_RATE * s.speed * dt
  let events = Math.min(count, carry.glitch | 0)
  carry.glitch -= events
  while (events-- > 0) {
    const i = (Math.random() * count) | 0
    const color = randomColor(f)
    const strength = 0.45 + 0.55 * Math.random()
    const hold = (0.04 + Math.random() * 0.26) / tempo
    const fade = (0.45 + Math.random() * 0.6) / tempo
    const roll = Math.random()
    if (roll >= 0.24) {
      ignite(f, i, strength, hold, fade, color)
      continue
    }
    // A run along the row, now and then a long one, lit one after another.
    const long = roll < 0.015
    const wanted = long
      ? 10 + ((Math.random() * 24) | 0)
      : 2 + ((Math.random() * 7) | 0)
    const length = Math.min(f.cols - (i % f.cols), wanted)
    const pace = (long ? 0.012 : 0.028) / tempo
    for (let k = 0; k < length; k++)
      ignite(f, i + k, strength, hold, fade, color, k * pace)
  }
}

/**
 * Scrambles the letters under the cursor and throws off sparks, more of both
 * the faster it moves.
 */
export function excite(
  f: Field,
  dt: number,
  s: Settings,
  pointer: Pointer,
  ratio: number,
  carry: Carry,
): void {
  if (pointer.presence < 0.02 || !f.cells.length) return
  const radius = s.cursorRadius * ratio
  if (radius < 1) return
  const { sx, sy } = pointer
  const c0 = Math.max(0, Math.floor((sx - radius - f.originX) / f.cellW))
  const c1 = Math.min(
    f.cols - 1,
    Math.floor((sx + radius - f.originX) / f.cellW),
  )
  const r0 = Math.max(0, Math.floor((sy - radius - f.originY) / f.cellH))
  const r1 = Math.min(
    f.rows - 1,
    Math.floor((sy + radius - f.originY) / f.cellH),
  )
  const chance = pointer.presence * (3 + 9 * pointer.stir) * dt
  for (let r = r0; r <= r1; r++) {
    const dy = (f.originY + (r + 0.5) * f.cellH - sy) / radius
    for (let c = c0; c <= c1; c++) {
      const dx = (f.originX + (c + 0.5) * f.cellW - sx) / radius
      const d = dx * dx + dy * dy
      if (d >= 1) continue
      const i = r * f.cols + c
      const resting = (f.cells[i]?.slot ?? 0) < 0
      if (resting && Math.random() < (1 - d) * (1 - d) * chance) {
        f.data[i * 4] = randomGlyph(f)
        f.dirty = true
      }
    }
  }
  const cells = (Math.PI * radius * radius) / (f.cellW * f.cellH)
  carry.cursor += cells * pointer.presence * (0.15 + 4 * pointer.stir) * dt
  let sparks = Math.min(512, carry.cursor | 0)
  carry.cursor -= sparks
  while (sparks-- > 0) {
    const angle = Math.random() * Math.PI * 2
    const distance = Math.sqrt(Math.random())
    // Denser near the cursor.
    if (Math.random() > (1 - distance * distance) ** 2) continue
    const i = cellAt(
      f,
      sx + Math.cos(angle) * distance * radius,
      sy + Math.sin(angle) * distance * radius,
    )
    if (i < 0) continue
    const strength = (0.3 + 0.7 * Math.random()) * (0.45 + 0.55 * pointer.stir)
    const hold = 0.02 + Math.random() * 0.08
    ignite(f, i, strength, hold, 0.35 + Math.random() * 0.4, randomColor(f))
  }
}
