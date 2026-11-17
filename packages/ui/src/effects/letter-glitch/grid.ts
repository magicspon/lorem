import {
  ignite,
  randomColor,
  randomGlyph,
  restValue,
  type Cell,
  type Field,
} from './field.ts'
import { smoother, type Settings } from './settings.ts'

const INTRO_SECONDS = 1.4

const newCell = (luck: number, level: number, born: number): Cell => ({
  luck,
  level,
  born,
  heat: 0,
  peak: 0,
  hold: 0,
  fade: 0,
  wait: 0,
  delay: 0,
  slot: -1,
})

// The intro spreads out from the middle, with plenty of randomness.
function birthTime(c: number, r: number, cols: number, rows: number) {
  const dx = (c + 0.5) / cols - 0.5
  const dy = (r + 0.5) / rows - 0.5
  const radial = Math.min(1, Math.hypot(dx, dy * 0.8) * 1.6)
  return INTRO_SECONDS * (0.3 * radial + 0.7 * Math.random() ** 1.3)
}

/**
 * Fits the grid to the canvas, one cell over on each axis so the edges are
 * always covered. On a new size it keeps the letters that still fit, centred,
 * and returns true: the state texture must be reallocated.
 */
export function layoutGrid(
  f: Field,
  width: number,
  height: number,
  density: number,
): boolean {
  const cols = Math.ceil(width / f.cellW) + 1
  const rows = Math.ceil(height / f.cellH) + 1
  f.originX = Math.floor((width - cols * f.cellW) / 2)
  f.originY = Math.floor((height - rows * f.cellH) / 2)
  if (cols === f.cols && rows === f.rows) return false

  const data = new Uint8Array(cols * rows * 4)
  const cells: Cell[] = []
  const shiftC = Math.floor((f.cols - cols) / 2)
  const shiftR = Math.floor((f.rows - rows) / 2)
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const i = r * cols + c
      const oc = c + shiftC
      const or = r + shiftR
      const inside = oc >= 0 && or >= 0 && oc < f.cols && or < f.rows
      const j = or * f.cols + oc
      const old = inside ? f.cells[j] : undefined
      if (old) {
        data[i * 4] = f.data[j * 4] ?? 0
        cells.push(newCell(old.luck, old.level, old.born))
      } else {
        data[i * 4] = randomGlyph(f)
        const born = f.introLeft ? birthTime(c, r, cols, rows) : -1
        cells.push(newCell(Math.random(), 0.55 + 0.45 * Math.random(), born))
      }
    }
  }
  cells.forEach((cell, i) => {
    data[i * 4 + 1] = cell.born >= 0 ? 0 : restValue(cell, density)
  })
  Object.assign(f, { cols, rows, cells, data, active: [], dirty: true })
  return true
}

/** Fades each letter in at its birth time, with a flicker as it arrives. */
export function reveal(f: Field, dt: number, clock: number, s: Settings): void {
  if (!f.introLeft) return
  let pending = false
  f.cells.forEach((cell, i) => {
    if (cell.born < 0) return
    const age = clock - cell.born
    if (age < 0) {
      pending = true
      return
    }
    const flicker = cell.luck < s.density ? 0.45 : 0.12
    if (age < dt && Math.random() < flicker) {
      const fade = 0.35 + Math.random() * 0.35
      ignite(f, i, 0.4 + 0.5 * Math.random(), 0.02, fade, randomColor(f))
    }
    const appear = s.smooth ? smoother(age / 0.35) : 1
    f.data[i * 4 + 1] = restValue(cell, s.density, appear)
    if (appear >= 1) cell.born = -1
    else pending = true
  })
  f.dirty = true
  if (!pending) f.introLeft = false
}
