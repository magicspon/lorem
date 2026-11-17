import type { Sx } from '#/lib/sx.ts'

/** The breakpoints a responsive prop takes: `initial` applies at every width. */
type Breakpoint = 'initial' | 'sm' | 'md' | 'lg'

/**
 * A prop value that can change with the viewport's width: one value, or one
 * per breakpoint, as in Radix Themes. `sm` is 40rem, `md` 48rem and `lg`
 * 64rem, each a minimum width. A breakpoint left out keeps the one below it.
 */
type Responsive<T extends string> = T | Partial<Record<Breakpoint, T>>

type ResponsiveMap<T extends string> = { base: Sx } & Record<
  Breakpoint,
  Record<T, Sx>
>

const breakpoints = ['initial', 'sm', 'md', 'lg'] as const

/**
 * Resolves a responsive prop to its styles. One value uses `fixed`, the plain
 * static map. An object uses the breakpoint map; `fallback` stands in for a
 * missing `initial`, so the component's default still holds below the first
 * breakpoint given.
 */
function responsiveStyles<T extends string>(
  value: Responsive<T> | undefined,
  fixed: Record<T, Sx>,
  map: ResponsiveMap<T>,
  fallback?: T,
): Sx[] {
  if (value === undefined) return fallback ? [fixed[fallback]] : []
  if (typeof value === 'string') return [fixed[value]]
  const styles: Sx[] = [map.base]
  for (const breakpoint of breakpoints) {
    const step =
      breakpoint === 'initial' ? (value.initial ?? fallback) : value[breakpoint]
    if (step !== undefined) styles.push(map[breakpoint][step])
  }
  return styles
}

/** Applies `convert` to a responsive value, at every breakpoint it names. */
function mapResponsive<T extends string, U extends string>(
  value: Responsive<T> | undefined,
  convert: (step: T) => U,
): Responsive<U> | undefined {
  if (value === undefined) return undefined
  if (typeof value === 'string') return convert(value)
  const out: Partial<Record<Breakpoint, U>> = {}
  for (const breakpoint of breakpoints) {
    const step = value[breakpoint]
    if (step !== undefined) out[breakpoint] = convert(step)
  }
  return out
}

export { mapResponsive, responsiveStyles }
export type { Breakpoint, Responsive }
