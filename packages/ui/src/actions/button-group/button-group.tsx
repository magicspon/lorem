import { mergeProps } from '@base-ui/react/merge-props'
import { useRender } from '@base-ui/react/use-render'
import * as stylex from '@stylexjs/stylex'

import { textStyles } from '#/typography/type-styles.ts'
import { styleProps, type WithSx } from '#/lib/sx.ts'
import { colors, radii, size, space } from '../../styles/tokens.stylex'
import { Separator, type SeparatorProps } from '#/layout/separator/index.ts'

const SVG = ':where(*) svg'
const PART = ':where(*) > [data-slot]'
const LAST_PART = ':where(*) > [data-slot]:not(:has(~ [data-slot]))'
const LATER_PART = ':where(*) > [data-slot] ~ [data-slot]'
const endRadius = `${radii['4xl']} !important`

type ButtonGroupOrientation = 'horizontal' | 'vertical'

const styles = stylex.create({
  group: {
    display: 'flex',
    width: 'fit-content',
    alignItems: 'stretch',
    gap: { default: null, ':has(> [data-slot=button-group])': space['2'] },
    // A focused part draws its ring over its neighbours.
    position: { default: null, ':where(*) > :focus-visible': 'relative' },
    zIndex: { default: null, ':where(*) > :focus-visible': 10 },
    flex: { default: null, ':where(*) > input': 1 },
  },
  // Parts join into one bar: inner corners go square and borders collapse.
  horizontal: {
    borderTopRightRadius: { default: null, [PART]: 0, [LAST_PART]: endRadius },
    borderBottomRightRadius: {
      default: null,
      [PART]: 0,
      [LAST_PART]: endRadius,
    },
    borderTopLeftRadius: { default: null, [LATER_PART]: 0 },
    borderBottomLeftRadius: { default: null, [LATER_PART]: 0 },
    borderLeftWidth: { default: null, [LATER_PART]: 0 },
  },
  vertical: {
    flexDirection: 'column',
    borderBottomLeftRadius: {
      default: null,
      [PART]: 0,
      [LAST_PART]: endRadius,
    },
    borderBottomRightRadius: {
      default: null,
      [PART]: 0,
      [LAST_PART]: endRadius,
    },
    borderTopLeftRadius: { default: null, [LATER_PART]: 0 },
    borderTopRightRadius: { default: null, [LATER_PART]: 0 },
    borderTopWidth: { default: null, [LATER_PART]: 0 },
  },
  text: {
    display: 'flex',
    alignItems: 'center',
    gap: space['2'],
    borderRadius: radii['4xl'],
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: colors.border,
    backgroundColor: colors.muted,
    paddingInline: space['2'],
    fontWeight: 500,
    pointerEvents: { default: null, [SVG]: 'none' },
    width: { default: null, [SVG]: size['4'] },
    height: { default: null, [SVG]: size['4'] },
  },
  separator: {
    position: 'relative',
    alignSelf: 'stretch',
    backgroundColor: colors.input,
  },
  separatorHorizontal: { marginInline: size.px, width: 'auto' },
  separatorVertical: { marginBlock: size.px, height: 'auto' },
})

/** Joins buttons, inputs and selects into one bar. */
function ButtonGroup({
  style,
  sx,
  orientation,
  ...props
}: WithSx<React.ComponentProps<'div'>> & {
  orientation?: ButtonGroupOrientation | null
}) {
  return (
    <div
      role="group"
      data-slot="button-group"
      data-orientation={orientation}
      {...styleProps(
        [styles.group, styles[orientation ?? 'horizontal'], sx],
        style,
      )}
      {...props}
    />
  )
}

/** A text label inside a button group. Pass `render` to change the element. */
function ButtonGroupText({
  sx,
  render,
  ...props
}: WithSx<useRender.ComponentProps<'div'>>) {
  const resolved = stylex.props([textStyles['2'], styles.text], sx)

  return useRender({
    defaultTagName: 'div',
    props: mergeProps<'div'>(
      { className: resolved.className, style: resolved.style },
      props,
    ),
    render,
    state: {
      slot: 'button-group-text',
    },
  })
}

/** A divider between parts of a button group. */
function ButtonGroupSeparator({
  sx,
  orientation = 'vertical',
  ...props
}: SeparatorProps) {
  return (
    <Separator
      data-slot="button-group-separator"
      orientation={orientation}
      sx={[
        styles.separator,
        orientation === 'horizontal'
          ? styles.separatorHorizontal
          : styles.separatorVertical,
        sx,
      ]}
      {...props}
    />
  )
}

export { ButtonGroup, ButtonGroupSeparator, ButtonGroupText }
