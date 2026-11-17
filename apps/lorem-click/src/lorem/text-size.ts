import type { TextSize } from '@repo/ui/typography/type-styles'

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

// The most words each step fits, biggest step first. The default request,
// ten words, lands on step 8. Below step 4 the text stops reading as the
// page's subject, so a long request ends there.
const steps: readonly (readonly [maxWords: number, size: TextSize])[] = [
  [3, '9'],
  [12, '8'],
  [40, '7'],
  [100, '6'],
  [250, '5'],
]

/**
 * The type-scale step for a request's text: the less it makes, the bigger
 * it shows. Known from the request alone, so the size never jumps when new
 * text arrives for the same request.
 */
export function textSize({ count, kind }: LoremRequest): TextSize {
  const words = count * wordsPer[kind]
  return steps.find(([maxWords]) => words <= maxWords)?.[1] ?? '4'
}
