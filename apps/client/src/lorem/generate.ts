import type { LoremRequest } from './kinds.ts'
import { between, type Random } from './random.ts'
import { words } from './words.ts'

// The ranges faker uses, so the text reads as it did: a sentence is 3 to 10
// words, a paragraph 3 to 6 sentences. `textScale` relies on them too.
const sentenceWords = [3, 10] as const
const paragraphSentences = [3, 6] as const

function pickWords(random: Random, n: number): string[] {
  return Array.from(
    { length: n },
    // `words` is never empty, so the fallback only satisfies the type.
    () => words[Math.floor(random() * words.length)] ?? 'lorem',
  )
}

function sentence(random: Random): string {
  const text = pickWords(random, between(random, ...sentenceWords)).join(' ')
  return `${text.charAt(0).toUpperCase()}${text.slice(1)}.`
}

function sentences(random: Random, n: number): string {
  return Array.from({ length: n }, () => sentence(random)).join(' ')
}

function paragraph(random: Random): string {
  return sentences(random, between(random, ...paragraphSentences))
}

// Each kind as its list of blocks: one per paragraph, else a single block.
const makers: Record<
  LoremRequest['kind'],
  (random: Random, n: number) => string[]
> = {
  words: (random, n) => [pickWords(random, n).join(' ')],
  sentences: (random, n) => [sentences(random, n)],
  paragraphs: (random, n) => Array.from({ length: n }, () => paragraph(random)),
  slug: (random, n) => [pickWords(random, n).join('-')],
}

/**
 * Makes the placeholder text a request asks for, as the blocks to show: one
 * per paragraph, else a single block. Pass a `seededRandom` for the same text
 * each time.
 */
export function generateLorem(
  { count, kind }: LoremRequest,
  random: Random = Math.random,
): string[] {
  return makers[kind](random, count)
}

/** The blocks as one string to paste, a blank line between each. */
export function joinBlocks(blocks: readonly string[]): string {
  return blocks.join('\n\n')
}
