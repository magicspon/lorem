import * as stylex from '@stylexjs/stylex'

import { motion, size } from './tokens.stylex'

// Keyframes can't be imported across files, so every animation lives here and
// components compose the exported styles instead.
const fadeIn = stylex.keyframes({ from: { opacity: 0 } })
const fadeOut = stylex.keyframes({ to: { opacity: 0 } })
const zoomIn = stylex.keyframes({ from: { opacity: 0, scale: 0.95 } })
const zoomOut = stylex.keyframes({ to: { opacity: 0, scale: 0.95 } })

// A popup slides in from the side facing its trigger.
const zoomInFromTop = stylex.keyframes({
  from: { opacity: 0, scale: 0.95, translate: `0 -${size['2']}` },
})
const zoomInFromBottom = stylex.keyframes({
  from: { opacity: 0, scale: 0.95, translate: `0 ${size['2']}` },
})
const zoomInFromLeft = stylex.keyframes({
  from: { opacity: 0, scale: 0.95, translate: `-${size['2']} 0` },
})
const zoomInFromRight = stylex.keyframes({
  from: { opacity: 0, scale: 0.95, translate: `${size['2']} 0` },
})

const pulse = stylex.keyframes({ '50%': { opacity: 0.5 } })
const spin = stylex.keyframes({ to: { rotate: '1turn' } })
const bob = stylex.keyframes({
  '0%, 60%, 100%': { opacity: 0.4, translate: '0 0' },
  '30%': { opacity: 1, translate: `0 -${size['0.75']}` },
})

/**
 * Enter and exit animations keyed on Base UI's `data-open` and `data-closed`.
 * Base UI waits for the exit animation before it unmounts the part.
 */
export const animations = stylex.create({
  fade: {
    animationName: {
      default: null,
      ':is([data-open])': fadeIn,
      ':is([data-closed])': fadeOut,
    },
    animationDuration: motion.fast,
    animationTimingFunction: 'ease',
    animationFillMode: 'forwards',
  },
  zoom: {
    animationName: {
      default: null,
      ':is([data-open])': zoomIn,
      ':is([data-closed])': zoomOut,
    },
    animationDuration: motion.fast,
    animationTimingFunction: 'ease',
    animationFillMode: 'forwards',
  },
  /** `zoom`, plus a short slide away from the trigger on enter. */
  popup: {
    // The side selectors are more specific, so they beat plain `data-open`.
    animationName: {
      default: null,
      ':is([data-open])': zoomIn,
      ':is([data-open][data-side=bottom])': zoomInFromTop,
      ':is([data-open][data-side=top])': zoomInFromBottom,
      ':is([data-open]:is([data-side=right], [data-side=inline-end]))':
        zoomInFromLeft,
      ':is([data-open]:is([data-side=left], [data-side=inline-start]))':
        zoomInFromRight,
      ':is([data-closed])': zoomOut,
    },
    animationDuration: motion.fast,
    animationTimingFunction: 'ease',
    animationFillMode: 'forwards',
    transformOrigin: 'var(--transform-origin)',
  },
  pulse: {
    animationName: pulse,
    animationDuration: '2s',
    animationTimingFunction: 'cubic-bezier(0.4, 0, 0.6, 1)',
    animationIterationCount: 'infinite',
  },
  /** A dot rising and fading, for someone typing. Stagger with `animationDelay`. */
  bob: {
    animationName: bob,
    animationDuration: '1.2s',
    animationTimingFunction: 'ease-in-out',
    animationIterationCount: 'infinite',
  },
  /** One full turn a second, for a loading spinner. */
  spin: {
    animationName: spin,
    animationDuration: '1s',
    animationTimingFunction: 'linear',
    animationIterationCount: 'infinite',
  },
})
