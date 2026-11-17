import * as React from 'react'
import { Select as SelectPrimitive } from '@base-ui/react/select'
import * as stylex from '@stylexjs/stylex'
import { ChevronDownIcon, CheckIcon, ChevronUpIcon } from 'lucide-react'

import { textStyles } from '#/typography/type-styles.ts'
import { styleProps, type WithSx } from '#/lib/sx.ts'
import { animations } from '#/styles/animations.ts'
import { field, menu, popup } from '#/styles/shared.ts'
import { colors, size, space } from '../../styles/tokens.stylex'

const SVG = ':where(*) svg'
const LAST_SPAN = ':where(*) > span:last-child'

const styles = stylex.create({
  group: { scrollMarginBlock: space['1'], padding: space['1'] },
  value: {
    display: 'flex',
    flex: 1,
    alignItems: 'center',
    gap: space['1'],
    overflow: 'hidden',
    textAlign: 'left',
  },
  trigger: {
    display: 'flex',
    width: { default: 'fit-content', [SVG]: size['4'] },
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: space['1'],
    paddingBlock: space['2'],
    whiteSpace: 'nowrap',
    color: { default: null, ':is([data-placeholder])': colors.mutedForeground },
    backgroundColor: {
      default: colors.controlBackground,
      ':hover:not([data-popup-open])': colors.controlHover,
      ':is([data-popup-open])': colors.controlPressed,
    },
    pointerEvents: { default: null, [SVG]: 'none' },
    flexShrink: { default: null, [SVG]: 0 },
  },
  triggerDefault: { height: { default: size['9'], [SVG]: size['4'] } },
  triggerSm: { height: { default: size['8'], [SVG]: size['4'] } },
  icon: {
    pointerEvents: 'none',
    width: size['4'],
    height: size['4'],
    color: colors.mutedForeground,
  },
  popup: {
    position: 'relative',
    isolation: 'isolate',
    zIndex: 50,
    maxHeight: 'var(--available-height)',
    width: 'var(--anchor-width)',
    minWidth: size['36'],
    overflowX: 'hidden',
    overflowY: 'auto',
  },
  item: {
    display: { default: 'flex', [LAST_SPAN]: 'flex' },
    alignItems: { default: 'center', [LAST_SPAN]: 'center' },
    gap: { default: space['2'], [LAST_SPAN]: space['2'] },
  },
  itemText: {
    display: 'flex',
    flex: 1,
    flexShrink: 0,
    gap: space['2'],
    whiteSpace: 'nowrap',
  },
  noPointer: { pointerEvents: 'none' },
  scrollArrow: {
    top: 0,
    zIndex: 10,
    display: 'flex',
    width: { default: '100%', [SVG]: size['4'] },
    height: { default: null, [SVG]: size['4'] },
    cursor: 'default',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.popover,
    paddingBlock: space['1'],
  },
  scrollDown: { top: 'auto', bottom: 0 },
})

const Select = SelectPrimitive.Root

/** Groups related options under a label. */
function SelectGroup({
  style,
  sx,
  ...props
}: WithSx<SelectPrimitive.Group.Props>) {
  return (
    <SelectPrimitive.Group
      data-slot="select-group"
      {...styleProps([styles.group, sx], style)}
      {...props}
    />
  )
}

/** Shows the selected option, or the placeholder. */
function SelectValue({
  style,
  sx,
  ...props
}: WithSx<SelectPrimitive.Value.Props>) {
  return (
    <SelectPrimitive.Value
      data-slot="select-value"
      {...styleProps([styles.value, sx], style)}
      {...props}
    />
  )
}

/** The button that opens the list, with a chevron after its children. */
function SelectTrigger({
  style,
  sx,
  size = 'default',
  variant = 'control',
  children,
  ...props
}: WithSx<SelectPrimitive.Trigger.Props> & {
  size?: 'sm' | 'default'
  /**
   * `bare` drops the control's box and chevron, so something that already
   * shows the value, such as a chip, opens the list without changing size.
   */
  variant?: 'control' | 'bare'
}) {
  if (variant === 'bare') {
    return (
      <SelectPrimitive.Trigger
        data-slot="select-trigger"
        {...styleProps([sx], style)}
        {...props}
      >
        {children}
      </SelectPrimitive.Trigger>
    )
  }
  return (
    <SelectPrimitive.Trigger
      data-slot="select-trigger"
      data-size={size}
      {...styleProps(
        [
          textStyles.control,
          field.control,
          textStyles['2'],
          styles.trigger,
          size === 'sm' ? styles.triggerSm : styles.triggerDefault,
          sx,
        ],
        style,
      )}
      {...props}
    >
      {children}
      <SelectPrimitive.Icon
        render={<ChevronDownIcon {...stylex.props(styles.icon)} />}
      />
    </SelectPrimitive.Trigger>
  )
}

/** The floating list panel. */
function SelectContent({
  style,
  sx,
  children,
  side = 'bottom',
  sideOffset = 4,
  align = 'center',
  alignOffset = 0,
  alignItemWithTrigger = true,
  ...props
}: WithSx<SelectPrimitive.Popup.Props> &
  Pick<
    SelectPrimitive.Positioner.Props,
    'align' | 'alignOffset' | 'side' | 'sideOffset' | 'alignItemWithTrigger'
  >) {
  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Positioner
        side={side}
        sideOffset={sideOffset}
        align={align}
        alignOffset={alignOffset}
        alignItemWithTrigger={alignItemWithTrigger}
        {...stylex.props(popup.positioner)}
      >
        <SelectPrimitive.Popup
          data-slot="select-content"
          data-align-trigger={alignItemWithTrigger}
          {...styleProps(
            [
              popup.surface,
              // A list aligned over its trigger appears in place.
              !alignItemWithTrigger && animations.popup,
              styles.popup,
              sx,
            ],
            style,
          )}
          {...props}
        >
          <SelectScrollUpButton />
          <SelectPrimitive.List>{children}</SelectPrimitive.List>
          <SelectScrollDownButton />
        </SelectPrimitive.Popup>
      </SelectPrimitive.Positioner>
    </SelectPrimitive.Portal>
  )
}

/** A group's heading. */
function SelectLabel({
  style,
  sx,
  ...props
}: WithSx<SelectPrimitive.GroupLabel.Props>) {
  return (
    <SelectPrimitive.GroupLabel
      data-slot="select-label"
      {...styleProps([textStyles['1'], menu.label, sx], style)}
      {...props}
    />
  )
}

/** An option, with a check mark when selected. */
function SelectItem({
  style,
  sx,
  children,
  ...props
}: WithSx<SelectPrimitive.Item.Props>) {
  return (
    <SelectPrimitive.Item
      data-slot="select-item"
      {...styleProps(
        [
          textStyles['2'],
          menu.item,
          menu.fullWidth,
          menu.withIndicator,
          styles.item,
          sx,
        ],
        style,
      )}
      {...props}
    >
      <SelectPrimitive.ItemText {...stylex.props(styles.itemText)}>
        {children}
      </SelectPrimitive.ItemText>
      <SelectPrimitive.ItemIndicator render={<span sx={menu.indicator} />}>
        <CheckIcon {...stylex.props(styles.noPointer)} />
      </SelectPrimitive.ItemIndicator>
    </SelectPrimitive.Item>
  )
}

/** A line between groups. */
function SelectSeparator({
  style,
  sx,
  ...props
}: WithSx<SelectPrimitive.Separator.Props>) {
  return (
    <SelectPrimitive.Separator
      data-slot="select-separator"
      {...styleProps([menu.separator, styles.noPointer, sx], style)}
      {...props}
    />
  )
}

/** Scrolls the list up while hovered. */
function SelectScrollUpButton({
  style,
  sx,
  ...props
}: WithSx<React.ComponentProps<typeof SelectPrimitive.ScrollUpArrow>>) {
  return (
    <SelectPrimitive.ScrollUpArrow
      data-slot="select-scroll-up-button"
      {...styleProps([styles.scrollArrow, sx], style)}
      {...props}
    >
      <ChevronUpIcon />
    </SelectPrimitive.ScrollUpArrow>
  )
}

/** Scrolls the list down while hovered. */
function SelectScrollDownButton({
  style,
  sx,
  ...props
}: WithSx<React.ComponentProps<typeof SelectPrimitive.ScrollDownArrow>>) {
  return (
    <SelectPrimitive.ScrollDownArrow
      data-slot="select-scroll-down-button"
      {...styleProps([styles.scrollArrow, styles.scrollDown, sx], style)}
      {...props}
    >
      <ChevronDownIcon />
    </SelectPrimitive.ScrollDownArrow>
  )
}

export {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectScrollDownButton,
  SelectScrollUpButton,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
}
