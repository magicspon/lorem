import * as React from 'react'
import * as stylex from '@stylexjs/stylex'

import { textStyles } from '#/typography/type-styles.ts'
import { styleProps, type WithSx } from '#/lib/sx.ts'
import { colors, motion, radii, size, space } from '../../styles/tokens.stylex'
import { shadows } from '../../styles/shadows.stylex'
import { Button, type ButtonProps } from '#/actions/button/index.ts'
import { Input, type InputProps } from '#/inputs/input/index.ts'
import { Textarea, type TextareaProps } from '#/inputs/textarea/index.ts'

const SVG = ':where(*) svg'
const CHILD_SVG = ':where(*) > svg'

const SM = '@media (min-width: 40rem)'

// The group carries the default marker, so its parts can react to its state.
const styles = stylex.create({
  // A search box in a toolbar: a row of its own on a phone, fixed beside
  // the filters above that.
  search: { width: { default: '100%', [SM]: size['64'] } },
  group: {
    position: 'relative',
    display: 'flex',
    flexDirection: {
      default: null,
      ':has(> :is([data-align=block-end], [data-align=block-start]))': 'column',
    },
    height: {
      default: size['9'],
      ':has(> :is([data-align=block-end], [data-align=block-start], textarea))':
        'auto',
    },
    width: '100%',
    minWidth: 0,
    alignItems: 'center',
    borderRadius: {
      default: radii['4xl'],
      ':has(textarea)': radii.xl,
      ':has(:is([data-align=block-end], [data-align=block-start]))':
        radii['2xl'],
    },
    borderWidth: 1,
    borderStyle: {
      default: 'solid',
      [stylex.when.ancestor(':is([data-slot=combobox-content])')]: 'none',
    },
    borderColor: {
      default: colors.input,
      ':has([data-slot=input-group-control]:focus-visible)': colors.ring,
      ':has([data-slot][aria-invalid=true])': colors.invalidBorder,
    },
    backgroundColor: colors.controlBackground,
    boxShadow: {
      default: null,
      ':has([data-slot=input-group-control]:focus-visible)': shadows.focusRing,
      ':has([data-slot][aria-invalid=true])': shadows.invalidRing,
      [stylex.when.ancestor(':is([data-slot=combobox-content])')]: 'none',
    },
    // Any direct input child, such as a cmdk input, gives way to its addons.
    paddingTop: {
      default: null,
      ':has(> [data-align=block-end]) > input': space['3'],
    },
    paddingBottom: {
      default: null,
      ':has(> [data-align=block-start]) > input': space['3'],
    },
    paddingRight: {
      default: null,
      ':has(> [data-align=inline-end]) > input': space['1'],
    },
    paddingLeft: {
      default: null,
      ':has(> [data-align=inline-start]) > input': space['1'],
    },
    margin: {
      default: null,
      [stylex.when.ancestor(':is([data-slot=combobox-content])')]:
        `${space['1']} ${space['1']} 0`,
    },
    transitionProperty: 'color, background-color, border-color',
    transitionDuration: motion.normal,
    transitionTimingFunction: motion.ease,
    outline: 'none',
  },
  addon: {
    display: 'flex',
    height: { default: 'auto', [CHILD_SVG]: size['4'] },
    cursor: 'text',
    alignItems: 'center',
    justifyContent: 'center',
    gap: space['2'],
    paddingBlock: space['2'],
    fontWeight: 500,
    color: colors.mutedForeground,
    userSelect: 'none',
    opacity: {
      default: null,
      [stylex.when.ancestor(':is([data-disabled=true])')]: 0.5,
    },
    width: { default: null, [CHILD_SVG]: size['4'] },
  },
  'inline-start': {
    order: -9999,
    paddingLeft: space['3'],
    marginLeft: {
      default: null,
      ':has(> button)': `-${space['1']}`,
      ':has(> kbd)': `-${size['0.5']}`,
    },
  },
  'inline-end': {
    order: 9999,
    paddingRight: space['3'],
    marginRight: {
      default: null,
      ':has(> button)': `-${space['1']}`,
      ':has(> kbd)': `-${size['0.5']}`,
    },
  },
  'block-start': {
    order: -9999,
    width: { default: '100%', [CHILD_SVG]: size['4'] },
    justifyContent: 'flex-start',
    paddingInline: space['3'],
    paddingTop: space['3'],
  },
  'block-end': {
    order: 9999,
    width: { default: '100%', [CHILD_SVG]: size['4'] },
    justifyContent: 'flex-start',
    paddingInline: space['3'],
    paddingBottom: space['3'],
  },
  button: {
    display: 'flex',
    alignItems: 'center',
    gap: space['2'],
    borderRadius: radii['4xl'],
  },
  'button-xs': {
    height: { default: size['6'], [CHILD_SVG]: size['3.5'] },
    width: { default: null, [CHILD_SVG]: size['3.5'] },
    gap: space['1'],
    paddingLeft: space['1'],
    paddingRight: space['1'],
  },
  'button-sm': {},
  'button-icon-xs': {
    width: { default: size['6'], [SVG]: size['4'] },
    height: { default: size['6'], [SVG]: size['4'] },
    paddingLeft: 0,
    paddingRight: 0,
  },
  'button-icon-sm': {
    width: { default: size['8'], [SVG]: size['4'] },
    height: { default: size['8'], [SVG]: size['4'] },
    paddingLeft: 0,
    paddingRight: 0,
  },
  text: {
    display: 'flex',
    alignItems: 'center',
    gap: space['2'],
    color: colors.mutedForeground,
    pointerEvents: { default: null, [SVG]: 'none' },
    width: { default: null, [SVG]: size['4'] },
    height: { default: null, [SVG]: size['4'] },
  },
  // Controls drop their own frame; the group draws it.
  control: {
    flex: 1,
    borderRadius: 0,
    borderWidth: 0,
    backgroundColor: 'transparent',
    boxShadow: 'none',
  },
  textarea: {
    paddingBlock: space['2'],
  },
})

/** A bordered frame that joins a control with addons, text and buttons. */
function InputGroup({
  style,
  sx,
  variant = 'default',
  ...props
}: WithSx<React.ComponentProps<'div'>> & { variant?: 'default' | 'search' }) {
  return (
    <div
      data-slot="input-group"
      role="group"
      {...styleProps(
        [
          stylex.defaultMarker(),
          styles.group,
          variant === 'search' && styles.search,
          sx,
        ],
        style,
      )}
      {...props}
    />
  )
}

type InputGroupAddonAlign =
  | 'inline-start'
  | 'inline-end'
  | 'block-start'
  | 'block-end'

/** Content placed beside or above the control. Clicking it focuses the input. */
function InputGroupAddon({
  style,
  sx,
  align = 'inline-start',
  ...props
}: WithSx<React.ComponentProps<'div'>> & {
  align?: InputGroupAddonAlign | null
}) {
  const alignment = align ?? 'inline-start'
  return (
    <div
      role="group"
      data-slot="input-group-addon"
      data-align={alignment}
      {...styleProps(
        [textStyles['2'], styles.addon, styles[alignment], sx],
        style,
      )}
      onClick={(e) => {
        if (e.target instanceof Element && e.target.closest('button')) {
          return
        }
        e.currentTarget.parentElement?.querySelector('input')?.focus()
      }}
      {...props}
    />
  )
}

type InputGroupButtonSize = 'xs' | 'sm' | 'icon-xs' | 'icon-sm'

/** A compact button sized to sit inside the group. */
function InputGroupButton({
  sx,
  type = 'button',
  variant = 'ghost',
  size = 'xs',
  ...props
}: Omit<ButtonProps, 'size' | 'type'> & {
  size?: InputGroupButtonSize | null
  type?: 'button' | 'submit' | 'reset'
}) {
  const buttonSize = size ?? 'xs'
  return (
    <Button
      type={type}
      data-size={buttonSize}
      variant={variant}
      sx={[textStyles['2'], styles.button, styles[`button-${buttonSize}`], sx]}
      {...props}
    />
  )
}

/** Muted text inside an addon. */
function InputGroupText({
  style,
  sx,
  ...props
}: WithSx<React.ComponentProps<'span'>>) {
  return (
    <span
      {...styleProps([textStyles['2'], styles.text, sx], style)}
      {...props}
    />
  )
}

/** The group's single-line input. */
function InputGroupInput({ sx, ...props }: InputProps) {
  return (
    <Input
      data-slot="input-group-control"
      sx={[styles.control, sx]}
      {...props}
    />
  )
}

/** The group's multi-line input. */
function InputGroupTextarea({ sx, ...props }: TextareaProps) {
  return (
    <Textarea
      data-slot="input-group-control"
      sx={[styles.control, styles.textarea, sx]}
      {...props}
    />
  )
}

export {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupText,
  InputGroupInput,
  InputGroupTextarea,
}
