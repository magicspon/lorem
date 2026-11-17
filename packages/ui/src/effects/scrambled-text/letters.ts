import * as stylex from '@stylexjs/stylex'
import { SplitText } from 'gsap/SplitText'

import type { Sx } from '#/lib/sx.ts'
import type { PhysicalEffect } from './settings.ts'

const styles = stylex.create({
  // A box for the glyph to sit in, and to move as one when the letter reacts.
  char: { position: 'relative', display: 'inline-block' },
  // Holds the letter's own width, so a wider scramble character never
  // reflows the line.
  sizer: { visibility: 'hidden' },
  glyph: {
    position: 'absolute',
    top: 0,
    left: '50%',
    transform: 'translateX(-50%)',
    whiteSpace: 'pre',
  },
})

// Elements made here, outside React, still take their look from StyleX.
const classesOf = (style: Sx): string[] =>
  (stylex.props(style).className ?? '').split(' ').filter(Boolean)

/** One letter's centre, relative to the root, and how strongly it is reacting. */
export type Point = {
  x: number
  y: number
  energy: number
  dx: number
  dy: number
  shown: boolean
}

/** The text split into letters, each with a glyph that scrambles over a fixed-width sizer. */
export type Letters = {
  chars: HTMLElement[]
  glyphs: HTMLElement[]
  originals: string[]
  points: Point[]
  revert: () => void
}

/** Splits `textEl` into letters. `revert` puts the text back as it was. */
export function splitLetters(textEl: HTMLElement): Letters {
  // Spans, not SplitText's default divs, so the text stays valid inside a `p`.
  const split = SplitText.create(textEl, {
    type: 'chars',
    tag: 'span',
    smartWrap: true,
    aria: 'none',
  })
  const chars = split.chars.filter(
    (el): el is HTMLElement => el instanceof HTMLElement,
  )
  const originals = chars.map((char) => char.textContent ?? '')
  const glyphs = chars.map((char, i) => {
    const text = originals[i] ?? ''
    char.classList.add(...classesOf(styles.char))
    const sizer = document.createElement('span')
    const glyph = document.createElement('span')
    sizer.textContent = text
    glyph.textContent = text
    sizer.classList.add(...classesOf(styles.sizer))
    glyph.classList.add(...classesOf(styles.glyph))
    char.replaceChildren(sizer, glyph)
    return glyph
  })
  const points = chars.map(() => ({
    x: 0,
    y: 0,
    energy: 0,
    dx: 0,
    dy: 0,
    shown: false,
  }))
  return { chars, glyphs, originals, points, revert: () => split.revert() }
}

// Layout offsets, not bounding boxes, so a letter's own transform never moves
// where it is measured from.
function offsetOf(el: HTMLElement): [number, number] {
  let x = 0
  let y = 0
  for (
    let node: HTMLElement | null = el;
    node;
    node = node.offsetParent instanceof HTMLElement ? node.offsetParent : null
  ) {
    x += node.offsetLeft
    y += node.offsetTop
  }
  return [x, y]
}

/** Records each letter's centre relative to `root`. Returns the font size in px. */
export function measure(
  root: HTMLElement,
  textEl: HTMLElement,
  { chars, points }: Letters,
): number {
  const [rootX, rootY] = offsetOf(root)
  chars.forEach((char, i) => {
    const point = points[i]
    if (!point) return
    const [x, y] = offsetOf(char)
    point.x = x - rootX + char.offsetWidth / 2
    point.y = y - rootY + char.offsetHeight / 2
  })
  return parseFloat(window.getComputedStyle(textEl).fontSize) || 16
}

/** Puts a letter back at rest. */
export function clear({ chars, points }: Letters, i: number): void {
  const char = chars[i]
  const point = points[i]
  if (!char || !point) return
  char.style.transform = ''
  char.style.filter = ''
  char.style.opacity = ''
  char.style.zIndex = ''
  point.shown = false
}

/** Draws a letter's current energy as a lift, a blur or a lens. */
export function paint(
  letters: Letters,
  i: number,
  mode: PhysicalEffect,
  amount: number,
  fontPx: number,
): void {
  const char = letters.chars[i]
  const point = letters.points[i]
  if (!char || !point) return
  const e = point.energy
  if (e < 0.001) {
    if (point.shown) clear(letters, i)
    return
  }
  point.shown = true
  if (mode === 'lift') {
    char.style.transform = `translate3d(0, ${(-e * fontPx * 0.75 * amount).toFixed(2)}px, 0)`
  } else if (mode === 'blur') {
    char.style.filter = `blur(${(e * fontPx * 0.24 * amount).toFixed(2)}px)`
    char.style.opacity = (1 - e * Math.min(0.7, 0.45 * amount)).toFixed(3)
    char.style.transform = `scale(${(1 + e * 0.15 * amount).toFixed(4)})`
  } else {
    char.style.transform = `translate3d(${point.dx.toFixed(2)}px, ${point.dy.toFixed(2)}px, 0) scale(${(1 + e * 0.85 * amount).toFixed(4)})`
    char.style.zIndex = `${Math.round(e * 10)}`
  }
}
