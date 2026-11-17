import type { Field } from './field.ts'
import type { Settings } from './settings.ts'

/** The canvas the letters are drawn on once, and the texture it fills. */
export type Atlas = {
  canvas: HTMLCanvasElement
  context: CanvasRenderingContext2D
  texture: WebGLTexture
  maxSize: number
}

/** What rebuilding the atlas changed. */
export type AtlasChange = {
  /** The cell size changed, so the grid must be laid out again. */
  resized: boolean
  /** The characters changed, so every cell needs a new glyph. */
  charsChanged: boolean
  /** The CSS font it drew with, to wait for if it is a web font. */
  font: string
}

/** A canvas for the atlas. `null` when the browser gives no 2D context. */
export function createAtlas(
  gl: WebGL2RenderingContext,
  texture: WebGLTexture,
): Atlas | null {
  const canvas = document.createElement('canvas')
  const context = canvas.getContext('2d')
  if (!context) return null
  const maxSize: number = gl.getParameter(gl.MAX_TEXTURE_SIZE)
  return { canvas, context, texture, maxSize }
}

/**
 * Draws each distinct character, up to 256, into a grid of cells at device
 * size. Every cell is as wide as the widest character, so the shader can
 * index the atlas with whole texels. Updates the field's cell size and pool.
 */
export function drawAtlas(
  gl: WebGL2RenderingContext,
  atlas: Atlas,
  f: Field,
  s: Settings,
  ratio: number,
): AtlasChange {
  const { canvas, context } = atlas
  const size = s.fontSize * ratio
  const font = `${size}px ${s.fontFamily}`
  const chars = Array.from(s.characters)
  // A glyph index is one byte of the state texture.
  const unique = Array.from(new Set(chars)).slice(0, 256)
  context.font = font
  let advance = 1
  for (const char of unique)
    advance = Math.max(advance, context.measureText(char).width)
  const metrics = context.measureText('M')
  const cellW = Math.max(2, Math.ceil(advance + size * s.spacing))
  const cellH = Math.max(2, Math.ceil(size * (0.95 + s.spacing)))
  const columns = Math.max(
    1,
    Math.min(unique.length, Math.floor(atlas.maxSize / cellW)),
  )
  // Resizing the canvas resets its context, so the font is set again after.
  canvas.width = columns * cellW
  canvas.height = Math.ceil(unique.length / columns) * cellH
  context.font = font
  context.textAlign = 'center'
  context.textBaseline = 'alphabetic'
  context.fillStyle = '#ffffff'
  // Centres a capital's ink in the cell, rather than the font's line box.
  const baseline =
    cellH / 2 +
    (metrics.actualBoundingBoxAscent - metrics.actualBoundingBoxDescent) / 2
  unique.forEach((char, i) => {
    const x = (i % columns) * cellW + cellW / 2
    const y = Math.floor(i / columns) * cellH + baseline
    context.fillText(char, x, y)
  })
  gl.bindTexture(gl.TEXTURE_2D, atlas.texture)
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, canvas)

  const lookup = new Map(unique.map((char, i) => [char, i]))
  const pool = chars.flatMap((char) => {
    const index = lookup.get(char)
    return index === undefined ? [] : [index]
  })
  const charsChanged =
    pool.length !== f.pool.length ||
    pool.some((index, i) => index !== f.pool[i])
  f.pool = pool.length ? pool : [0]
  const resized = cellW !== f.cellW || cellH !== f.cellH
  f.cellW = cellW
  f.cellH = cellH
  f.atlasColumns = columns
  return { resized, charsChanged, font }
}
