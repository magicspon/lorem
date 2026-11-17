import type { LoremRequest } from './kinds.ts'

// About how many words one of each kind makes, from the generator's ranges: a
// sentence is 3 to 10 words, a paragraph 3 to 6 sentences. A slug's parts
// read as words.
const wordsPer: Record<LoremRequest['kind'], number> = {
  words: 1,
  slug: 1,
  sentences: 6.5,
  paragraphs: 30,
}

// How fast the text shrinks as it grows. Lower keeps it larger for longer:
// at 0.3 the default ten words show at half the full size, and only some
// hundreds of words reach the smallest.
const FALLOFF = 0.3

/**
 * How big to show a request's text, from 0 (smallest) to 1 (a single word):
 * the less it makes, the bigger it shows. Known from the request alone, so
 * the size never jumps when new text arrives for the same request.
 */
export function textScale({ count, kind }: LoremRequest): number {
  const words = Math.max(count * wordsPer[kind], 1)
  return words ** -FALLOFF
}
