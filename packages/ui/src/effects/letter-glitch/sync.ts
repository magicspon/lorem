import { drawAtlas, type Atlas } from './atlas.ts'
import { randomColor, randomGlyph, restValue, type Field } from './field.ts'
import { layoutGrid } from './grid.ts'
import { MAX_COLORS, type Settings } from './settings.ts'
import type { Walkers } from './walkers.ts'

/** What the sync steps change. */
export type SyncInputs = {
  gl: WebGL2RenderingContext
  canvas: HTMLCanvasElement
  field: Field
  walkers: Walkers
  atlas: Atlas | null
  state: WebGLTexture
  palette: Float32Array
  parse: (color: string) => number[]
  read: () => Settings
  /** Called when a web font the atlas used has loaded. */
  onFont: () => void
}

/**
 * Keeps the atlas, grid, palette and density in step with the settings. Each
 * step compares a key and does nothing when its inputs have not changed, so
 * the loop can call them every frame.
 */
export function createSync(d: SyncInputs) {
  const { gl, field } = d
  const loadedFonts = new Set<string>()
  let typeKey = ''
  let paletteKey = ''
  let density = -1

  /** Fits the grid to the canvas, reallocating the state texture on a new size. */
  const grid = () => {
    const s = d.read()
    if (!layoutGrid(field, d.canvas.width, d.canvas.height, s.density)) return
    d.walkers.clear()
    density = s.density
    gl.bindTexture(gl.TEXTURE_2D, d.state)
    gl.texImage2D(
      gl.TEXTURE_2D,
      0,
      gl.RGBA8,
      field.cols,
      field.rows,
      0,
      gl.RGBA,
      gl.UNSIGNED_BYTE,
      field.data,
    )
    field.dirty = false
  }

  /** Redraws the atlas when the font, size, spacing or characters change. */
  const type = (ratio: number) => {
    const s = d.read()
    const key = `${s.fontSize * ratio}|${s.fontFamily}|${s.spacing}|${s.characters}`
    if (key === typeKey || !d.atlas) return
    typeKey = key
    const change = drawAtlas(gl, d.atlas, field, s, ratio)
    if (change.resized || !field.cols) grid()
    if (change.charsChanged) {
      field.cells.forEach((_, i) => (field.data[i * 4] = randomGlyph(field)))
      field.dirty = true
    }
    // Draw again once a web font arrives; until then the fallback shows.
    if (!loadedFonts.has(change.font) && document.fonts?.load) {
      loadedFonts.add(change.font)
      document.fonts
        .load(change.font, s.characters)
        .then(d.onFont)
        .catch(() => {})
    }
  }

  /** Reloads the palette, and recolours cells whose colour no longer exists. */
  const palette = () => {
    const s = d.read()
    const key = s.colors.join(',')
    if (key === paletteKey) return
    paletteKey = key
    field.colorCount = Math.max(1, s.colors.length)
    for (let i = 0; i < MAX_COLORS; i++) {
      const color = s.colors[Math.min(i, field.colorCount - 1)] ?? '#ffffff'
      d.palette.set(d.parse(color), i * 3)
    }
    field.cells.forEach((_, i) => {
      if ((field.data[i * 4 + 3] ?? 0) >= field.colorCount)
        field.data[i * 4 + 3] = randomColor(field)
    })
    field.dirty = true
  }

  /** Shows or hides resting letters after a density change. */
  const fill = () => {
    const s = d.read()
    if (s.density === density) return
    density = s.density
    field.cells.forEach((cell, i) => {
      if (cell.born < 0) field.data[i * 4 + 1] = restValue(cell, density)
    })
    field.dirty = true
  }

  return {
    grid,
    type,
    palette,
    fill,
    /** Forgets the atlas key, so the next `type` redraws it. */
    invalidateType: () => {
      typeKey = ''
    },
  }
}
