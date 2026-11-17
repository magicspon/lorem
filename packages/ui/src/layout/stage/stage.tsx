import * as stylex from '@stylexjs/stylex'

import { useLayout, type LayoutProps } from '#/layout/props/use-layout.ts'
import { shadows } from '../../styles/shadows.stylex'
import { colors, radii, space } from '../../styles/tokens.stylex'

// The gap kept between the floating panel and the edge of a small screen.
const EDGE = space['4']

const styles = stylex.create({
  // Fills the window and scrolls on its own, so long content runs behind the
  // panel instead of pushing it away.
  back: {
    position: 'fixed',
    inset: 0,
    zIndex: 0,
    overflowY: 'auto',
    overscrollBehavior: 'contain',
    display: 'flex',
    flexDirection: 'column',
  },
  // `safe` centres short content but keeps the top of long content in reach,
  // where plain `center` would push it out of the scroll area.
  center: { justifyContent: 'safe center' },
  // The whole surface is one click target, so the pointer says what it does.
  copy: { cursor: 'copy' },
  // `inset` and `margin: auto` centre it without a transform, which would
  // blur its text on some screens. Sized to its content, capped to the window.
  front: {
    position: 'fixed',
    inset: 0,
    zIndex: 1,
    margin: 'auto',
    width: 'fit-content',
    height: 'fit-content',
    maxWidth: `calc(100vw - 2 * ${EDGE})`,
    maxHeight: `calc(100dvh - 2 * ${EDGE})`,
    overflowY: 'auto',
    borderRadius: radii['4xl'],
    // Frosted glass: mostly clear, with the content behind softened rather
    // than hidden, so it shows through without fighting the panel's text.
    backgroundColor: `color-mix(in oklab, ${colors.card} 90%, transparent)`,
    backdropFilter: 'blur(8px) saturate(1.4)',
    color: colors.cardForeground,
    boxShadow: shadows.stage,
  },
})

/** Props for `StageBack`. */
type StageBackProps = LayoutProps<'div'> & {
  /** `copy` shows the copy cursor, for a back that copies when clicked. */
  cursor?: 'default' | 'copy'
  /** `center` holds content shorter than the window in its middle. */
  align?: 'start' | 'center'
}

/**
 * The layer behind a `StageFront`: it fills the window and scrolls by itself.
 * Pad it with the space props.
 */
function StageBack({
  cursor = 'default',
  align = 'start',
  ...props
}: StageBackProps) {
  return useLayout(
    'div',
    'stage-back',
    [
      styles.back,
      cursor === 'copy' && styles.copy,
      align === 'center' && styles.center,
    ],
    props,
  )
}

/** Props for `StageFront`. */
type StageFrontProps = LayoutProps<'div'>

/**
 * A panel that floats in the middle of the window, over a `StageBack`. Pad it
 * with the space props.
 */
function StageFront(props: StageFrontProps) {
  return useLayout('div', 'stage-front', [styles.front], props)
}

export { StageBack, StageFront }
export type { StageBackProps, StageFrontProps }
