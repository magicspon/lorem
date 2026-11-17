import type { Meta, StoryObj } from '@storybook/tanstack-react'
import { expect } from 'storybook/test'

import * as Avatar from './index.ts'
import { Flex } from '#/layout/index.ts'

const src = 'https://github.com/shadcn.png'

const meta = {
  component: Avatar.Root,
  args: { size: 'default' },
  argTypes: {
    size: { control: 'inline-radio', options: ['sm', 'default', 'lg'] },
  },
  render: (args) => (
    <Avatar.Root {...args}>
      <Avatar.Image src={src} alt="@shadcn" />
      <Avatar.Fallback>CN</Avatar.Fallback>
    </Avatar.Root>
  ),
} satisfies Meta<typeof Avatar.Root>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}

/** No image, so the initials show. */
export const Fallback: Story = {
  render: (args) => (
    <Avatar.Root {...args}>
      <Avatar.Fallback>JD</Avatar.Fallback>
    </Avatar.Root>
  ),
}

export const Sizes: Story = {
  render: () => (
    <Flex align="center" gap="4">
      {(['sm', 'default', 'lg'] as const).map((size) => (
        <Avatar.Root key={size} size={size}>
          <Avatar.Image src={src} alt="@shadcn" />
          <Avatar.Fallback>CN</Avatar.Fallback>
        </Avatar.Root>
      ))}
    </Flex>
  ),
}

/** A status dot in the bottom-right corner. */
export const WithBadge: Story = {
  render: (args) => (
    <Avatar.Root {...args}>
      <Avatar.Image src={src} alt="@shadcn" />
      <Avatar.Fallback>CN</Avatar.Fallback>
      <Avatar.Badge />
    </Avatar.Root>
  ),
}

/** Overlapping avatars with a count of the ones not shown. */
export const Group: Story = {
  render: (args) => (
    <Avatar.Group>
      {['CN', 'JD', 'AB'].map((initials) => (
        <Avatar.Root key={initials} {...args}>
          <Avatar.Fallback>{initials}</Avatar.Fallback>
        </Avatar.Root>
      ))}
      <Avatar.GroupCount>+3</Avatar.GroupCount>
    </Avatar.Group>
  ),
}

/** A `success` badge marks someone as online, beside the default badge. */
export const Online: Story = {
  render: (args) => (
    <Flex align="center" gap="4">
      <Avatar.Root {...args}>
        <Avatar.Fallback>CN</Avatar.Fallback>
        <Avatar.Badge />
      </Avatar.Root>
      <Avatar.Root {...args}>
        <Avatar.Fallback>SC</Avatar.Fallback>
        <Avatar.Badge tone="success" />
      </Avatar.Root>
    </Flex>
  ),
  play: async ({ canvasElement }) => {
    const [primary, success] = canvasElement.querySelectorAll(
      '[data-slot="avatar-badge"]',
    )
    await expect(primary && success).toBeTruthy()
    if (primary && success)
      await expect(getComputedStyle(success).backgroundColor).not.toBe(
        getComputedStyle(primary).backgroundColor,
      )
  },
}
