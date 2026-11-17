import type { Field } from './field.ts'
import type { Pointer } from './pointer.ts'
import type { Settings } from './settings.ts'
import type { Program } from './webgl.ts'

/** Everything one frame's draw reads. */
export type DrawInputs = {
  gl: WebGL2RenderingContext
  program: Program
  canvas: HTMLCanvasElement
  field: Field
  atlas: WebGLTexture
  state: WebGLTexture
  /** The glitch colours as linear rgb triples, `MAX_COLORS` of them. */
  palette: Float32Array
  parse: (color: string) => number[]
  settings: Settings
  pointer: Pointer
  ratio: number
  time: number
}

/** Uploads the state if it changed and draws every letter in one pass. */
export function drawFrame(d: DrawInputs): void {
  const { gl, canvas, field: f, settings: s, pointer } = d
  const u = d.program.set
  gl.viewport(0, 0, canvas.width, canvas.height)
  gl.disable(gl.BLEND)
  gl.useProgram(d.program.program)
  gl.activeTexture(gl.TEXTURE1)
  gl.bindTexture(gl.TEXTURE_2D, d.state)
  if (f.dirty) {
    gl.texSubImage2D(
      gl.TEXTURE_2D,
      0,
      0,
      0,
      f.cols,
      f.rows,
      gl.RGBA,
      gl.UNSIGNED_BYTE,
      f.data,
    )
    f.dirty = false
  }
  u.i1('uState', 1)
  gl.activeTexture(gl.TEXTURE0)
  gl.bindTexture(gl.TEXTURE_2D, d.atlas)
  u.i1('uAtlas', 0)
  u.i2('uCell', f.cellW, f.cellH)
  u.i2('uGrid', f.cols, f.rows)
  u.i1('uAtlasColumns', f.atlasColumns)
  u.f2('uResolution', canvas.width, canvas.height)
  u.f2('uOrigin', f.originX, f.originY)
  u.f3v('uBase', d.parse(s.baseColor))
  u.f1('uBaseOpacity', s.baseOpacity)
  u.f3v('uColors', d.palette)
  u.f1('uEdge', s.edgeFade * Math.min(canvas.width, canvas.height))
  u.f1('uCenter', s.centerFade)
  u.f2('uPointer', pointer.sx, pointer.sy)
  u.f1('uRadius', Math.max(1, s.cursorRadius * d.ratio))
  u.f1('uPresence', pointer.presence)
  // Letters near the cursor brighten to this, whatever their rest opacity.
  u.f1('uReveal', Math.min(1, s.baseOpacity * 3.5))
  u.f1('uTime', d.time)
  u.f1('uFlow', s.flow)
  u.f1('uFlowScale', Math.max(canvas.width, canvas.height) * 0.32)
  const [r = 0, g = 0, b = 0] = s.backgroundColor
    ? d.parse(s.backgroundColor)
    : []
  u.f4('uBackground', r, g, b, s.backgroundColor ? 1 : 0)
  u.f1('uOpacity', s.opacity)
  gl.drawArrays(gl.TRIANGLES, 0, 3)
}
