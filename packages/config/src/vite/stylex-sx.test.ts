import { describe, expect, it } from 'vitest'

import { stylexSx } from './stylex-sx.ts'

const { transform } = stylexSx()

describe('stylexSx', () => {
  it('adds the StyleX import to a file that uses sx without one', () => {
    const code = 'export const A = () => <div sx={s.a} />'
    expect(transform(code, '/x/a.tsx')).toBe(
      `import '@stylexjs/stylex'\n${code}`,
    )
  })

  it('leaves a file that already imports StyleX', () => {
    const code =
      "import * as stylex from '@stylexjs/stylex'\nconst A = () => <div sx={s.a} />"
    expect(transform(code, '/x/a.tsx')).toBeNull()
  })

  it('leaves a file with no sx prop', () => {
    expect(transform('const A = () => <div />', '/x/a.tsx')).toBeNull()
  })

  it('reads the path without its query', () => {
    expect(transform('<div sx={s} />', '/x/a.tsx?v=1')).not.toBeNull()
    expect(transform('<div sx={s} />', '/x/a.ts')).toBeNull()
  })
})
