/** A source of numbers from 0 up to, but not including, 1, like `Math.random`. */
export type Random = () => number

/**
 * A {@link Random} that gives the same numbers for the same seed, so a test
 * can expect exact text. Mulberry32: tiny, fast and plenty for placeholder text.
 */
export function seededRandom(seed: number): Random {
  let state = seed >>> 0
  return () => {
    state = (state + 0x6d2b79f5) >>> 0
    let t = state
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/** A whole number from `min` to `max`, both included. */
export function between(random: Random, min: number, max: number): number {
  return min + Math.floor(random() * (max - min + 1))
}
