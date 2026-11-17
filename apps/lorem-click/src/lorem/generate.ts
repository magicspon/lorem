import { fakerEN, type Faker } from '@faker-js/faker'

import type { LoremRequest } from './kinds.ts'

type Lorem = Faker['lorem']

// Each kind as one call. `paragraphs` and `lines` join with a newline, which
// `generateLorem` splits on, so every kind comes back as a list of blocks.
const makers: Record<
  LoremRequest['kind'],
  (lorem: Lorem, n: number) => string
> = {
  words: (lorem, n) => lorem.words(n),
  sentence: (lorem, n) => lorem.sentence(n),
  sentences: (lorem, n) => lorem.sentences(n),
  paragraph: (lorem, n) => lorem.paragraph(n),
  paragraphs: (lorem, n) => lorem.paragraphs(n, '\n'),
  lines: (lorem, n) => lorem.lines(n),
  slug: (lorem, n) => lorem.slug(n),
  text: (lorem) => lorem.text(),
}

/**
 * Makes the placeholder text a request asks for, as the blocks to show: one
 * per paragraph or line, else a single block. Pass a `faker` with a seed for
 * the same text each time.
 */
export function generateLorem(
  { count, kind }: LoremRequest,
  faker: Faker = fakerEN,
): string[] {
  return makers[kind](faker.lorem, count)
    .split('\n')
    .map((block) => block.trim())
    .filter((block) => block.length > 0)
}

/** The blocks as one string to paste, a blank line between each. */
export function joinBlocks(blocks: readonly string[]): string {
  return blocks.join('\n\n')
}
