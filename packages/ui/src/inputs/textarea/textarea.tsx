import * as React from 'react'
import * as stylex from '@stylexjs/stylex'

import { textStyles } from '#/typography/type-styles.ts'
import { styleProps, type WithSx } from '#/lib/sx.ts'
import { field } from '#/styles/shared.ts'
import { colors, radii, size, space } from '../../styles/tokens.stylex'

const styles = stylex.create({
  textarea: {
    display: 'flex',
    // Grows with its content, down to `minHeight`.
    fieldSizing: 'content',
    minHeight: size['16'],
    resize: 'none',
    borderRadius: radii.xl,
    paddingBlock: space['3'],
  },
  // Fills its parent, such as a note on a workspace, which is the frame: no
  // border or fill of its own until it has focus, and it scrolls, not grows.
  bare: {
    height: '100%',
    fieldSizing: 'fixed',
    minHeight: 0,
    borderColor: { default: 'transparent', ':focus-visible': colors.ring },
    backgroundColor: {
      default: 'transparent',
      ':hover:not(:disabled, :focus-visible)': 'transparent',
    },
  },
})

/** Props for `Textarea`. */
type TextareaProps = WithSx<React.ComponentProps<'textarea'>> & {
  /**
   * `field` is a bordered box in a form that grows with its text; `bare`
   * fills its parent with no border or fill, for text typed straight onto
   * something like a note.
   * @default 'field'
   */
  variant?: 'field' | 'bare'
}

/** A multi-line text field that grows with its content. */
function Textarea({ variant = 'field', style, sx, ...props }: TextareaProps) {
  return (
    <textarea
      data-slot="textarea"
      data-variant={variant}
      {...styleProps(
        [
          textStyles.control,
          field.control,
          styles.textarea,
          variant === 'bare' && styles.bare,
          sx,
        ],
        style,
      )}
      {...props}
    />
  )
}

export { Textarea }
export type { TextareaProps }
