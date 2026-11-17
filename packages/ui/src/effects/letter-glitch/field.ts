import type { Settings } from './settings.ts'

/** One letter's glitch state. Its glyph and brightness live in `Field.data`. */
export type Cell = {
  /** Shows a letter at rest when below the density. */
  luck: number
  /** Its brightness at rest, 0.55 to 1. */
  level: number
  /** When the intro shows it, in seconds; -1 once shown. */
  born: number
  heat: number
  peak: number
  hold: number
  fade: number
  /** Seconds until the next scramble while glitching. */
  wait: number
  /** Seconds before a queued glitch starts. */
  delay: number
  /** Its place in `Field.active`, or -1. */
  slot: number
}

/**
 * The grid of letters. `data` is the state texture: per cell the glyph, the
 * brightness at rest, the heat and the colour, one byte each.
 */
export type Field = {
  cols: number
  rows: number
  cellW: number
  cellH: number
  originX: number
  originY: number
  atlasColumns: number
  cells: Cell[]
  data: Uint8Array
  /** The cells glitching now, so a frame touches only those. */
  active: number[]
  /** Atlas indices to draw from, with repeats for weight. */
  pool: number[]
  colorCount: number
  /** Whether `data` changed since the last upload. */
  dirty: boolean
  introLeft: boolean
}

/** An empty field. `layoutGrid` sizes it. */
export const createField = (intro: boolean): Field => ({
  cols: 0,
  rows: 0,
  cellW: 0,
  cellH: 0,
  originX: 0,
  originY: 0,
  atlasColumns: 1,
  cells: [],
  data: new Uint8Array(0),
  active: [],
  pool: [0],
  colorCount: 1,
  dirty: true,
  introLeft: intro,
})

/** A random glyph from the pool. */
export const randomGlyph = (f: Field): number =>
  f.pool[(Math.random() * f.pool.length) | 0] ?? 0

/** A random index into the palette. */
export const randomColor = (f: Field): number =>
  (Math.random() * f.colorCount) | 0

/** A cell's byte of brightness at rest, scaled by how far it has appeared. */
export const restValue = (cell: Cell, density: number, appear = 1): number =>
  cell.luck < density ? Math.round(cell.level * 255 * appear) : 0

/** The index of the cell under a canvas point, or -1. */
export function cellAt(f: Field, x: number, y: number): number {
  const c = Math.floor((x - f.originX) / f.cellW)
  const r = Math.floor((y - f.originY) / f.cellH)
  if (c < 0 || r < 0 || c >= f.cols || r >= f.rows) return -1
  return r * f.cols + c
}

/**
 * Starts a cell glitching, or strengthens one already going. `after` queues
 * it, so a run of cells can light up one after another.
 */
export function ignite(
  f: Field,
  i: number,
  strength: number,
  holdTime: number,
  fadeTime: number,
  color: number,
  after = 0,
): void {
  const cell = f.cells[i]
  if (!cell) return
  if (cell.slot < 0) {
    cell.slot = f.active.length
    f.active.push(i)
    Object.assign(cell, {
      heat: 0,
      hold: holdTime,
      peak: strength,
      fade: fadeTime,
      wait: 0,
      delay: after,
    })
    f.data[i * 4 + 3] = color
    return
  }
  // Recolour only a cell that has nearly faded, so a bright one does not jump.
  if (cell.heat < 0.15) f.data[i * 4 + 3] = color
  cell.peak = cell.hold > 0 ? Math.max(cell.peak, strength) : strength
  cell.hold = Math.max(cell.hold, holdTime)
  cell.fade = Math.max(cell.fade, fadeTime)
  cell.delay = Math.min(cell.delay, after)
}

// Swaps the last active cell into place `k`, so removal is constant time.
function release(f: Field, k: number) {
  const i = f.active[k]
  const moved = f.active.pop()
  if (i === undefined || moved === undefined) return
  if (moved !== i) {
    f.active[k] = moved
    const other = f.cells[moved]
    if (other) other.slot = k
  }
  const cell = f.cells[i]
  if (cell) {
    cell.slot = -1
    cell.heat = 0
  }
  f.data[i * 4 + 2] = 0
}

/** Moves every glitching cell on by `dt`: rises to its peak, holds, then fades. */
export function settle(f: Field, dt: number, s: Settings): void {
  const tempo = Math.max(s.speed, 0.5)
  const attack = 1 - Math.exp(-dt / 0.05)
  for (let k = 0; k < f.active.length;) {
    const i = f.active[k] ?? -1
    const cell = f.cells[i]
    if (!cell) {
      release(f, k)
      continue
    }
    if (cell.delay > 0) {
      cell.delay -= dt
      k++
      continue
    }
    let h = cell.heat
    if (cell.hold > 0) {
      cell.hold -= dt
      h = s.smooth ? h + (cell.peak - h) * attack : cell.peak
    } else {
      h = s.smooth ? h * Math.exp((-dt * 4) / Math.max(cell.fade, 0.05)) : 0
    }
    f.dirty = true
    if (h < 0.012 && cell.hold <= 0) {
      release(f, k)
      continue
    }
    cell.heat = h
    cell.wait -= dt
    if (cell.wait <= 0) {
      f.data[i * 4] = randomGlyph(f)
      // Hot letters scramble fast; cooling ones slow down as they fade.
      const cool = (1 - h) * (1 - h)
      cell.wait = ((0.045 + 0.45 * cool) * (0.6 + 0.8 * Math.random())) / tempo
    }
    f.data[i * 4 + 2] = Math.round(h * 255)
    k++
  }
}
