'use client'

import * as React from 'react'
import { Toggle as TogglePrimitive } from '@base-ui/react/toggle'
import { ToggleGroup as ToggleGroupPrimitive } from '@base-ui/react/toggle-group'
import * as stylex from '@stylexjs/stylex'

import { styleProps, type WithSx } from '#/lib/sx.ts'
import { gap } from '#/layout/props/gap.ts'
import { radii, space, type Space } from '../../styles/tokens.stylex'
import { toggleStyles, type ToggleVariantProps } from '#/inputs/toggle/index.ts'

type Orientation = 'horizontal' | 'vertical'

const ToggleGroupContext = React.createContext<
  ToggleVariantProps & {
    spacing?: Space
    orientation?: Orientation
  }
>({
  size: 'default',
  variant: 'default',
  spacing: '2',
  orientation: 'horizontal',
})

const styles = stylex.create({
  group: {
    display: 'flex',
    width: 'fit-content',
    alignItems: 'center',
  },
  vertical: { flexDirection: 'column', alignItems: 'stretch' },
  horizontal: { flexDirection: 'row' },
  joinedOutline: { borderRadius: radii['4xl'] },
  item: {
    flexShrink: 0,
    zIndex: { default: null, ':focus': 10, ':focus-visible': 10 },
  },
  // With no spacing the items join into one bar, rounded at the ends.
  joined: {
    borderRadius: 0,
    paddingLeft: {
      default: space['3'],
      ':has([data-icon=inline-start])': space['2'],
    },
    paddingRight: {
      default: space['3'],
      ':has([data-icon=inline-end])': space['2'],
    },
  },
  joinedHorizontal: {
    borderTopLeftRadius: { default: null, ':first-child': radii['3xl'] },
    borderBottomLeftRadius: { default: null, ':first-child': radii['3xl'] },
    borderTopRightRadius: { default: null, ':last-child': radii['3xl'] },
    borderBottomRightRadius: { default: null, ':last-child': radii['3xl'] },
  },
  joinedVertical: {
    borderTopLeftRadius: { default: null, ':first-child': radii['3xl'] },
    borderTopRightRadius: { default: null, ':first-child': radii['3xl'] },
    borderBottomLeftRadius: { default: null, ':last-child': radii['3xl'] },
    borderBottomRightRadius: { default: null, ':last-child': radii['3xl'] },
  },
  // Joined outline items share borders.
  joinedOutlineHorizontal: {
    borderLeftWidth: { default: 0, ':first-child': 1 },
  },
  joinedOutlineVertical: {
    borderTopWidth: { default: 0, ':first-child': 1 },
  },
})

/** A set of toggles. Items inherit its variant, size and spacing. */
function ToggleGroup({
  style,
  sx,
  variant,
  size,
  spacing = '2',
  orientation = 'horizontal',
  children,
  ...props
}: WithSx<ToggleGroupPrimitive.Props> &
  ToggleVariantProps & {
    spacing?: Space
    orientation?: Orientation
  }) {
  return (
    <ToggleGroupPrimitive
      data-slot="toggle-group"
      data-variant={variant}
      data-size={size}
      data-spacing={spacing}
      data-orientation={orientation}
      {...styleProps(
        [
          styles.group,
          styles[orientation],
          gap[spacing],
          spacing === '0' && variant === 'outline' && styles.joinedOutline,
          sx,
        ],
        style,
      )}
      {...props}
    >
      <ToggleGroupContext.Provider
        value={{ variant, size, spacing, orientation }}
      >
        {children}
      </ToggleGroupContext.Provider>
    </ToggleGroupPrimitive>
  )
}

/** One toggle in a group. */
function ToggleGroupItem({
  style,
  sx,
  children,
  variant = 'default',
  size = 'default',
  ...props
}: WithSx<TogglePrimitive.Props> & ToggleVariantProps) {
  const context = React.useContext(ToggleGroupContext)
  const itemVariant = context.variant || variant
  const joined = context.spacing === '0'
  const vertical = context.orientation === 'vertical'

  return (
    <TogglePrimitive
      data-slot="toggle-group-item"
      data-variant={itemVariant}
      data-size={context.size || size}
      data-spacing={context.spacing}
      {...styleProps(
        [
          ...toggleStyles({ variant: itemVariant, size: context.size || size }),
          styles.item,
          joined && styles.joined,
          joined &&
            (vertical ? styles.joinedVertical : styles.joinedHorizontal),
          joined &&
            itemVariant === 'outline' &&
            (vertical
              ? styles.joinedOutlineVertical
              : styles.joinedOutlineHorizontal),
          sx,
        ],
        style,
      )}
      {...props}
    >
      {children}
    </TogglePrimitive>
  )
}

export { ToggleGroup, ToggleGroupItem }
