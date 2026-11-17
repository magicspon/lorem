import type { Meta, StoryObj } from '@storybook/tanstack-react'
import {
  CalendarIcon,
  LayoutDashboardIcon,
  ListFilterIcon,
  SettingsIcon,
} from 'lucide-react'
import { expect, fn } from 'storybook/test'

import { Button, buttonStyles } from './button'
import * as Avatar from '#/data-display/avatar/index.ts'
import { Dot } from '#/data-display/dot/index.ts'
import { Box, Flex } from '#/layout/index.ts'
import { width } from '#/styles/sizing.ts'

const variants = [
  'default',
  'outline',
  'secondary',
  'ghost',
  'destructive',
  'link',
  'nav',
] as const

const sizes = ['xs', 'sm', 'default', 'lg'] as const

const meta = {
  component: Button,
  args: {
    children: 'Button',
    variant: 'default',
    size: 'default',
    disabled: false,
    onClick: fn(),
  },
  argTypes: {
    variant: { control: 'select', options: variants },
    size: {
      control: 'select',
      options: [...sizes, 'icon', 'icon-xs', 'icon-sm', 'icon-lg', 'avatar'],
    },
  },
} satisfies Meta<typeof Button>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ args, canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'Button' }))
    await expect(args.onClick).toHaveBeenCalledOnce()
  },
}

export const Variants: Story = {
  render: (args) => (
    <Flex wrap="wrap" align="center" gap="2">
      {variants.map((variant) => (
        <Button key={variant} {...args} variant={variant}>
          {variant}
        </Button>
      ))}
    </Flex>
  ),
}

export const Sizes: Story = {
  render: (args) => (
    <Flex wrap="wrap" align="center" gap="2">
      {sizes.map((size) => (
        <Button key={size} {...args} size={size}>
          {size}
        </Button>
      ))}
    </Flex>
  ),
}

export const Disabled: Story = {
  args: { disabled: true },
}

/** `nav` is for a list of pages: the current one keeps a fill. */
export const Nav: Story = {
  render: () => (
    <Flex direction="column" gap="1" style={{ width: 200 }}>
      <a
        href="#profile"
        aria-current="page"
        sx={buttonStyles({ variant: 'nav' })}
      >
        Profile
      </a>
      <a href="#account" sx={buttonStyles({ variant: 'nav' })}>
        Account
      </a>
    </Flex>
  ),
}

/** `dock` is `nav` for a row of page icons: each icon sits centred. */
export const Dock: Story = {
  render: () => (
    <Flex gap="1">
      <a
        href="#forms"
        aria-current="page"
        aria-label="Forms"
        sx={buttonStyles({ variant: 'dock', size: 'icon-sm' })}
      >
        <LayoutDashboardIcon />
      </a>
      <a
        href="#settings"
        aria-label="Settings"
        sx={buttonStyles({ variant: 'dock', size: 'icon-sm' })}
      >
        <SettingsIcon />
      </a>
    </Flex>
  ),
}

/** `field` opens a picker and shows its value, set out like a text input. */
export const Field: Story = {
  render: () => (
    <Box sx={width['72']}>
      <Button variant="field">
        <CalendarIcon data-icon="inline-start" />
        June 1, 2026
      </Button>
    </Box>
  ),
  play: async ({ canvas }) => {
    const button = canvas.getByRole('button', { name: 'June 1, 2026' })
    await expect(getComputedStyle(button).justifyContent).toBe('flex-start')
    await expect(button.getBoundingClientRect().width).toBe(288)
  },
}

/** `filter` is muted until `data-active` marks its filter as set. */
export const Filter: Story = {
  render: () => (
    <Flex align="center" gap="2">
      <Button variant="filter" size="icon-xs" aria-label="Filter status">
        <ListFilterIcon />
      </Button>
      <Button
        variant="filter"
        size="icon-xs"
        aria-label="Filter amount"
        data-active
      >
        <ListFilterIcon />
        <Dot placement="corner" />
      </Button>
    </Flex>
  ),
  play: async ({ canvas }) => {
    const idle = canvas.getByRole('button', { name: 'Filter status' })
    const active = canvas.getByRole('button', { name: 'Filter amount' })
    await expect(getComputedStyle(active).color).not.toBe(
      getComputedStyle(idle).color,
    )
  },
}

/** `avatar` is tight at the avatar's side, for an account button. */
export const AvatarSize: Story = {
  render: () => (
    <Button variant="ghost" size="avatar">
      <Avatar.Root size="sm">
        <Avatar.Fallback>SC</Avatar.Fallback>
      </Avatar.Root>
      Sam Carter
    </Button>
  ),
  play: async ({ canvas }) => {
    const button = canvas.getByRole('button', { name: /Sam Carter/ })
    await expect(getComputedStyle(button).paddingLeft).toBe('4px')
  },
}

/**
 * `loading` swaps the label for a centred spinner. The label stays, hidden, so
 * the button keeps its size and its name, and clicks are blocked.
 */
export const Loading: Story = {
  render: (args) => (
    <Flex wrap="wrap" align="center" gap="2">
      {sizes.map((size) => (
        <Button key={size} {...args} size={size}>
          Save changes
        </Button>
      ))}
      {sizes.map((size) => (
        <Button key={`${size}-loading`} {...args} size={size} loading>
          Save changes
        </Button>
      ))}
    </Flex>
  ),
  play: async ({ args, canvas, userEvent }) => {
    const buttons = canvas.getAllByRole('button', { name: 'Save changes' })
    const idle = buttons.slice(0, sizes.length)
    const busy = buttons.slice(sizes.length)
    for (const [index, button] of busy.entries()) {
      const match = idle[index]
      if (!match) throw new Error('missing idle button')
      const a = button.getBoundingClientRect()
      const b = match.getBoundingClientRect()
      await expect([a.width, a.height]).toEqual([b.width, b.height])
      await expect(button).toHaveAttribute('aria-busy', 'true')
      await expect(
        button.querySelector('[data-slot=button-spinner] svg'),
      ).not.toBeNull()
    }
    const first = busy[0]
    if (!first) throw new Error('missing loading button')
    // The pointer is already blocked by `pointer-events`; check the keyboard.
    first.focus()
    await expect(first).toHaveFocus()
    await userEvent.keyboard('{Enter}')
    await expect(args.onClick).not.toHaveBeenCalled()
  },
}
