import * as React from 'react'
import { AlertDialog as AlertDialogPrimitive } from '@base-ui/react/alert-dialog'
import * as stylex from '@stylexjs/stylex'

import { textStyles } from '#/typography/type-styles.ts'
import { styleProps, type WithSx } from '#/lib/sx.ts'
import { animations } from '#/styles/animations.ts'
import { dialog } from '#/styles/shared.ts'
import { size } from '../../styles/tokens.stylex'
import { Button, type ButtonProps } from '#/actions/button/index.ts'
import { Flex } from '#/layout/index.ts'
import { SizeContext, type AlertDialogSize } from './size-context'

const SM = '@media (min-width: 40rem)'

const styles = stylex.create({
  // Narrower than a dialog: it asks one question.
  default: {
    maxWidth: { default: `calc(100% - ${size['8']})`, [SM]: size['96'] },
  },
  sm: { maxWidth: { default: `calc(100% - ${size['8']})`, [SM]: size['80'] } },
  // Two equal actions side by side, even on a phone.
  footerSm: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
  },
})

/** Root of an alert dialog. Holds the open state; outside clicks do not close it. */
function AlertDialog({ ...props }: AlertDialogPrimitive.Root.Props) {
  return <AlertDialogPrimitive.Root data-slot="alert-dialog" {...props} />
}

/** Opens the alert dialog. */
function AlertDialogTrigger({ ...props }: AlertDialogPrimitive.Trigger.Props) {
  return (
    <AlertDialogPrimitive.Trigger data-slot="alert-dialog-trigger" {...props} />
  )
}

/** Moves the alert dialog into `document.body`. */
function AlertDialogPortal({ ...props }: AlertDialogPrimitive.Portal.Props) {
  return (
    <AlertDialogPrimitive.Portal data-slot="alert-dialog-portal" {...props} />
  )
}

/** The dimmed backdrop behind the alert dialog. */
function AlertDialogOverlay({
  style,
  sx,
  ...props
}: WithSx<AlertDialogPrimitive.Backdrop.Props>) {
  return (
    <AlertDialogPrimitive.Backdrop
      data-slot="alert-dialog-overlay"
      {...styleProps([dialog.overlay, animations.fade, sx], style)}
      {...props}
    />
  )
}

/**
 * The alert dialog panel, with its overlay. It has no corner close button:
 * the person answers through `Cancel` or `Action`.
 */
function AlertDialogContent({
  style,
  sx,
  size: panelSize = 'default',
  ...props
}: WithSx<AlertDialogPrimitive.Popup.Props> & { size?: AlertDialogSize }) {
  return (
    <AlertDialogPortal>
      <AlertDialogOverlay />
      <SizeContext.Provider value={panelSize}>
        <AlertDialogPrimitive.Popup
          data-slot="alert-dialog-content"
          data-size={panelSize}
          {...styleProps(
            [
              textStyles['2'],
              dialog.panel,
              styles[panelSize],
              animations.zoom,
              sx,
            ],
            style,
          )}
          {...props}
        />
      </SizeContext.Provider>
    </AlertDialogPortal>
  )
}

/** Holds the `Cancel` and `Action` buttons. */
function AlertDialogFooter({
  sx,
  ...props
}: WithSx<React.ComponentProps<'div'>>) {
  const panelSize = React.useContext(SizeContext)
  return (
    <Flex
      data-slot="alert-dialog-footer"
      gap="2"
      sx={[dialog.footer, panelSize === 'sm' && styles.footerSm, sx]}
      {...props}
    />
  )
}

/** Confirms. A button; pass `variant="destructive"` for an action that cannot be undone. */
function AlertDialogAction(props: ButtonProps) {
  return <Button data-slot="alert-dialog-action" {...props} />
}

/** Closes the alert dialog without acting. An outline button. */
function AlertDialogCancel({
  variant = 'outline',
  size: buttonSize,
  sx,
  ...props
}: AlertDialogPrimitive.Close.Props &
  Pick<ButtonProps, 'variant' | 'size' | 'sx'>) {
  return (
    <AlertDialogPrimitive.Close
      data-slot="alert-dialog-cancel"
      render={<Button variant={variant} size={buttonSize} sx={sx} />}
      {...props}
    />
  )
}

export {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogOverlay,
  AlertDialogPortal,
  AlertDialogTrigger,
}
