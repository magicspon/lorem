import type * as React from 'react'
import * as stylex from '@stylexjs/stylex'

/**
 * StyleX overrides a consumer passes to a component part: whatever
 * `stylex.props` accepts, themes included, since `sx` compiles to that call.
 */
export type Sx = typeof stylex.props extends (
  ...styles: ReadonlyArray<infer S>
) => unknown
  ? S
  : never

// The StyleX compiler turns `sx` on a lowercase element into
// `{...stylex.props(…)}`, so HTML and SVG elements accept it. A component
// gets it here too, through its DOM props, but only one that takes `sx` out
// and resolves it styles anything: the `tuesday/sx-on-foreign-component`
// lint rule catches the rest.
declare module 'react' {
  interface HTMLAttributes<T> {
    sx?: Sx
  }
  interface SVGAttributes<T> {
    sx?: Sx
  }
}

/** `Omit` that keeps a union of props, such as react-day-picker's modes, a union. */
export type DistributiveOmit<T, K extends PropertyKey> = T extends unknown
  ? Omit<T, K>
  : never

/**
 * Swaps a part's `className` for the `sx` override. ui is StyleX first, so
 * a consumer styles a part through `sx` and never with a class name.
 */
export type WithSx<P> = DistributiveOmit<P, 'className'> & {
  sx?: Sx
}

/** Base UI parts accept a value or a function of the part's state. */
type StateProp<State, T> = T | ((state: State) => T | undefined)

type StyleArray = ReadonlyArray<Sx | false | null | undefined>

/**
 * Resolves a part's StyleX styles and merges the consumer's `style` after
 * them. Accepts Base UI's state-function form of `style` and returns the same
 * form, so the part's state still reaches the consumer.
 */
export function styleProps(
  styles: StyleArray,
  style?: React.CSSProperties,
): { className?: string; style?: React.CSSProperties }
export function styleProps<State>(
  styles: StyleArray,
  style?: StateProp<State, React.CSSProperties>,
): { className?: string; style?: StateProp<State, React.CSSProperties> }
export function styleProps<State>(
  styles: StyleArray,
  style?: StateProp<State, React.CSSProperties>,
): { className?: string; style?: StateProp<State, React.CSSProperties> } {
  const resolved = stylex.props(styles)
  // StyleX only returns inline styles for dynamic values.
  const base: React.CSSProperties | undefined = resolved.style

  return {
    className: resolved.className,
    style:
      typeof style === 'function'
        ? (state: State) => ({ ...base, ...style(state) })
        : base || style
          ? { ...base, ...style }
          : undefined,
  }
}

/**
 * `styleProps` for styles that depend on a Base UI part's state, such as its
 * orientation. Returns the state-function form of `className` and `style`.
 */
export function stateStyleProps<State>(
  styles: (state: State) => StyleArray,
  style?: StateProp<State, React.CSSProperties>,
): {
  className: (state: State) => string | undefined
  style: (state: State) => React.CSSProperties | undefined
} {
  const resolve = (state: State) => {
    const resolved = styleProps(styles(state), style)
    return {
      className: resolved.className,
      style:
        typeof resolved.style === 'function'
          ? resolved.style(state)
          : resolved.style,
    }
  }
  return {
    className: (state) => resolve(state).className,
    style: (state) => resolve(state).style,
  }
}
