import * as stylex from '@stylexjs/stylex'
import type * as React from 'react'

import { textStyles } from '#/typography/type-styles.ts'
import { colors, radii, size } from '../styles/tokens.stylex'

const styles = stylex.create({
  tile: {
    display: 'grid',
    placeItems: 'center',
    minWidth: size['12'],
    minHeight: size['12'],
    borderRadius: radii.lg,
    backgroundColor: colors.muted,
    color: colors.mutedForeground,
  },
})

/** A placeholder block, so a story shows where a primitive puts its children. */
export function Tile({ children }: { children?: React.ReactNode }) {
  return (
    <div data-testid="tile" sx={[textStyles['2'], styles.tile]}>
      {children}
    </div>
  )
}

/** Reads a computed style, for play functions that check a prop landed. */
export function computed(element: Element | null, property: string) {
  return element ? getComputedStyle(element).getPropertyValue(property) : ''
}
