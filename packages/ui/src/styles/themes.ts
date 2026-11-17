import * as stylex from '@stylexjs/stylex'

/*
 * Every colour token holds both schemes in `light-dark()`, which follows the
 * element's `color-scheme`. `:root` takes the system's (see `globals.css`), so
 * a theme here only overrides it: the toggle's alternative to the system.
 */
const schemes = stylex.create({
  light: { colorScheme: 'light' },
  dark: { colorScheme: 'dark' },
})

/** Light theme on any subtree, whatever the system: `<div sx={lightTheme}>`. */
export const lightTheme = schemes.light

/** Dark theme on any subtree, whatever the system: `<div sx={darkTheme}>`. */
export const darkTheme = schemes.dark
