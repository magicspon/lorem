import * as stylex from '@stylexjs/stylex'

/** `display`, keyed by its CSS value. Each primitive maps its own prop onto it. */
export const display = stylex.create({
  none: { display: 'none' },
  inline: { display: 'inline' },
  'inline-block': { display: 'inline-block' },
  block: { display: 'block' },
  contents: { display: 'contents' },
  flex: { display: 'flex' },
  'inline-flex': { display: 'inline-flex' },
  grid: { display: 'grid' },
  'inline-grid': { display: 'inline-grid' },
})
