import type { Meta, StoryObj } from '@storybook/tanstack-react'
import { SettingsIcon } from 'lucide-react'
import { expect, fn } from 'storybook/test'

import { Flex } from '#/layout/index.ts'
import { IconButton } from './icon-button'

const variants = [
  'default',
  'outline',
  'secondary',
  'ghost',
  'destructive',
  'link',
  'nav',
  'filter',
] as const

const sizes = ['xs', 'sm', 'default', 'lg'] as const

const meta = {
  component: IconButton,
  args: {
    icon: <SettingsIcon />,
    children: 'Settings',
    variant: 'default',
    size: 'default',
    disabled: false,
    onClick: fn(),
  },
  argTypes: {
    variant: { control: 'select', options: variants },
    size: { control: 'select', options: sizes },
  },
} satisfies Meta<typeof IconButton>

export default meta

type Story = StoryObj<typeof meta>

/** The children name the button but are not seen; the icon is not read. */
export const Default: Story = {
  play: async ({ args, canvas, userEvent }) => {
    const button = canvas.getByRole('button', { name: 'Settings' })
    await userEvent.click(button)
    await expect(args.onClick).toHaveBeenCalledOnce()
    // Square, at the `icon` size.
    const box = button.getBoundingClientRect()
    await expect(box.width).toBe(36)
    await expect(box.height).toBe(36)
    // The label is in the accessibility tree but takes up a pixel at most.
    const label = canvas.getByText('Settings')
    await expect(label.getBoundingClientRect().width).toBeLessThanOrEqual(1)
    await expect(
      button.querySelector('[data-slot=icon-button-icon]'),
    ).toHaveAttribute('aria-hidden', 'true')
  },
}

/** Every variant `Button` has. */
export const Variants: Story = {
  render: (args) => (
    <Flex wrap="wrap" align="center" gap="2">
      {variants.map((variant) => (
        <IconButton key={variant} {...args} variant={variant}>
          {`Settings (${variant})`}
        </IconButton>
      ))}
    </Flex>
  ),
}

/** Each size is a square. */
export const Sizes: Story = {
  render: (args) => (
    <Flex align="center" gap="2">
      {sizes.map((size) => (
        <IconButton key={size} {...args} size={size}>
          {`Settings (${size})`}
        </IconButton>
      ))}
    </Flex>
  ),
  play: async ({ canvas }) => {
    for (const [size, px] of [
      ['xs', 24],
      ['sm', 32],
      ['default', 36],
      ['lg', 40],
    ] as const) {
      const box = canvas
        .getByRole('button', { name: `Settings (${size})` })
        .getBoundingClientRect()
      await expect(box.width).toBe(px)
      await expect(box.height).toBe(px)
    }
  },
}

/** Disabled, it cannot be pressed. */
export const Disabled: Story = {
  args: { disabled: true },
  play: async ({ canvas }) => {
    await expect(
      canvas.getByRole('button', { name: 'Settings' }),
    ).toBeDisabled()
  },
}

/** Loading, from `Button`: a spinner over the icon, and still named. */
export const Loading: Story = {
  args: { loading: true },
  play: async ({ canvas }) => {
    const button = canvas.getByRole('button', { name: 'Settings' })
    await expect(button).toHaveAttribute('aria-busy', 'true')
    // `Button` keeps a loading button focusable, so it is disabled by ARIA.
    await expect(button).toHaveAttribute('aria-disabled', 'true')
  },
}
