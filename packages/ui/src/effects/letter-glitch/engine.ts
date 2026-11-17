import { ambient, excite, type Carry } from './ambient.ts'
import { createAtlas } from './atlas.ts'
import { drawFrame } from './draw.ts'
import { createField, settle } from './field.ts'
import { reveal } from './grid.ts'
import { easePointer, trackPointer } from './pointer.ts'
import { clamp, MAX_COLORS, type Settings } from './settings.ts'
import { createSync } from './sync.ts'
import { createWalkers } from './walkers.ts'
import { createColorParser, createTexture, linkProgram } from './webgl.ts'

/** A running effect. */
export type Engine = {
  /** Draws again after a settings change, or restarts a loop that went idle. */
  wake: () => void
  dispose: () => void
}

/**
 * Runs the effect in `canvas`, sized to `container`. It draws only while the
 * container is on screen and the tab is visible. With reduced motion the
 * letters hold still. Returns `null` without WebGL 2, leaving it empty.
 */
export function startEngine(
  container: HTMLElement,
  canvas: HTMLCanvasElement,
  read: () => Settings,
): Engine | null {
  const gl = canvas.getContext('webgl2', {
    alpha: true,
    premultipliedAlpha: true,
    antialias: false,
    depth: false,
    stencil: false,
  })
  const program = gl && linkProgram(gl)
  if (!gl || !program) return null
  const atlasTexture = createTexture(gl)
  const stateTexture = createTexture(gl)
  const atlas = createAtlas(gl, atlasTexture)
  const vao = gl.createVertexArray()
  const parse = createColorParser()
  const reduce =
    window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false
  const view = { width: 1, height: 1, ratio: 1 }
  const field = createField(read().intro && !reduce)
  const walkers = createWalkers(field)
  const palette = new Float32Array(MAX_COLORS * 3)
  const carry: Carry = { rest: 0, glitch: 0, cursor: 0 }
  let clock = 0
  let time = 0
  let raf = 0
  let last = 0
  let visible = true
  let alive = true
  let resizePending = false

  const sync = createSync({
    gl,
    canvas,
    field,
    walkers,
    atlas,
    state: stateTexture,
    palette,
    parse,
    read,
    onFont: () => onFonts(),
  })

  const applyResize = () => {
    view.width = Math.max(1, container.clientWidth)
    view.height = Math.max(1, container.clientHeight)
    view.ratio = Math.min(read().dpr || window.devicePixelRatio || 1, 2)
    canvas.width = Math.max(1, Math.round(view.width * view.ratio))
    canvas.height = Math.max(1, Math.round(view.height * view.ratio))
    sync.type(view.ratio)
    if (field.cols) sync.grid()
  }

  const step = (dt: number, s: Settings) => {
    clock += dt
    if (!reduce) time += dt * s.speed
    sync.type(view.ratio)
    sync.palette()
    sync.fill()
    easePointer(pointer, dt, s.interactive && !reduce, view.ratio)
    reveal(field, dt, clock, s)
    if (!reduce) {
      ambient(field, dt, s, carry)
      excite(field, dt, s, pointer, view.ratio, carry)
    }
    walkers.step(dt)
    settle(field, dt, s)
  }

  const frame = (now: number) => {
    raf = 0
    if (resizePending) {
      resizePending = false
      applyResize()
    }
    if (!alive || !visible || document.hidden) return
    const s = read()
    // Held to 50 ms, so a slow frame or a return to the tab does not jump.
    const dt = last ? clamp((now - last) / 1000, 0.0005, 0.05) : 1 / 60
    last = now
    step(dt, s)
    if (!atlas) return
    const textures = { atlas: atlasTexture, state: stateTexture }
    gl.bindVertexArray(vao)
    drawFrame({
      gl,
      program,
      canvas,
      field,
      ...textures,
      palette,
      parse,
      settings: s,
      pointer,
      ratio: view.ratio,
      time,
    })
    const settling = pointer.presence !== 0 && pointer.presence !== 1
    const busy =
      (!reduce && s.speed > 0) ||
      field.active.length > 0 ||
      walkers.count() > 0 ||
      field.introLeft ||
      settling ||
      pointer.stir > 0
    if (busy) raf = requestAnimationFrame(frame)
    else last = 0
  }

  const wake = () => {
    if (!raf && alive && visible && !document.hidden)
      raf = requestAnimationFrame(frame)
  }
  const restart = () => {
    last = 0
    wake()
  }
  const onFonts = () => {
    if (!alive) return
    sync.invalidateType()
    wake()
  }

  const tracker = trackPointer(container, {
    ratio: () => view.ratio,
    wake,
    press: (x, y) => {
      const s = read()
      if (s.clickEffect === 'none' || reduce || !field.cells.length) return
      const reach = Math.min(view.width, view.height) * view.ratio
      walkers.spawn(x, y, s.clickEffect, reach, view.ratio)
      wake()
    },
  })
  const { pointer } = tracker

  // Resizes wait for the next frame, so a burst of them costs one layout.
  const resizeObserver = new ResizeObserver(() => {
    resizePending = true
    wake()
  })
  resizeObserver.observe(container)
  const intersection = new IntersectionObserver((entries) => {
    visible = entries.some((entry) => entry.isIntersecting)
    if (visible) restart()
  })
  intersection.observe(container)
  document.addEventListener('visibilitychange', restart)
  document.fonts?.addEventListener?.('loadingdone', onFonts)
  resizePending = true
  wake()

  const dispose = () => {
    alive = false
    cancelAnimationFrame(raf)
    resizeObserver.disconnect()
    intersection.disconnect()
    tracker.dispose()
    document.removeEventListener('visibilitychange', restart)
    document.fonts?.removeEventListener?.('loadingdone', onFonts)
    gl.deleteTexture(atlasTexture)
    gl.deleteTexture(stateTexture)
    gl.deleteVertexArray(vao)
    gl.deleteProgram(program.program)
    if (!canvas.isConnected)
      gl.getExtension('WEBGL_lose_context')?.loseContext()
  }

  return { wake, dispose }
}
