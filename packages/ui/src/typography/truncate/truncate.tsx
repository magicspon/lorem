import * as stylex from '@stylexjs/stylex'
import * as React from 'react'

import * as Tooltip from '#/overlays/tooltip/index.ts'
import type { Sx } from '#/lib/sx.ts'
import { size } from '../../styles/tokens.stylex'

// Text cut to fit its box. Only what is actually cut gets a tooltip, so a
// short answer in a wide column behaves as plain text. The full text stays in
// the page, so a screen reader reads all of it; the tooltip is for the eye.

const styles = stylex.create({
  // `block`, with no minimum width, so a grid or flex cell can shrink it.
  root: { display: 'block', minWidth: 0, overflow: 'hidden' },
  line: { textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
  // Two or three lines, cut with an ellipsis at the end of the last.
  clamp: {
    display: '-webkit-box',
    WebkitBoxOrient: 'vertical',
    overflowWrap: 'anywhere',
  },
  two: { WebkitLineClamp: 2 },
  three: { WebkitLineClamp: 3 },
  // The tooltip holds a whole paragraph at most, wrapped to a readable width.
  tip: { maxWidth: size['96'], overflowWrap: 'anywhere' },
})

const LINES = {
  1: [styles.line],
  2: [styles.clamp, styles.two],
  3: [styles.clamp, styles.three],
}

/** Props for {@link Truncate}. */
export type TruncateProps = {
  children: React.ReactNode
  /** How many lines to show before cutting. @default 1 */
  lines?: 1 | 2 | 3
  /** What the tooltip says, when `children` is not plain text, such as a link. */
  full?: React.ReactNode
  sx?: Sx
}

/** Whether `element` holds more than it shows, across or down. */
function isCut(element: HTMLElement): boolean {
  return (
    element.scrollWidth > element.clientWidth ||
    element.scrollHeight > element.clientHeight
  )
}

/** Watches whether an element's content is cut, as its box or text changes. */
function useIsCut(content: React.ReactNode) {
  const ref = React.useRef<HTMLSpanElement>(null)
  const [cut, setCut] = React.useState(false)
  React.useLayoutEffect(() => {
    const element = ref.current
    if (element === null) return
    const check = () => setCut(isCut(element))
    check()
    const observer = new ResizeObserver(check)
    observer.observe(element)
    return () => observer.disconnect()
  }, [content])
  return { ref, cut }
}

/**
 * Text cut with an ellipsis after one line, or `lines`. When something is
 * cut, hovering shows the whole of it.
 */
export function Truncate({ children, lines = 1, full, sx }: TruncateProps) {
  const { ref, cut } = useIsCut(children)
  // Always the same tree, so the observed element never changes; the
  // tooltip is simply off while nothing is cut.
  return (
    <Tooltip.Root disabled={!cut}>
      <Tooltip.Trigger
        render={
          <span
            ref={ref}
            data-slot="truncate"
            sx={[styles.root, LINES[lines], sx]}
          />
        }
      >
        {children}
      </Tooltip.Trigger>
      <Tooltip.Content sx={styles.tip}>{full ?? children}</Tooltip.Content>
    </Tooltip.Root>
  )
}
