import { describe, expect, it } from 'vitest'

import { generateLorem, joinBlocks } from './generate.ts'
import {
  defaultRequest,
  loremKinds,
  loremRequest,
  loremSearch,
} from './kinds.ts'
import { seededRandom, type Random } from './random.ts'

function seeded(): Random {
  return seededRandom(42)
}

describe('generateLorem', () => {
  it('makes the number of words asked for, as one block', () => {
    const blocks = generateLorem({ count: 7, kind: 'words' }, seeded())
    expect(blocks).toHaveLength(1)
    expect(blocks[0]?.split(' ')).toHaveLength(7)
  })

  it('makes one block per paragraph', () => {
    expect(
      generateLorem({ count: 4, kind: 'paragraphs' }, seeded()),
    ).toHaveLength(4)
  })

  it('joins a slug with hyphens', () => {
    const [slug] = generateLorem({ count: 3, kind: 'slug' }, seeded())
    expect(slug).toMatch(/^[a-z]+-[a-z]+-[a-z]+$/)
  })

  it('gives every kind some text and no empty block', () => {
    for (const kind of loremKinds) {
      const blocks = generateLorem({ count: 2, kind }, seeded())
      expect(blocks.length).toBeGreaterThan(0)
      expect(blocks.every((block) => block.length > 0)).toBe(true)
    }
  })

  it('writes each sentence with a capital and a full stop', () => {
    const [text] = generateLorem({ count: 20, kind: 'sentences' }, seeded())
    const found = text?.match(/[A-Z][a-z ]+\./g) ?? []
    expect(found).toHaveLength(20)
    for (const one of found) {
      const length = one.split(' ').length
      expect(length).toBeGreaterThanOrEqual(3)
      expect(length).toBeLessThanOrEqual(10)
    }
  })

  it('makes the same text from the same seed', () => {
    const request = { count: 2, kind: 'paragraphs' } as const
    expect(generateLorem(request, seeded())).toEqual(
      generateLorem(request, seeded()),
    )
  })
})

describe('joinBlocks', () => {
  it('puts a blank line between blocks', () => {
    expect(joinBlocks(['one', 'two'])).toBe('one\n\ntwo')
  })
})

describe('loremRequest', () => {
  it('reads the path segments', () => {
    expect(loremRequest.parse({ count: '12', kind: 'sentences' })).toEqual({
      count: 12,
      kind: 'sentences',
    })
  })

  it.each([
    { count: '3', kind: 'sentence' },
    { count: '3', kind: 'paragraph' },
    { count: '3', kind: 'lines' },
    { count: '3', kind: 'text' },
    { count: '0', kind: 'words' },
    { count: '101', kind: 'words' },
    { count: '2.5', kind: 'words' },
    { count: 'ten', kind: 'words' },
    { count: '10', kind: 'word' },
  ])('refuses $count/$kind', (params) => {
    expect(loremRequest.safeParse(params).success).toBe(false)
  })
})

describe('loremSearch', () => {
  it('reads the query', () => {
    expect(loremSearch.parse({ count: '3', kind: 'paragraphs' })).toEqual({
      count: 3,
      kind: 'paragraphs',
    })
  })

  it('falls back to the defaults for a missing or bad value', () => {
    expect(loremSearch.parse({})).toEqual(defaultRequest)
    expect(loremSearch.parse({ count: '500', kind: 'word' })).toEqual(
      defaultRequest,
    )
  })
})
