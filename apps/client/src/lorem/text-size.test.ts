import { describe, expect, it } from 'vitest'

import { textSize } from './text-size.ts'

describe('textSize', () => {
  it('shows a few words at the top of the scale', () => {
    expect(textSize({ count: 1, kind: 'words' })).toBe('9')
    expect(textSize({ count: 3, kind: 'slug' })).toBe('9')
  })

  it('keeps the default request at step 8', () => {
    expect(textSize({ count: 10, kind: 'words' })).toBe('8')
  })

  it('shrinks as the text grows', () => {
    expect(textSize({ count: 5, kind: 'sentences' })).toBe('7')
    expect(textSize({ count: 3, kind: 'paragraphs' })).toBe('6')
    expect(textSize({ count: 8, kind: 'paragraphs' })).toBe('5')
  })

  it('stops at step 4 for the longest requests', () => {
    expect(textSize({ count: 100, kind: 'paragraphs' })).toBe('4')
  })
})
