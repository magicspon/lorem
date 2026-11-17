/** What happens to letters near the pointer: they scramble, rise, blur, or swell like a lens. */
export type ScrambledTextEffect = 'scramble' | 'lift' | 'blur' | 'magnify'

/** Everything that changes how `ScrambledText` reacts and moves. */
export type ScrambledTextOptions = {
  /** What happens to letters near the pointer. */
  effect?: ScrambledTextEffect
  /** Distance from the pointer, in px, within which letters react. */
  radius?: number
  /** How far letters lift, how much they blur, or how much they magnify. */
  strength?: number
  /** Seconds a lifted, blurred or magnified letter takes to settle. */
  trail?: number
  /** Seconds a letter under the pointer keeps scrambling. Also paces the intro and the click burst. */
  duration?: number
  /** How often a scrambling letter swaps to a new character. Higher flickers faster. */
  speed?: number
  /** A click sends a scramble wave out from the click point. */
  clickBurst?: boolean
  /** Characters shown while a letter is scrambled. */
  scrambleChars?: string
  /** Colour of letters while they are scrambled. Unset, they keep the text colour. */
  scrambleColor?: string
  /** Decodes the text from scrambled characters the first time it scrolls into view. */
  intro?: boolean
}

/** The options with defaults filled in. */
export type Settings = Required<Omit<ScrambledTextOptions, 'scrambleColor'>> & {
  scrambleColor: string | undefined
}

/** Fills in the defaults and keeps every number usable. */
export function toSettings(o: ScrambledTextOptions): Settings {
  return {
    effect: o.effect ?? 'scramble',
    radius: Math.max(1, o.radius ?? 100),
    strength: Math.max(0, o.strength ?? 1),
    trail: Math.max(0, o.trail ?? 0.6),
    duration: Math.max(0, o.duration ?? 1.2),
    speed: Math.max(0, o.speed ?? 0.5),
    clickBurst: o.clickBurst ?? true,
    scrambleChars: o.scrambleChars || '.:',
    scrambleColor: o.scrambleColor,
    intro: o.intro ?? true,
  }
}

/** The effects that move letters, rather than only swapping their characters. */
export type PhysicalEffect = Exclude<ScrambledTextEffect, 'scramble'>

/** Whether `effect` moves letters, which needs the animation loop. */
export const isPhysical = (
  effect: ScrambledTextEffect,
): effect is PhysicalEffect => effect !== 'scramble'

/** A soft falloff from 1 at the centre to 0 at `radius`. */
export function falloff(distance: number, radius: number): number {
  if (distance >= radius) return 0
  const f = 1 - (distance / radius) ** 2
  return f * f
}
