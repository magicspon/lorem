import { Tooltip as TooltipPrimitive } from '@base-ui/react/tooltip'
import * as stylex from '@stylexjs/stylex'

import { textStyles } from '#/typography/type-styles.ts'
import { styleProps, type WithSx } from '#/lib/sx.ts'
import { animations } from '#/styles/animations.ts'
import { popup } from '#/styles/shared.ts'
import { colors, radii, size, space } from '../../styles/tokens.stylex'

const LEFT = ':is([data-side=left], [data-side=inline-start])'
const RIGHT = ':is([data-side=right], [data-side=inline-end])'

const styles = stylex.create({
  content: {
    zIndex: 50,
    display: 'inline-flex',
    width: 'fit-content',
    maxWidth: size['80'],
    alignItems: 'center',
    gap: space['1'],
    borderRadius: radii['2xl'],
    backgroundColor: colors.foreground,
    paddingInline: space['3'],
    paddingBlock: space['1'],
    color: colors.background,
  },
  arrow: {
    zIndex: 50,
    width: size['2.5'],
    height: size['2.5'],
    rotate: '45deg',
    borderRadius: radii.sm,
    backgroundColor: colors.foreground,
    fill: colors.foreground,
    translate: {
      default: '0 calc(-50% - 2px)',
      [LEFT]: '-1.5px -50%',
      [RIGHT]: '1.5px -50%',
    },
    // Side arrows sit at mid height, over Base UI's inline offset.
    top: {
      default: null,
      ':is([data-side=bottom])': size['1'],
      [LEFT]: '50% !important',
      [RIGHT]: '50% !important',
    },
    bottom: { default: null, ':is([data-side=top])': `-${size['2.5']}` },
    left: { default: null, [RIGHT]: `-${size['1']}` },
    right: { default: null, [LEFT]: `-${size['1']}` },
  },
})

/** Shares open delays across tooltips. Opens without delay by default. */
function TooltipProvider({
  delay = 0,
  ...props
}: TooltipPrimitive.Provider.Props) {
  return (
    <TooltipPrimitive.Provider
      data-slot="tooltip-provider"
      delay={delay}
      {...props}
    />
  )
}

/** Root of a tooltip. Holds the open state. */
function Tooltip({ ...props }: TooltipPrimitive.Root.Props) {
  return <TooltipPrimitive.Root data-slot="tooltip" {...props} />
}

/** The element the tooltip describes. */
function TooltipTrigger({ ...props }: TooltipPrimitive.Trigger.Props) {
  return <TooltipPrimitive.Trigger data-slot="tooltip-trigger" {...props} />
}

/** The tooltip bubble, with an arrow. */
function TooltipContent({
  style,
  sx,
  side = 'top',
  sideOffset = 4,
  align = 'center',
  alignOffset = 0,
  children,
  ...props
}: WithSx<TooltipPrimitive.Popup.Props> &
  Pick<
    TooltipPrimitive.Positioner.Props,
    'align' | 'alignOffset' | 'side' | 'sideOffset'
  >) {
  return (
    <TooltipPrimitive.Portal>
      <TooltipPrimitive.Positioner
        align={align}
        alignOffset={alignOffset}
        side={side}
        sideOffset={sideOffset}
        {...stylex.props(popup.positioner)}
      >
        <TooltipPrimitive.Popup
          data-slot="tooltip-content"
          {...styleProps(
            [animations.popup, textStyles['1'], styles.content, sx],
            style,
          )}
          {...props}
        >
          {children}
          <TooltipPrimitive.Arrow {...stylex.props(styles.arrow)} />
        </TooltipPrimitive.Popup>
      </TooltipPrimitive.Positioner>
    </TooltipPrimitive.Portal>
  )
}

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider }
