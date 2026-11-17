import { clamp } from './settings.ts'

/** Where the cursor is, in canvas pixels, and how much it is doing. */
export type Pointer = {
  x: number
  y: number
  /** The eased position the effect follows, so it trails the cursor softly. */
  sx: number
  sy: number
  inside: boolean
  /** Eases to 1 while the cursor is over the container, and back to 0. */
  presence: number
  /** How fast the cursor moves, eased, 0 to 1. */
  stir: number
  fresh: boolean
}

/** What the pointer tracker needs from the engine. */
export type PointerHooks = {
  ratio: () => number
  wake: () => void
  /** Called on a press inside the container, at canvas pixels. */
  press: (x: number, y: number) => void
}

/**
 * Follows the pointer over `container`. It listens on the window, so the
 * effect still reacts when it sits behind other content, as a backdrop does.
 */
export function trackPointer(
  container: HTMLElement,
  hooks: PointerHooks,
): { pointer: Pointer; dispose: () => void } {
  const pointer: Pointer = {
    x: 0,
    y: 0,
    sx: 0,
    sy: 0,
    inside: false,
    presence: 0,
    stir: 0,
    fresh: true,
  }

  const locate = (event: PointerEvent) => {
    const rect = container.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top
    const ratio = hooks.ratio()
    pointer.inside = x >= 0 && y >= 0 && x <= rect.width && y <= rect.height
    pointer.x = x * ratio
    pointer.y = y * ratio
    // Jump rather than glide in from wherever the cursor last left.
    if (pointer.fresh || pointer.presence < 0.02) {
      pointer.sx = pointer.x
      pointer.sy = pointer.y
      pointer.fresh = false
    }
  }

  const onMove = (event: PointerEvent) => {
    locate(event)
    hooks.wake()
  }
  const onDown = (event: PointerEvent) => {
    locate(event)
    if (pointer.inside) hooks.press(pointer.x, pointer.y)
  }
  // A touch ends where it lifts; a mouse stays where it is.
  const onUp = (event: PointerEvent) => {
    if (event.pointerType !== 'mouse') pointer.inside = false
  }
  const onLeave = () => {
    pointer.inside = false
    hooks.wake()
  }

  const root = document.documentElement
  window.addEventListener('pointermove', onMove, { passive: true })
  window.addEventListener('pointerdown', onDown, { passive: true })
  window.addEventListener('pointerup', onUp, { passive: true })
  window.addEventListener('pointercancel', onUp, { passive: true })
  root.addEventListener('pointerleave', onLeave)
  return {
    pointer,
    dispose: () => {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerdown', onDown)
      window.removeEventListener('pointerup', onUp)
      window.removeEventListener('pointercancel', onUp)
      root.removeEventListener('pointerleave', onLeave)
    },
  }
}

/** Eases the pointer's presence, position and stir on by `dt`. */
export function easePointer(
  pointer: Pointer,
  dt: number,
  active: boolean,
  ratio: number,
): void {
  const goal = active && pointer.inside ? 1 : 0
  pointer.presence += (goal - pointer.presence) * (1 - Math.exp(-dt / 0.25))
  if (Math.abs(goal - pointer.presence) < 0.002) pointer.presence = goal
  const px = pointer.sx
  const py = pointer.sy
  const follow = 1 - Math.exp(-dt / 0.07)
  pointer.sx += (pointer.x - pointer.sx) * follow
  pointer.sy += (pointer.y - pointer.sy) * follow
  // CSS pixels a second, so a fast flick reads the same on any screen.
  const moved = Math.hypot(pointer.sx - px, pointer.sy - py) / ratio / dt
  const target = clamp(moved / 1400, 0, 1)
  pointer.stir += (target - pointer.stir) * (1 - Math.exp(-dt / 0.12))
  if (pointer.stir < 0.001) pointer.stir = 0
}
