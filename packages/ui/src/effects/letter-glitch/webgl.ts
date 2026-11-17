import { FRAGMENT, VERTEX } from './shader.ts'

/** Sets the program's uniforms by name. A name the program lacks is skipped. */
export type Uniforms = {
  i1: (name: string, value: number) => void
  i2: (name: string, x: number, y: number) => void
  f1: (name: string, value: number) => void
  f2: (name: string, x: number, y: number) => void
  f4: (name: string, x: number, y: number, z: number, w: number) => void
  f3v: (name: string, values: Float32Array | readonly number[]) => void
}

/** The linked program and its uniform setters. */
export type Program = { program: WebGLProgram; set: Uniforms }

const compile = (gl: WebGL2RenderingContext, type: number, source: string) => {
  const shader = gl.createShader(type)
  if (!shader) return null
  gl.shaderSource(shader, source)
  gl.compileShader(shader)
  if (gl.getShaderParameter(shader, gl.COMPILE_STATUS)) return shader
  gl.deleteShader(shader)
  return null
}

/** Compiles and links the letter shader. `null` when the driver refuses it. */
export function linkProgram(gl: WebGL2RenderingContext): Program | null {
  const vertex = compile(gl, gl.VERTEX_SHADER, VERTEX)
  const fragment = compile(gl, gl.FRAGMENT_SHADER, FRAGMENT)
  if (!vertex || !fragment) return null
  const program = gl.createProgram()
  gl.attachShader(program, vertex)
  gl.attachShader(program, fragment)
  gl.linkProgram(program)
  gl.deleteShader(vertex)
  gl.deleteShader(fragment)
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    gl.deleteProgram(program)
    return null
  }
  const locations = new Map<string, WebGLUniformLocation | null>()
  const count: number = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS)
  for (let i = 0; i < count; i++) {
    const info = gl.getActiveUniform(program, i)
    if (!info) continue
    // An array uniform is listed as `name[0]`; it is set by its bare name.
    const name = info.name.replace(/\[0\]$/, '')
    locations.set(name, gl.getUniformLocation(program, name))
  }
  const at = (name: string) => locations.get(name) ?? null
  return {
    program,
    set: {
      i1: (name, value) => gl.uniform1i(at(name), value),
      i2: (name, x, y) => gl.uniform2i(at(name), x, y),
      f1: (name, value) => gl.uniform1f(at(name), value),
      f2: (name, x, y) => gl.uniform2f(at(name), x, y),
      f4: (name, x, y, z, w) => gl.uniform4f(at(name), x, y, z, w),
      f3v: (name, values) => gl.uniform3fv(at(name), values),
    },
  }
}

/**
 * A texture read texel for texel: nearest filtering, so neither the atlas nor
 * the state blends between neighbours.
 */
export function createTexture(gl: WebGL2RenderingContext): WebGLTexture {
  const texture = gl.createTexture()
  gl.bindTexture(gl.TEXTURE_2D, texture)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
  return texture
}

/**
 * Returns a function that reads any CSS colour as sRGB, 0 to 1, by painting
 * one pixel and reading it back. An unknown colour reads as white.
 */
export function createColorParser(): (value: string) => number[] {
  const probe = document
    .createElement('canvas')
    .getContext('2d', { willReadFrequently: true })
  const cache = new Map<string, number[]>()
  return (value) => {
    const cached = cache.get(value)
    if (cached) return cached
    let rgb = [1, 1, 1]
    if (probe) {
      probe.clearRect(0, 0, 1, 1)
      // Reset first: an invalid colour leaves `fillStyle` as it was.
      probe.fillStyle = '#ffffff'
      probe.fillStyle = value
      probe.fillRect(0, 0, 1, 1)
      const [r = 255, g = 255, b = 255] = probe.getImageData(0, 0, 1, 1).data
      rgb = [r / 255, g / 255, b / 255]
    }
    cache.set(value, rgb)
    return rgb
  }
}
