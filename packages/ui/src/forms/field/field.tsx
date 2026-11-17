import * as React from 'react'
import * as stylex from '@stylexjs/stylex'

import { textStyles } from '#/typography/type-styles.ts'
import { List, ListItem, Stack } from '#/layout/index.ts'
import { styleProps, type WithSx } from '#/lib/sx.ts'
import { colors, motion, radii, size, space } from '../../styles/tokens.stylex'
import { shadows } from '../../styles/shadows.stylex'
import { Separator } from '#/layout/separator/index.ts'

// A field group is a size container: `responsive` fields lay out in a row
// once the group is wide enough. Unnamed, because StyleX's dev injector keeps
// only one rule per named container query.
const WIDE_GROUP = '@container (min-width: 28rem)'
// `:nth-child(n)` matches every child, with enough weight to beat a control's own width.
const CHILD = ':where(*) > :nth-child(n)'
const CHILD_LABEL = ':where(*) > [data-slot=field-label]'
const CHILD_FIELD = ':where(*) > [data-slot=field]'
const CHILD_GROUP = ':where(*) > [data-slot=field-group]'
const WITH_CONTENT = ':has(> [data-slot=field-content])'
// A checkbox or radio beside a title and description drops to the title's baseline.
const CHOICE_BESIDE_CONTENT =
  ':where(:has(> [data-slot=field-content])) > :is([role=checkbox], [role=radio])'
const LINK = ':where(*) > a'
const LINK_HOVER = ':where(*) > a:hover'
// A label wrapping a whole field is a selectable "choice card".
const CARD = ':is(:has(> [data-slot=field]))'
const CARD_HOVER =
  ':is(:has(> [data-slot=field])):not(:has(:disabled, [data-disabled])):hover'

/** How a field lays out its label and control. */
type FieldOrientation = 'vertical' | 'horizontal' | 'responsive'

// The field root carries the default marker.
const styles = stylex.create({
  // The gap depends on what the group holds, so it stays here, not in a prop.
  group: {
    containerType: 'inline-size',
    width: '100%',
    gap: {
      default: space['5'],
      ':is([data-slot=checkbox-group])': space['3'],
      [CHILD_GROUP]: space['4'],
    },
  },
  field: {
    display: 'flex',
    width: '100%',
    gap: space['3'],
    color: { default: null, ':is([data-invalid=true])': colors.destructive },
  },
  vertical: {
    flexDirection: 'column',
    width: { default: '100%', [CHILD_LABEL]: '100%' },
  },
  horizontal: {
    flexDirection: 'row',
    alignItems: { default: 'center', [WITH_CONTENT]: 'flex-start' },
    flex: { default: null, [CHILD_LABEL]: '1 1 auto' },
    marginTop: { default: null, [CHOICE_BESIDE_CONTENT]: size.px },
  },
  responsive: {
    flexDirection: { default: 'column', [WIDE_GROUP]: 'row' },
    // Stacked children are full width, so this only shows in a row.
    alignItems: { default: 'center', [WITH_CONTENT]: 'flex-start' },
    // Children fill the field when stacked, and size to content in a row. The
    // container query sets custom properties, because nested conditions
    // don't inject in dev.
    '--field-child-width': { default: '100%', [WIDE_GROUP]: 'auto' },
    '--field-label-flex': { default: '0 1 auto', [WIDE_GROUP]: '1 1 auto' },
    '--field-choice-offset': { default: '0px', [WIDE_GROUP]: '1px' },
    width: { default: '100%', [CHILD]: 'var(--field-child-width)' },
    flex: { default: null, [CHILD_LABEL]: 'var(--field-label-flex)' },
    marginTop: {
      default: null,
      [CHOICE_BESIDE_CONTENT]: 'var(--field-choice-offset)',
    },
  },
  content: { flex: 1 },
  label: {
    display: 'flex',
    alignItems: 'center',
    gap: space['2'],
    width: { default: 'fit-content', [CARD]: '100%' },
    flexDirection: { default: null, [CARD]: 'column' },
    fontWeight: 500,
    userSelect: 'none',
    opacity: {
      default: null,
      [stylex.when.ancestor(':is([data-slot=field][data-disabled=true])')]: 0.5,
    },
    borderRadius: { default: null, [CARD]: radii.xl },
    borderWidth: { default: null, [CARD]: 1 },
    borderStyle: { default: null, [CARD]: 'solid' },
    // Mutually exclusive: focus beats checked.
    borderColor: {
      default: null,
      ':is(:has(> [data-slot=field])):not(:has([data-checked], :focus-visible))':
        colors.border,
      ':is(:has(> [data-slot=field])):has([data-checked]):not(:has(:focus-visible))':
        colors.choiceCardBorder,
      ':is(:has(> [data-slot=field])):has(:focus-visible)': colors.ring,
    },
    // Mutually exclusive: hover beats checked.
    backgroundColor: {
      default: null,
      [`:has([data-checked]):not(${CARD_HOVER})`]: colors.choiceCardBackground,
      [CARD_HOVER]: colors.controlHover,
    },
    boxShadow: {
      default: null,
      ':is(:has(> [data-slot=field])):has(:focus-visible)': shadows.focusRing,
    },
    transitionProperty: 'background-color, border-color, box-shadow',
    transitionDuration: motion.normal,
    transitionTimingFunction: motion.ease,
    padding: { default: null, [CHILD_FIELD]: space['4'] },
  },
  title: {
    display: 'flex',
    width: 'fit-content',
    alignItems: 'center',
    gap: space['2'],
    fontWeight: 500,
    opacity: {
      default: null,
      [stylex.when.ancestor(':is([data-slot=field][data-disabled=true])')]: 0.5,
    },
  },
  description: {
    textAlign: 'left',
    fontWeight: 400,
    // Tucked under a legend, and against a following error.
    marginTop: {
      default: null,
      [stylex.when.siblingBefore(':is([data-variant=legend])')]:
        `-${space['1']}`,
      ':nth-last-child(2):not(:last-child)': `-${space['1']}`,
      ':last-child': 0,
    },
    textDecorationLine: { default: null, [LINK]: 'underline' },
    textUnderlineOffset: { default: null, [LINK]: 4 },
    color: {
      default: colors.mutedForeground,
      [LINK_HOVER]: colors.primaryText,
    },
  },
  separator: {
    position: 'relative',
    marginBlock: `-${space['2']}`,
    height: size['5'],
  },
  separatorLine: { position: 'absolute', inset: 0, top: '50%' },
  separatorContent: {
    position: 'relative',
    display: 'block',
    width: 'fit-content',
    marginInline: 'auto',
    paddingInline: space['2'],
    backgroundColor: colors.background,
    color: colors.mutedForeground,
  },
  error: {
    fontWeight: 400,
    color: colors.destructive,
  },
})

/** Props for `FieldGroup`. */
type FieldGroupProps = WithSx<React.ComponentProps<'div'>>

/** Stacks fields, and sizes the container that `responsive` fields respond to. */
function FieldGroup({ sx, ...props }: FieldGroupProps) {
  return <Stack data-slot="field-group" sx={[styles.group, sx]} {...props} />
}

/** Props for `Field`. */
type FieldProps = WithSx<React.ComponentProps<'div'>> & {
  /** How the label and control are laid out. @default 'vertical' */
  orientation?: FieldOrientation
}

/**
 * One control with its label, description and error. Holds no form state:
 * set `data-invalid` and `data-disabled` from your form library.
 */
function Field({ style, sx, orientation = 'vertical', ...props }: FieldProps) {
  return (
    <div
      role="group"
      data-slot="field"
      data-orientation={orientation}
      {...styleProps(
        [stylex.defaultMarker(), styles.field, styles[orientation], sx],
        style,
      )}
      {...props}
    />
  )
}

/** Props for `FieldContent`. */
type FieldContentProps = WithSx<React.ComponentProps<'div'>>

/** Stacks a title or label with its description, beside a control. */
function FieldContent({ sx, ...props }: FieldContentProps) {
  return (
    <Stack
      data-slot="field-content"
      gap="2"
      sx={[styles.content, sx]}
      {...props}
    />
  )
}

/** Props for `FieldLabel`. */
type FieldLabelProps = WithSx<React.ComponentProps<'label'>>

/**
 * The field's label; point `htmlFor` at the control. Wrap a whole `Field` in
 * it to make a selectable card.
 */
function FieldLabel({ style, sx, ...props }: FieldLabelProps) {
  return (
    <label
      data-slot="field-label"
      {...styleProps([textStyles['2'], styles.label, sx], style)}
      {...props}
    />
  )
}

/** Props for `FieldTitle`. */
type FieldTitleProps = WithSx<React.ComponentProps<'div'>>

/** A label-styled heading that is not a `label`, as inside a choice card. */
function FieldTitle({ style, sx, ...props }: FieldTitleProps) {
  return (
    <div
      data-slot="field-label"
      {...styleProps([textStyles['2'], styles.title, sx], style)}
      {...props}
    />
  )
}

/** Props for `FieldDescription`. */
type FieldDescriptionProps = WithSx<React.ComponentProps<'p'>>

/** Helper text. Link it to the control with `aria-describedby`. */
function FieldDescription({ style, sx, ...props }: FieldDescriptionProps) {
  return (
    <p
      data-slot="field-description"
      {...styleProps([textStyles['2'], styles.description, sx], style)}
      {...props}
    />
  )
}

/** Props for `FieldSeparator`. */
type FieldSeparatorProps = WithSx<React.ComponentProps<'div'>>

/** A rule between fields, with optional text such as "Or" on it. */
function FieldSeparator({
  children,
  style,
  sx,
  ...props
}: FieldSeparatorProps) {
  return (
    <div
      data-slot="field-separator"
      data-content={Boolean(children)}
      {...styleProps([textStyles['2'], styles.separator, sx], style)}
      {...props}
    >
      <Separator sx={styles.separatorLine} />
      {children && (
        <span data-slot="field-separator-content" sx={styles.separatorContent}>
          {children}
        </span>
      )}
    </div>
  )
}

/** An error with a message, as TanStack Form gives. */
type FieldErrorItem = { message?: string | undefined } | undefined

/** Props for `FieldError`. */
type FieldErrorProps = WithSx<React.ComponentProps<'div'>> & {
  /** Errors to show. Duplicate messages show once; `children` win. */
  errors?: FieldErrorItem[] | undefined
}

/** The messages in `errors`, without duplicates or blanks. */
function uniqueMessages(errors: FieldErrorItem[]) {
  const messages = errors
    .map((error) => error?.message)
    .filter((message): message is string => Boolean(message))
  return [...new Set(messages)]
}

/** One message as text, several as a list, none as null. */
function errorContent(messages: string[]) {
  if (messages.length <= 1) {
    return messages[0]
  }
  return (
    <List gap="1" marker="disc" pl="4">
      {messages.map((message) => (
        <ListItem key={message}>{message}</ListItem>
      ))}
    </List>
  )
}

/** The field's error. Renders nothing without `children` or messages. */
function FieldError({
  style,
  sx,
  children,
  errors,
  ...props
}: FieldErrorProps) {
  const content = children ?? errorContent(uniqueMessages(errors ?? []))
  if (!content) {
    return null
  }
  return (
    <div
      role="alert"
      data-slot="field-error"
      {...styleProps([textStyles['2'], styles.error, sx], style)}
      {...props}
    >
      {content}
    </div>
  )
}

export {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
  FieldTitle,
}
export type {
  FieldContentProps,
  FieldDescriptionProps,
  FieldErrorItem,
  FieldErrorProps,
  FieldGroupProps,
  FieldLabelProps,
  FieldOrientation,
  FieldProps,
  FieldSeparatorProps,
  FieldTitleProps,
}
