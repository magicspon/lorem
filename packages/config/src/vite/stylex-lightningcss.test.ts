import { transform } from 'lightningcss'
import { describe, expect, it } from 'vitest'

import { stylexLightningcss } from './stylex-lightningcss.ts'

// The pass as the StyleX plugin runs it, targeting a browser older than
// `light-dark()` (Chrome 100), as the default browserslist targets do.
const run = (css: string) =>
  transform({
    filename: 'stylex.css',
    code: Buffer.from(css),
    targets: { chrome: 100 << 16 },
    ...stylexLightningcss,
  }).code.toString()

describe('stylexLightningcss', () => {
  it('keeps a light-dark() token as written', () => {
    const out = run(':root{--x:light-dark(#fbfdfc,#101211)}')
    expect(out).toContain('light-dark(#fbfdfc, #101211)')
    expect(out).not.toContain('--lightningcss-light')
  })
})
