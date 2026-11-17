import type * as React from 'react'
import * as stylex from '@stylexjs/stylex'

import { textStyles } from '#/typography/type-styles.ts'
import { styleProps, type WithSx } from '#/lib/sx.ts'
import { space } from '../../styles/tokens.stylex'

const styles = stylex.create({
  fieldset: {
    display: 'flex',
    flexDirection: 'column',
    // Checkbox and radio lists sit closer to their legend.
    gap: {
      default: space['5'],
      ':has(> :is([data-slot=checkbox-group], [role=radiogroup]))': space['3'],
    },
    minWidth: 0,
    margin: 0,
    padding: 0,
    borderWidth: 0,
  },
  legend: {
    marginBottom: space['3'],
    padding: 0,
    fontWeight: 500,
  },
})

/** Props for `Fieldset`. */
type FieldsetProps = WithSx<React.ComponentProps<'fieldset'>>

/** Groups related fields under one legend. `disabled` disables the native controls inside. */
function Fieldset({ style, sx, ...props }: FieldsetProps) {
  return (
    <fieldset
      data-slot="fieldset"
      {...styleProps([styles.fieldset, sx], style)}
      {...props}
    />
  )
}

/** Props for `FieldsetLegend`. */
type FieldsetLegendProps = WithSx<React.ComponentProps<'legend'>> & {
  /** `label` sets the legend at label size. @default 'legend' */
  variant?: 'legend' | 'label'
}

/** The fieldset's heading, which names the group. */
function FieldsetLegend({
  style,
  sx,
  variant = 'legend',
  ...props
}: FieldsetLegendProps) {
  return (
    // A native legend sits outside the fieldset's flex gap.
    <legend
      data-slot="fieldset-legend"
      data-variant={variant}
      {...styleProps(
        [
          // A following description tucks up under the legend.
          stylex.defaultMarker(),
          styles.legend,
          variant === 'legend' ? textStyles['3'] : textStyles['2'],
          sx,
        ],
        style,
      )}
      {...props}
    />
  )
}

export { Fieldset, FieldsetLegend }
export type { FieldsetLegendProps, FieldsetProps }
