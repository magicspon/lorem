import * as React from 'react'
import { Menu as MenuPrimitive } from '@base-ui/react/menu'
import * as stylex from '@stylexjs/stylex'
import { ChevronRightIcon, CheckIcon } from 'lucide-react'

import { textStyles } from '#/typography/type-styles.ts'
import { styleProps, type WithSx } from '#/lib/sx.ts'
import { animations } from '#/styles/animations.ts'
import { menu, popup } from '#/styles/shared.ts'
import { colors, size, space } from '../../styles/tokens.stylex'
import { shadows } from '../../styles/shadows.stylex'

const FOCUSED = ':is(:focus, [data-highlighted])'

// Items carry the default marker, so a shortcut follows its item's focus.
const styles = stylex.create({
  content: {
    zIndex: 50,
    maxHeight: 'var(--available-height)',
    width: 'var(--anchor-width)',
    minWidth: size['48'],
    overflowX: 'hidden',
    overflowY: { default: 'auto', ':is([data-closed])': 'hidden' },
    padding: space['1'],
    boxShadow: shadows.menu,
  },
  // A menu with a heading or shortcuts, which the trigger's width would crowd.
  wide: { minWidth: size['56'] },
  subContent: {
    width: 'auto',
    minWidth: size['36'],
    boxShadow: shadows.popup,
  },
  destructive: {
    backgroundColor: {
      default: null,
      [`${FOCUSED}:not(:active)`]: colors.destructiveSubtle,
      ':active': colors.destructiveSubtlePressed,
    },
    color: colors.destructive,
  },
  subTrigger: {
    gap: space['2'],
    backgroundColor: {
      default: null,
      ':is(:focus, [data-highlighted], [data-popup-open], [data-open])':
        colors.accent,
    },
    color: {
      default: null,
      ':is(:focus, [data-highlighted], [data-popup-open], [data-open])':
        colors.accentForeground,
    },
  },
  chevron: { marginLeft: 'auto' },
  indicator: {
    pointerEvents: 'none',
    position: 'absolute',
    right: size['2'],
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  shortcut: {
    marginLeft: 'auto',
    letterSpacing: '0.1em',
    color: {
      default: colors.mutedForeground,
      [stylex.when.ancestor(':is(:focus, [data-highlighted])')]:
        colors.accentForeground,
    },
  },
})

/** Root of a dropdown menu. Holds the open state. */
function DropdownMenu({ ...props }: MenuPrimitive.Root.Props) {
  return <MenuPrimitive.Root data-slot="dropdown-menu" {...props} />
}

/** Moves the menu into `document.body`. */
function DropdownMenuPortal({ ...props }: MenuPrimitive.Portal.Props) {
  return <MenuPrimitive.Portal data-slot="dropdown-menu-portal" {...props} />
}

/** Opens the menu. */
function DropdownMenuTrigger({ ...props }: MenuPrimitive.Trigger.Props) {
  return <MenuPrimitive.Trigger data-slot="dropdown-menu-trigger" {...props} />
}

/** The floating menu panel. */
function DropdownMenuContent({
  align = 'start',
  alignOffset = 0,
  side = 'bottom',
  sideOffset = 4,
  size = 'default',
  style,
  sx,
  ...props
}: WithSx<MenuPrimitive.Popup.Props> &
  Pick<
    MenuPrimitive.Positioner.Props,
    'align' | 'alignOffset' | 'side' | 'sideOffset'
  > & { size?: 'default' | 'wide' }) {
  return (
    <MenuPrimitive.Portal>
      <MenuPrimitive.Positioner
        {...stylex.props(popup.positioner)}
        align={align}
        alignOffset={alignOffset}
        side={side}
        sideOffset={sideOffset}
      >
        <MenuPrimitive.Popup
          data-slot="dropdown-menu-content"
          {...styleProps(
            [
              popup.surface,
              animations.popup,
              styles.content,
              size === 'wide' && styles.wide,
              sx,
            ],
            style,
          )}
          {...props}
        />
      </MenuPrimitive.Positioner>
    </MenuPrimitive.Portal>
  )
}

/** Groups related items. */
function DropdownMenuGroup({ ...props }: MenuPrimitive.Group.Props) {
  return <MenuPrimitive.Group data-slot="dropdown-menu-group" {...props} />
}

/** A group's heading. */
function DropdownMenuLabel({
  style,
  sx,
  inset,
  ...props
}: WithSx<MenuPrimitive.GroupLabel.Props> & {
  inset?: boolean
}) {
  return (
    <MenuPrimitive.GroupLabel
      data-slot="dropdown-menu-label"
      data-inset={inset}
      {...styleProps(
        [textStyles['1'], menu.label, inset && menu.inset, sx],
        style,
      )}
      {...props}
    />
  )
}

/** A menu action. */
function DropdownMenuItem({
  style,
  sx,
  inset,
  variant = 'default',
  ...props
}: WithSx<MenuPrimitive.Item.Props> & {
  inset?: boolean
  variant?: 'default' | 'destructive'
}) {
  return (
    <MenuPrimitive.Item
      data-slot="dropdown-menu-item"
      data-inset={inset}
      data-variant={variant}
      {...styleProps(
        [
          stylex.defaultMarker(),
          textStyles['2'],
          menu.item,
          inset && menu.inset,
          variant === 'destructive' && styles.destructive,
          sx,
        ],
        style,
      )}
      {...props}
    />
  )
}

/** Root of a submenu. */
function DropdownMenuSub({ ...props }: MenuPrimitive.SubmenuRoot.Props) {
  return <MenuPrimitive.SubmenuRoot data-slot="dropdown-menu-sub" {...props} />
}

/** An item that opens a submenu, with a trailing chevron. */
function DropdownMenuSubTrigger({
  style,
  sx,
  inset,
  children,
  ...props
}: WithSx<MenuPrimitive.SubmenuTrigger.Props> & {
  inset?: boolean
}) {
  return (
    <MenuPrimitive.SubmenuTrigger
      data-slot="dropdown-menu-sub-trigger"
      data-inset={inset}
      {...styleProps(
        [
          textStyles['2'],
          menu.item,
          styles.subTrigger,
          inset && menu.inset,
          sx,
        ],
        style,
      )}
      {...props}
    >
      {children}
      <ChevronRightIcon {...stylex.props(styles.chevron)} />
    </MenuPrimitive.SubmenuTrigger>
  )
}

/** The submenu panel, opening to the side. */
function DropdownMenuSubContent({
  align = 'start',
  alignOffset = -3,
  side = 'right',
  sideOffset = 0,
  sx,
  ...props
}: React.ComponentProps<typeof DropdownMenuContent>) {
  return (
    <DropdownMenuContent
      data-slot="dropdown-menu-sub-content"
      sx={[styles.subContent, sx]}
      align={align}
      alignOffset={alignOffset}
      side={side}
      sideOffset={sideOffset}
      {...props}
    />
  )
}

/** A checkable item, with a check mark when on. */
function DropdownMenuCheckboxItem({
  style,
  sx,
  children,
  checked,
  inset,
  ...props
}: WithSx<MenuPrimitive.CheckboxItem.Props> & {
  inset?: boolean
}) {
  return (
    <MenuPrimitive.CheckboxItem
      data-slot="dropdown-menu-checkbox-item"
      data-inset={inset}
      {...styleProps(
        [
          textStyles['2'],
          menu.item,
          menu.withIndicator,
          inset && menu.inset,
          sx,
        ],
        style,
      )}
      checked={checked}
      {...props}
    >
      <span
        sx={styles.indicator}
        data-slot="dropdown-menu-checkbox-item-indicator"
      >
        <MenuPrimitive.CheckboxItemIndicator>
          <CheckIcon />
        </MenuPrimitive.CheckboxItemIndicator>
      </span>
      {children}
    </MenuPrimitive.CheckboxItem>
  )
}

/** Holds radio items with one value. */
function DropdownMenuRadioGroup({ ...props }: MenuPrimitive.RadioGroup.Props) {
  return (
    <MenuPrimitive.RadioGroup
      data-slot="dropdown-menu-radio-group"
      {...props}
    />
  )
}

/** A radio item, with a check mark when selected. */
function DropdownMenuRadioItem({
  style,
  sx,
  children,
  inset,
  ...props
}: WithSx<MenuPrimitive.RadioItem.Props> & {
  inset?: boolean
}) {
  return (
    <MenuPrimitive.RadioItem
      data-slot="dropdown-menu-radio-item"
      data-inset={inset}
      {...styleProps(
        [
          textStyles['2'],
          menu.item,
          menu.withIndicator,
          inset && menu.inset,
          sx,
        ],
        style,
      )}
      {...props}
    >
      <span
        sx={styles.indicator}
        data-slot="dropdown-menu-radio-item-indicator"
      >
        <MenuPrimitive.RadioItemIndicator>
          <CheckIcon />
        </MenuPrimitive.RadioItemIndicator>
      </span>
      {children}
    </MenuPrimitive.RadioItem>
  )
}

/** A line between groups. */
function DropdownMenuSeparator({
  style,
  sx,
  ...props
}: WithSx<MenuPrimitive.Separator.Props>) {
  return (
    <MenuPrimitive.Separator
      data-slot="dropdown-menu-separator"
      {...styleProps([menu.separator, sx], style)}
      {...props}
    />
  )
}

/** A keyboard shortcut hint at the end of an item. */
function DropdownMenuShortcut({
  style,
  sx,
  ...props
}: WithSx<React.ComponentProps<'span'>>) {
  return (
    <span
      data-slot="dropdown-menu-shortcut"
      {...styleProps([textStyles['1'], styles.shortcut, sx], style)}
      {...props}
    />
  )
}

export {
  DropdownMenu,
  DropdownMenuPortal,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
}
