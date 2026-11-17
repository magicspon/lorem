import * as React from 'react'
import { MoonIcon, SunIcon } from 'lucide-react'

import {
  IconButton,
  type IconButtonProps,
} from '#/actions/icon-button/index.ts'

/** A colour scheme, as `lightTheme` and `darkTheme` set it. */
type ColorScheme = 'light' | 'dark'

const DARK = '(prefers-color-scheme: dark)'

function subscribe(onChange: () => void) {
  const query = window.matchMedia(DARK)
  query.addEventListener('change', onChange)
  return () => query.removeEventListener('change', onChange)
}

const systemScheme = (): ColorScheme =>
  window.matchMedia(DARK).matches ? 'dark' : 'light'

/**
 * The system's colour scheme, kept current. The server can't know it, so it
 * renders light and the browser corrects it on hydration.
 */
function useSystemColorScheme(): ColorScheme {
  return React.useSyncExternalStore(subscribe, systemScheme, () => 'light')
}

/**
 * The choice to store for showing `scheme`: `null` when it is the system's,
 * so a toggle back to the system's scheme follows the system again.
 */
function chooseColorScheme(
  scheme: ColorScheme,
  system: ColorScheme,
): ColorScheme | null {
  return scheme === system ? null : scheme
}

/** Props for `ColorSchemeToggle`. */
type ColorSchemeToggleProps = Omit<
  IconButtonProps,
  'icon' | 'children' | 'onClick' | 'value'
> & {
  /** The scheme chosen over the system's, or `null` to follow the system. */
  value: ColorScheme | null
  /** Called with the new choice: a scheme, or `null` for the system's. */
  onValueChange: (value: ColorScheme | null) => void
}

/**
 * Two states on screen, three underneath (after Lea Verou, "Dark mode
 * toggles"). Following the system, a press picks the other scheme; with a
 * scheme picked, a press goes back to the system. A choice is never pinned
 * by accident, and a person who changes the system's scheme later still
 * gets it. The icon shows the scheme a press gives.
 */
function ColorSchemeToggle({
  value,
  onValueChange,
  variant = 'ghost',
  ...props
}: ColorSchemeToggleProps) {
  const system = useSystemColorScheme()
  // The choice a press makes: the other scheme, or back to the system's.
  const next = value === null ? (system === 'dark' ? 'light' : 'dark') : null
  const shown = next ?? system
  return (
    <IconButton
      data-slot="color-scheme-toggle"
      variant={variant}
      icon={shown === 'dark' ? <MoonIcon /> : <SunIcon />}
      onClick={() => onValueChange(next)}
      {...props}
    >
      {next === null
        ? `Use the system theme (${system})`
        : `Use the ${next} theme`}
    </IconButton>
  )
}

export { ColorSchemeToggle, chooseColorScheme, useSystemColorScheme }
export type { ColorScheme, ColorSchemeToggleProps }
