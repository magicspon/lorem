import type { Meta, StoryObj } from '@storybook/tanstack-react'
import { expect } from 'storybook/test'

import { Skeleton } from './skeleton'
import { Flex, Stack } from '#/layout/index.ts'
import { width } from '#/styles/sizing.ts'

const meta = {
  component: Skeleton,
  args: { variant: 'text' },
  argTypes: {
    variant: {
      control: 'select',
      options: ['heading', 'text', 'avatar', 'block'],
    },
  },
} satisfies Meta<typeof Skeleton>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}

/** Placeholder for an avatar with two lines of text. */
export const Profile: Story = {
  render: () => (
    <Flex align="center" gap="4" sx={width['72']}>
      <Skeleton variant="avatar" />
      <Stack gap="2" grow>
        <Skeleton variant="text" />
        <Skeleton variant="text" />
      </Stack>
    </Flex>
  ),
}

/** Placeholder for a card with an image. */
export const Card: Story = {
  render: () => (
    <Stack gap="3" sx={width['72']}>
      <Skeleton variant="block" />
      <Skeleton variant="heading" />
      <Skeleton variant="text" />
      <Skeleton variant="text" />
    </Stack>
  ),
}

/** Every shape, each labelled. */
export const Variants: Story = {
  render: () => (
    <Stack gap="4" sx={width['72']}>
      <Skeleton variant="heading" data-testid="heading" />
      <Stack gap="2">
        <Skeleton variant="text" />
        <Skeleton variant="text" data-testid="last-line" />
      </Stack>
      <Skeleton variant="avatar" />
      <Skeleton variant="block" />
    </Stack>
  ),
  play: async ({ canvas }) => {
    const heading = canvas.getByTestId('heading')
    await expect(getComputedStyle(heading).height).toBe('20px')
    // The last of several lines is shorter than the first.
    const line = canvas.getByTestId('last-line')
    const first = line.previousElementSibling
    await expect(first).not.toBeNull()
    if (first)
      await expect(line.getBoundingClientRect().width).toBeLessThan(
        first.getBoundingClientRect().width,
      )
  },
}
