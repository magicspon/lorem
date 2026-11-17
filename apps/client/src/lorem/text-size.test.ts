import { describe, expect, it } from 'vitest'

import { textScale } from './text-size.ts'

describe('textScale', () => {
  it('shows a single word at full scale', () => {
    expect(textScale({ count: 1, kind: 'words' })).toBe(1)
  })

  it('shows the default request at half scale', () => {
    expect(textScale({ count: 10, kind: 'words' })).toBeCloseTo(0.5, 2)
  })

  it('shrinks smoothly as the text grows', () => {
    const scales = [
      textScale({ count: 3, kind: 'slug' }),
      textScale({ count: 5, kind: 'sentences' }),
      textScale({ count: 3, kind: 'paragraphs' }),
      textScale({ count: 100, kind: 'paragraphs' }),
    ]
    for (const [index, scale] of scales.entries()) {
      const next = scales[index + 1]
      if (next !== undefined) expect(next).toBeLessThan(scale)
    }
  })

  it('stays above zero for the longest requests', () => {
    expect(textScale({ count: 100, kind: 'paragraphs' })).toBeGreaterThan(0)
  })
})
