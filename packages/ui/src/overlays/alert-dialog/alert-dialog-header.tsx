import * as React from 'react'
import { AlertDialog as AlertDialogPrimitive } from '@base-ui/react/alert-dialog'
import * as stylex from '@stylexjs/stylex'

import { textStyles } from '#/typography/type-styles.ts'
import { styleProps, type WithSx } from '#/lib/sx.ts'
import { dialog } from '#/styles/shared.ts'
import { colors, radii, size, space } from '../../styles/tokens.stylex'
import { Grid } from '#/layout/index.ts'
import { SizeContext } from './size-context'

const SM = '@media (min-width: 40rem)'

const styles = stylex.create({
  // Centred on a phone; the media, if any, sits on top.
  header: { justifyItems: 'center', textAlign: 'center' },
  // From a tablet the media sits left of the title and description. Without
  // media the first column is empty, so it takes no width.
  headerStart: {
    gridTemplateColumns: { default: null, [SM]: 'auto 1fr' },
    justifyItems: { default: 'center', [SM]: 'start' },
    textAlign: { default: 'center', [SM]: 'start' },
  },
  // The title and description stack in the last column, media or not.
  textStart: { gridColumn: { default: null, [SM]: '-2' } },
  // Spans the title and description rows beside it.
  media: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: { default: size['10'], ':where(*) svg': size['6'] },
    height: { default: size['10'], ':where(*) svg': size['6'] },
    marginBottom: space['2'],
    borderRadius: radii.xl,
    backgroundColor: colors.muted,
  },
  mediaStart: {
    gridRow: { default: null, [SM]: 'span 2' },
    gridColumn: { default: null, [SM]: '1' },
    marginBottom: { default: space['2'], [SM]: 0 },
    // A margin, not a column gap, so an empty media column leaves no gap.
    marginRight: { default: null, [SM]: space['4'] },
  },
})

/** Groups the media, title and description. */
function AlertDialogHeader({
  sx,
  ...props
}: WithSx<React.ComponentProps<'div'>>) {
  const panelSize = React.useContext(SizeContext)
  return (
    <Grid
      data-slot="alert-dialog-header"
      gap="2"
      sx={[styles.header, panelSize === 'default' && styles.headerStart, sx]}
      {...props}
    />
  )
}

/** An icon above the title, or beside it from a tablet. */
function AlertDialogMedia({
  sx,
  ...props
}: WithSx<React.ComponentProps<'div'>>) {
  const panelSize = React.useContext(SizeContext)
  return (
    <div
      data-slot="alert-dialog-media"
      aria-hidden
      sx={[styles.media, panelSize === 'default' && styles.mediaStart, sx]}
      {...props}
    />
  )
}

/** The alert dialog's accessible name: the question it asks. */
function AlertDialogTitle({
  style,
  sx,
  ...props
}: WithSx<AlertDialogPrimitive.Title.Props>) {
  const panelSize = React.useContext(SizeContext)
  return (
    <AlertDialogPrimitive.Title
      data-slot="alert-dialog-title"
      {...styleProps(
        [
          textStyles['3'],
          dialog.title,
          panelSize === 'default' && styles.textStart,
          sx,
        ],
        style,
      )}
      {...props}
    />
  )
}

/** The alert dialog's accessible description: what the action will do. */
function AlertDialogDescription({
  style,
  sx,
  ...props
}: WithSx<AlertDialogPrimitive.Description.Props>) {
  const panelSize = React.useContext(SizeContext)
  return (
    <AlertDialogPrimitive.Description
      data-slot="alert-dialog-description"
      {...styleProps(
        [
          textStyles['2'],
          dialog.description,
          panelSize === 'default' && styles.textStart,
          sx,
        ],
        style,
      )}
      {...props}
    />
  )
}

export {
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
}
