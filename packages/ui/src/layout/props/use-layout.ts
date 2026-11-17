import type * as React from 'react'
import { useRender } from '@base-ui/react/use-render'
import * as stylex from '@stylexjs/stylex'

import type { WithSx, Sx } from '#/lib/sx.ts'
import type { Space } from '../../styles/tokens.stylex'
import * as margin from './margin'
import * as padding from './padding'

/** Padding and margin, each a step of the space scale. */
type SpaceProps = {
  [K in keyof typeof padding | keyof typeof margin]?: Space
}

const flexItem = stylex.create({
  // A growing child may also shrink below its content, or a long line or a
  // wide table inside it would push it out of its parent.
  grow: { flexGrow: 1, flexBasis: 0, minWidth: 0, minHeight: 0 },
  noShrink: { flexShrink: 0 },
})

/** How a primitive sits as the child of a flex parent. */
type FlexItemProps = {
  /** Take the space left over in a flex parent. */
  grow?: boolean
  /** `false` keeps the primitive at its own size when space runs short. */
  shrink?: boolean
}

/**
 * Props every layout primitive takes: its element's props, `render` to swap
 * the element, the space props and `sx`. A breakpoint or a length off the
 * scale goes in `sx`, which is merged last.
 */
type LayoutProps<Tag extends keyof React.JSX.IntrinsicElements> = WithSx<
  useRender.ComponentProps<Tag>
> &
  SpaceProps &
  FlexItemProps

/**
 * The class another component hands this one when it is that component's
 * `render`. It is not in the props' type, since a consumer passes `sx`.
 */
function outerClassName(props: object): string | undefined {
  return 'className' in props && typeof props.className === 'string'
    ? props.className
    : undefined
}

function joinClassNames(...names: ReadonlyArray<string | undefined>) {
  return names.filter(Boolean).join(' ') || undefined
}

/** The style for one space prop's step, or nothing when the prop is unset. */
function step(map: Record<Space, Sx>, value: Space | undefined) {
  return value != null && map[value]
}

type OwnStyles = ReadonlyArray<Sx | false | null | undefined>

/**
 * Renders one layout primitive. The order is the primitive's own styles, then
 * the space props, then the consumer's `sx`, so each can override the last.
 */
function useLayout<Tag extends keyof React.JSX.IntrinsicElements>(
  tag: Tag,
  slot: string,
  own: OwnStyles,
  props: LayoutProps<Tag>,
) {
  const {
    style,
    sx,
    render,
    grow,
    shrink,
    p,
    px,
    py,
    pt,
    pr,
    pb,
    pl,
    m,
    mx,
    my,
    mt,
    mr,
    mb,
    ml,
    ...elementProps
  } = props
  const resolved = stylex.props(
    own,
    grow === true && flexItem.grow,
    shrink === false && flexItem.noShrink,
    step(padding.p, p),
    step(padding.px, px),
    step(padding.py, py),
    step(padding.pt, pt),
    step(padding.pr, pr),
    step(padding.pb, pb),
    step(padding.pl, pl),
    step(margin.m, m),
    step(margin.mx, mx),
    step(margin.my, my),
    step(margin.mt, mt),
    step(margin.mr, mr),
    step(margin.mb, mb),
    step(margin.ml, ml),
    sx,
  )

  return useRender({
    defaultTagName: tag,
    // The consumer's `style` comes after the primitive's own.
    props: {
      ...elementProps,
      className: joinClassNames(
        outerClassName(elementProps),
        resolved.className,
      ),
      style: { ...resolved.style, ...style },
    },
    render,
    // `state` becomes `data-*` attributes, so `slot` sets `data-slot`.
    state: { slot },
  })
}

export { useLayout }
export type { FlexItemProps, LayoutProps, SpaceProps }
