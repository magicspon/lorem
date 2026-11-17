import * as React from 'react'
import { Popover as PopoverPrimitive } from '@base-ui/react/popover'
import * as stylex from '@stylexjs/stylex'

import { textStyles } from '#/typography/type-styles.ts'
import { styleProps, type WithSx } from '#/lib/sx.ts'
import { animations } from '#/styles/animations.ts'
import { Stack } from '#/layout/index.ts'
import { popup } from '#/styles/shared.ts'
import { colors, size, space } from '../../styles/tokens.stylex'

/** `fit` sizes the panel to what it holds, as a calendar; `lg` holds a list. */
type PopoverContentSize = 'default' | 'fit' | 'lg'

const styles = stylex.create({
  content: {
    zIndex: 50,
    display: 'flex',
    width: size['72'],
    flexDirection: 'column',
    gap: space['4'],
    padding: space['4'],
  },
  fit: { width: 'auto', minWidth: size['56'] },
  // Never wider than a phone, less a gutter each side.
  lg: { width: size['90'], maxWidth: `calc(100vw - ${size['8']})` },
  title: {
    margin: 0,
    fontWeight: 500,
  },
  description: {
    margin: 0,
    color: colors.mutedForeground,
  },
})

/** Root of a popover. Holds the open state. */
function Popover({ ...props }: PopoverPrimitive.Root.Props) {
  return <PopoverPrimitive.Root data-slot="popover" {...props} />
}

/** Opens the popover. */
function PopoverTrigger({ ...props }: PopoverPrimitive.Trigger.Props) {
  return <PopoverPrimitive.Trigger data-slot="popover-trigger" {...props} />
}

/** The floating panel, positioned against the trigger. */
function PopoverContent({
  style,
  sx,
  align = 'center',
  alignOffset = 0,
  side = 'bottom',
  sideOffset = 4,
  size: panelSize = 'default',
  ...props
}: WithSx<PopoverPrimitive.Popup.Props> &
  Pick<
    PopoverPrimitive.Positioner.Props,
    'align' | 'alignOffset' | 'side' | 'sideOffset'
  > & { size?: PopoverContentSize }) {
  return (
    <PopoverPrimitive.Portal>
      <PopoverPrimitive.Positioner
        align={align}
        alignOffset={alignOffset}
        side={side}
        sideOffset={sideOffset}
        {...stylex.props(popup.positioner)}
      >
        <PopoverPrimitive.Popup
          data-slot="popover-content"
          // The marker lets nested parts, such as a calendar, drop their fill.
          {...styleProps(
            [
              stylex.defaultMarker(),
              popup.surface,
              animations.popup,
              textStyles['2'],
              styles.content,
              panelSize !== 'default' && styles[panelSize],
              sx,
            ],
            style,
          )}
          {...props}
        />
      </PopoverPrimitive.Positioner>
    </PopoverPrimitive.Portal>
  )
}

/** Groups the title and description. */
function PopoverHeader({ sx, ...props }: WithSx<React.ComponentProps<'div'>>) {
  return (
    <Stack
      data-slot="popover-header"
      gap="2"
      sx={[textStyles['2'], sx]}
      {...props}
    />
  )
}

/** The popover's accessible name. */
function PopoverTitle({
  style,
  sx,
  ...props
}: WithSx<PopoverPrimitive.Title.Props>) {
  return (
    <PopoverPrimitive.Title
      data-slot="popover-title"
      {...styleProps([textStyles['3'], styles.title, sx], style)}
      {...props}
    />
  )
}

/** The popover's accessible description. */
function PopoverDescription({
  style,
  sx,
  ...props
}: WithSx<PopoverPrimitive.Description.Props>) {
  return (
    <PopoverPrimitive.Description
      data-slot="popover-description"
      {...styleProps([styles.description, sx], style)}
      {...props}
    />
  )
}

export {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
}
