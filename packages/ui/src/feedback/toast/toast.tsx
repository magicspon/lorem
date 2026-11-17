import * as React from 'react'
import { Toast as ToastPrimitive } from '@base-ui/react/toast'
import * as stylex from '@stylexjs/stylex'
import {
  CircleAlertIcon,
  CircleCheckIcon,
  LoaderCircleIcon,
  TriangleAlertIcon,
  XIcon,
} from 'lucide-react'

import { Button } from '#/actions/button/index.ts'
import { IconButton } from '#/actions/icon-button/index.ts'
import { Stack } from '#/layout/index.ts'
import { styleProps, type WithSx } from '#/lib/sx.ts'
import { animations } from '#/styles/animations.ts'
import { popup } from '#/styles/shared.ts'
import { textStyles } from '#/typography/type-styles.ts'
import { colors, size, space } from '../../styles/tokens.stylex'

/**
 * The kinds of toast with an icon of their own. `loading`, `success` and
 * `error` are the types Base UI gives a `promise` toast as it settles.
 */
type ToastType = 'success' | 'error' | 'warning' | 'loading'

const SVG = ':where(*) svg'
const EASE = 'cubic-bezier(0.22, 1, 0.36, 1)'

// Base UI sets these on each toast; the stack is built from them, as in its
// own demo. Collapsed, a toast behind the front one shrinks 10% a step and
// peeks out above it; expanded, the toasts sit one above another.
const GAP = space['3']
const HEIGHT = 'var(--toast-frontmost-height, var(--toast-height))'
const SHRINK = 'min(1, var(--toast-index) * 0.1)'
const SWIPE_X = 'translateX(var(--toast-swipe-movement-x))'
const OFFSET_Y = `calc(var(--toast-offset-y) * -1 - var(--toast-index) * ${GAP} + var(--toast-swipe-movement-y))`
const COLLAPSED = `${SWIPE_X} translateY(calc(var(--toast-swipe-movement-y) - var(--toast-index) * ${GAP} - ${SHRINK} * ${HEIGHT})) scale(calc(1 - ${SHRINK}))`
const EXPANDED = `${SWIPE_X} translateY(${OFFSET_Y})`

const styles = stylex.create({
  root: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    boxSizing: 'border-box',
    width: '100%',
    zIndex: 'calc(1000 - var(--toast-index))',
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: colors.border,
    transformOrigin: 'bottom center',
    userSelect: 'none',
    cursor: 'default',
    height: { default: HEIGHT, ':is([data-expanded])': 'var(--toast-height)' },
    // Each state excludes the others: StyleX does not keep source order.
    transform: {
      default: COLLAPSED,
      ':is([data-expanded]):not([data-starting-style], [data-ending-style])':
        EXPANDED,
      ':is([data-starting-style], [data-ending-style]:not([data-swipe-direction]))':
        'translateY(150%)',
      ':is([data-ending-style][data-swipe-direction=up])':
        'translateY(calc(var(--toast-swipe-movement-y) - 150%))',
      ':is([data-ending-style][data-swipe-direction=down])':
        'translateY(calc(var(--toast-swipe-movement-y) + 150%))',
      ':is([data-ending-style][data-swipe-direction=left])': `translateX(calc(var(--toast-swipe-movement-x) - 150%)) translateY(${OFFSET_Y})`,
      ':is([data-ending-style][data-swipe-direction=right])': `translateX(calc(var(--toast-swipe-movement-x) + 150%)) translateY(${OFFSET_Y})`,
    },
    opacity: { default: null, ':is([data-limited], [data-ending-style])': 0 },
    transitionProperty: 'transform, opacity, height',
    transitionDuration: '500ms, 500ms, 150ms',
    transitionTimingFunction: EASE,
    outline: {
      default: 'none',
      ':focus-visible': `${size['0.5']} solid ${colors.ring}`,
    },
    // Bridges the gap between expanded toasts, so the stack stays open
    // while the pointer crosses it.
    '::after': {
      content: '""',
      position: 'absolute',
      top: '100%',
      left: 0,
      width: '100%',
      height: `calc(${GAP} + ${size.px})`,
    },
  },
  content: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: space['3'],
    padding: space['3'],
    overflow: 'hidden',
    // A toast behind the front one hides its text until the stack expands.
    opacity: { default: null, ':is([data-behind]):not([data-expanded])': 0 },
    transitionProperty: 'opacity',
    transitionDuration: '250ms',
    transitionTimingFunction: EASE,
  },
  icon: {
    display: 'flex',
    flexShrink: 0,
    paddingBlock: size['0.5'],
    width: { default: null, [SVG]: size['4'] },
    height: { default: null, [SVG]: size['4'] },
  },
  success: { color: colors.success },
  error: { color: colors.destructive },
  warning: { color: colors.warning },
  loading: { color: colors.mutedForeground },
  text: { flex: 1, minWidth: 0 },
  title: { margin: 0, fontWeight: 500 },
  description: { margin: 0, color: colors.mutedForeground },
})

const icons: Record<ToastType, React.ReactNode> = {
  success: <CircleCheckIcon />,
  error: <CircleAlertIcon />,
  warning: <TriangleAlertIcon />,
  loading: <LoaderCircleIcon />,
}

function isToastType(type: string | undefined): type is ToastType {
  return type !== undefined && type in icons
}

/** Props for `ToastItem`. */
type ToastItemProps = WithSx<Omit<ToastPrimitive.Root.Props, 'children'>>

/**
 * One toast: an icon for its type, its title and description, its action
 * button and a close button. Swipe it down or right to dismiss it.
 */
function ToastItem({ toast, style, sx, ...props }: ToastItemProps) {
  const type = isToastType(toast.type) ? toast.type : undefined
  return (
    <ToastPrimitive.Root
      data-slot="toast"
      toast={toast}
      {...styleProps([popup.surface, styles.root, sx], style)}
      {...props}
    >
      <ToastPrimitive.Content
        data-slot="toast-content"
        {...stylex.props(textStyles['2'], styles.content)}
      >
        {type && (
          <span
            aria-hidden
            sx={[
              styles.icon,
              styles[type],
              type === 'loading' && animations.spin,
            ]}
          >
            {icons[type]}
          </span>
        )}
        <Stack gap="1" sx={styles.text}>
          <ToastPrimitive.Title
            data-slot="toast-title"
            {...stylex.props(styles.title)}
          />
          <ToastPrimitive.Description
            data-slot="toast-description"
            {...stylex.props(styles.description)}
          />
        </Stack>
        {toast.actionProps && (
          <ToastPrimitive.Action
            data-slot="toast-action"
            render={<Button variant="outline" size="xs" />}
          />
        )}
        <ToastPrimitive.Close
          data-slot="toast-close"
          render={
            <IconButton variant="ghost" size="xs" icon={<XIcon />}>
              Close
            </IconButton>
          }
        />
      </ToastPrimitive.Content>
    </ToastPrimitive.Root>
  )
}

export { ToastItem }
export type { ToastItemProps, ToastType }
