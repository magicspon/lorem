import * as stylex from '@stylexjs/stylex'
import type { ReactNode } from 'react'

import {
  Button,
  type ButtonProps,
  type ButtonSize,
} from '#/actions/button/index.ts'
import { VisuallyHidden } from '#/typography/visually-hidden/index.ts'

/** The sizes of `IconButton`, each a square. */
type IconButtonSize = 'xs' | 'sm' | 'default' | 'lg'

// Each size is the button's square size of the same name.
const squareSizes = {
  xs: 'icon-xs',
  sm: 'icon-sm',
  default: 'icon',
  lg: 'icon-lg',
} as const satisfies Record<IconButtonSize, ButtonSize>

const styles = stylex.create({
  // Holds the icon without a box of its own, so the button's `svg` sizing
  // reaches it.
  icon: { display: 'contents' },
})

/** Props for `IconButton`. */
type IconButtonProps = Omit<ButtonProps, 'size' | 'children'> & {
  size?: IconButtonSize | null
  /** The icon shown. It is hidden from screen readers. */
  icon: ReactNode
  /**
   * The button's name. It is hidden on screen and read by screen readers, so
   * a button that shows only an icon still says what it does.
   */
  children: ReactNode
}

/**
 * A square `Button` that shows only an icon, with all of `Button`'s variants
 * and its `loading` state. The children name it for screen readers alone.
 */
function IconButton({
  size = 'default',
  icon,
  children,
  ...props
}: IconButtonProps) {
  return (
    <Button
      data-slot="icon-button"
      size={squareSizes[size ?? 'default']}
      {...props}
    >
      <span data-slot="icon-button-icon" aria-hidden sx={styles.icon}>
        {icon}
      </span>
      <VisuallyHidden>{children}</VisuallyHidden>
    </Button>
  )
}

export { IconButton }
export type { IconButtonProps, IconButtonSize }
