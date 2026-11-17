import * as React from 'react'
import { Dialog as DialogPrimitive } from '@base-ui/react/dialog'
import * as stylex from '@stylexjs/stylex'
import { XIcon } from 'lucide-react'

import { textStyles } from '#/typography/type-styles.ts'
import { styleProps, type WithSx } from '#/lib/sx.ts'
import { animations } from '#/styles/animations.ts'
import { dialog } from '#/styles/shared.ts'
import { size, space } from '../../styles/tokens.stylex'
import { Button } from '#/actions/button/index.ts'
import { Flex, Stack } from '#/layout/index.ts'
import { IconButton } from '#/actions/icon-button/index.ts'

const styles = stylex.create({
  form: { display: 'flex', flexDirection: 'column', gap: space['5'] },
  close: {
    position: 'absolute',
    top: size['4'],
    right: size['4'],
  },
})

/** Root of a dialog. Holds the open state. */
function Dialog({ ...props }: DialogPrimitive.Root.Props) {
  return <DialogPrimitive.Root data-slot="dialog" {...props} />
}

/** Opens the dialog. */
function DialogTrigger({ ...props }: DialogPrimitive.Trigger.Props) {
  return <DialogPrimitive.Trigger data-slot="dialog-trigger" {...props} />
}

/** Moves the dialog into `document.body`. */
function DialogPortal({ ...props }: DialogPrimitive.Portal.Props) {
  return <DialogPrimitive.Portal data-slot="dialog-portal" {...props} />
}

/** Closes the dialog. */
function DialogClose({ ...props }: DialogPrimitive.Close.Props) {
  return <DialogPrimitive.Close data-slot="dialog-close" {...props} />
}

/** The dimmed backdrop behind the dialog. */
function DialogOverlay({
  style,
  sx,
  ...props
}: WithSx<DialogPrimitive.Backdrop.Props>) {
  return (
    <DialogPrimitive.Backdrop
      data-slot="dialog-overlay"
      {...styleProps([dialog.overlay, animations.fade, sx], style)}
      {...props}
    />
  )
}

/** The dialog panel, with its overlay and an optional corner close button. */
function DialogContent({
  style,
  sx,
  children,
  showCloseButton = true,
  size: panelSize = 'default',
  ...props
}: WithSx<DialogPrimitive.Popup.Props> & {
  showCloseButton?: boolean
  /** `large` is a roomy panel for a task of its own, such as a wizard; `medium` is a narrower panel that hugs a scrolling list. Give either a `Body`. */
  size?: 'default' | 'medium' | 'large'
}) {
  return (
    <DialogPortal>
      <DialogOverlay />
      <DialogPrimitive.Popup
        data-slot="dialog-content"
        {...styleProps(
          // The marker lets nested parts, such as command items, react to it.
          [
            stylex.defaultMarker(),
            textStyles['2'],
            dialog.panel,
            panelSize === 'medium' && dialog.panelMedium,
            panelSize === 'large' && dialog.panelLarge,
            animations.zoom,
            sx,
          ],
          style,
        )}
        {...props}
      >
        {children}
        {showCloseButton && (
          <DialogPrimitive.Close
            data-slot="dialog-close"
            render={
              <IconButton
                variant="ghost"
                size="sm"
                icon={<XIcon />}
                sx={styles.close}
              >
                Close
              </IconButton>
            }
          />
        )}
      </DialogPrimitive.Popup>
    </DialogPortal>
  )
}

/** The part of a large dialog that scrolls, between its header and footer. */
function DialogBody({ sx, ...props }: WithSx<React.ComponentProps<'div'>>) {
  return <div data-slot="dialog-body" sx={[dialog.body, sx]} {...props} />
}

/** Groups the title and description. */
function DialogHeader(props: WithSx<React.ComponentProps<'div'>>) {
  return <Stack data-slot="dialog-header" gap="3" {...props} />
}

/**
 * A form holding the header, fields and footer, spaced as the content spaces
 * its own children: a bare `<form>` would gather them into one child, with
 * no space between them.
 */
function DialogForm({
  style,
  sx,
  ...props
}: WithSx<React.ComponentProps<'form'>>) {
  return (
    <form
      data-slot="dialog-form"
      {...styleProps([styles.form, sx], style)}
      {...props}
    />
  )
}

/** Holds the dialog's actions, with an optional close button. */
function DialogFooter({
  sx,
  showCloseButton = false,
  children,
  ...props
}: WithSx<React.ComponentProps<'div'>> & {
  showCloseButton?: boolean
}) {
  return (
    <Flex data-slot="dialog-footer" gap="2" sx={[dialog.footer, sx]} {...props}>
      {children}
      {showCloseButton && (
        <DialogPrimitive.Close render={<Button variant="outline" />}>
          Close
        </DialogPrimitive.Close>
      )}
    </Flex>
  )
}

/** The dialog's accessible name. */
function DialogTitle({
  style,
  sx,
  ...props
}: WithSx<DialogPrimitive.Title.Props>) {
  return (
    <DialogPrimitive.Title
      data-slot="dialog-title"
      {...styleProps([textStyles['3'], dialog.title, sx], style)}
      {...props}
    />
  )
}

/** The dialog's accessible description. */
function DialogDescription({
  style,
  sx,
  ...props
}: WithSx<DialogPrimitive.Description.Props>) {
  return (
    <DialogPrimitive.Description
      data-slot="dialog-description"
      {...styleProps([textStyles['2'], dialog.description, sx], style)}
      {...props}
    />
  )
}

export {
  Dialog,
  DialogClose,
  DialogContent,
  DialogBody,
  DialogDescription,
  DialogFooter,
  DialogForm,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
}
