import * as React from 'react'

/** `default` lines the header up on the left from a tablet; `sm` stays centred, actions side by side. */
export type AlertDialogSize = 'default' | 'sm'

/** The panel's size, which the header and footer lay out by. */
export const SizeContext = React.createContext<AlertDialogSize>('default')
