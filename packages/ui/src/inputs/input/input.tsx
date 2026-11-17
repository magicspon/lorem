import * as React from 'react'
import { Input as InputPrimitive } from '@base-ui/react/input'
import * as stylex from '@stylexjs/stylex'

import { textStyles } from '#/typography/type-styles.ts'
import { styleProps, type WithSx } from '#/lib/sx.ts'
import { field } from '#/styles/shared.ts'
import { colors, size, space } from '../../styles/tokens.stylex'

const styles = stylex.create({
  input: {
    height: size['9'],
    paddingBlock: space['1'],
    pointerEvents: { default: null, ':disabled': 'none' },
    '::file-selector-button': {
      display: 'inline-flex',
      // The browser's own gap before the file name.
      marginInlineEnd: space['1'],
      height: size['7'],
      borderWidth: 0,
      backgroundColor: 'transparent',
      fontWeight: 500,
      color: colors.foreground,
    },
  },
})

/** Props for `Input`. */
type InputProps = WithSx<React.ComponentProps<'input'>>

/** A single-line text field. */
function Input({ style, sx, type, ...props }: InputProps) {
  return (
    <InputPrimitive
      type={type}
      data-slot="input"
      {...styleProps(
        [textStyles.control, field.control, styles.input, sx],
        style,
      )}
      {...props}
    />
  )
}

export { Input }
export type { InputProps }
