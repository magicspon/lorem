import { Progress as ProgressPrimitive } from '@base-ui/react/progress'
import * as stylex from '@stylexjs/stylex'

import { textStyles } from '#/typography/type-styles.ts'
import { styleProps, type WithSx } from '#/lib/sx.ts'
import { colors, motion, radii, size, space } from '../../styles/tokens.stylex'

const styles = stylex.create({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: space['3'],
  },
  track: {
    position: 'relative',
    display: 'flex',
    height: size['3'],
    width: '100%',
    alignItems: 'center',
    overflowX: 'hidden',
    borderRadius: radii['4xl'],
    backgroundColor: colors.muted,
  },
  indicator: {
    height: '100%',
    backgroundColor: colors.primary,
    transitionProperty: 'all',
    transitionDuration: motion.normal,
    transitionTimingFunction: motion.ease,
  },
  label: {
    fontWeight: 500,
  },
  value: {
    marginLeft: 'auto',
    color: colors.mutedForeground,
    fontVariantNumeric: 'tabular-nums',
  },
})

/** A progress bar. Children, such as a label and value, sit above the track. */
function Progress({
  style,
  sx,
  children,
  value,
  ...props
}: WithSx<ProgressPrimitive.Root.Props>) {
  return (
    <ProgressPrimitive.Root
      value={value}
      data-slot="progress"
      {...styleProps([styles.root, sx], style)}
      {...props}
    >
      {children}
      <ProgressTrack>
        <ProgressIndicator />
      </ProgressTrack>
    </ProgressPrimitive.Root>
  )
}

/** The bar's background. */
function ProgressTrack({
  style,
  sx,
  ...props
}: WithSx<ProgressPrimitive.Track.Props>) {
  return (
    <ProgressPrimitive.Track
      {...styleProps([styles.track, sx], style)}
      data-slot="progress-track"
      {...props}
    />
  )
}

/** The filled part of the bar. */
function ProgressIndicator({
  style,
  sx,
  ...props
}: WithSx<ProgressPrimitive.Indicator.Props>) {
  return (
    <ProgressPrimitive.Indicator
      data-slot="progress-indicator"
      {...styleProps([styles.indicator, sx], style)}
      {...props}
    />
  )
}

/** Names the progress bar. */
function ProgressLabel({
  style,
  sx,
  ...props
}: WithSx<ProgressPrimitive.Label.Props>) {
  return (
    <ProgressPrimitive.Label
      {...styleProps([textStyles['2'], styles.label, sx], style)}
      data-slot="progress-label"
      {...props}
    />
  )
}

/** The formatted current value. */
function ProgressValue({
  style,
  sx,
  ...props
}: WithSx<ProgressPrimitive.Value.Props>) {
  return (
    <ProgressPrimitive.Value
      {...styleProps([textStyles['2'], styles.value, sx], style)}
      data-slot="progress-value"
      {...props}
    />
  )
}

export {
  Progress,
  ProgressTrack,
  ProgressIndicator,
  ProgressLabel,
  ProgressValue,
}
