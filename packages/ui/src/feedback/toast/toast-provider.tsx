import type * as React from 'react'
import { Toast as ToastPrimitive } from '@base-ui/react/toast'
import * as stylex from '@stylexjs/stylex'

import { size } from '../../styles/tokens.stylex'
import { ToastItem } from './toast'

const SM = '@media (min-width: 31.25rem)'

const styles = stylex.create({
  viewport: {
    position: 'fixed',
    zIndex: 60,
    right: { default: size['4'], [SM]: size['8'] },
    bottom: { default: size['4'], [SM]: size['8'] },
    width: { default: `calc(100vw - ${size['8']})`, [SM]: size['90'] },
  },
})

/** Props for `ToastProvider`. */
type ToastProviderProps = Omit<ToastPrimitive.Provider.Props, 'children'> & {
  children?: React.ReactNode
}

/** Renders every toast in the stack, newest in front. */
function ToastList() {
  const { toasts } = ToastPrimitive.useToastManager()
  return toasts.map((toast) => <ToastItem key={toast.id} toast={toast} />)
}

/**
 * Holds the toasts and shows them in the page's bottom-right corner. Wrap
 * the app in it once; inside, `useToast()` adds them. Pass a manager from
 * `createManager()` as `toastManager` to add toasts from outside React.
 */
function ToastProvider({ children, ...props }: ToastProviderProps) {
  return (
    <ToastPrimitive.Provider {...props}>
      {children}
      <ToastPrimitive.Portal>
        <ToastPrimitive.Viewport
          data-slot="toast-viewport"
          {...stylex.props(styles.viewport)}
        >
          <ToastList />
        </ToastPrimitive.Viewport>
      </ToastPrimitive.Portal>
    </ToastPrimitive.Provider>
  )
}

/**
 * Adds, updates and closes toasts. `add({ title, description, type })` shows
 * one; `promise(p, { loading, success, error })` follows a promise.
 */
const useToast = ToastPrimitive.useToastManager

/** Creates a toast manager to pass to `ToastProvider`, for use outside React. */
const createManager = ToastPrimitive.createToastManager

export { ToastProvider, createManager, useToast }
export type { ToastProviderProps }
