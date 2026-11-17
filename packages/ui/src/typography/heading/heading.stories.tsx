import type { Meta, StoryObj } from '@storybook/tanstack-react'
import { expect } from 'storybook/test'

import { Heading } from './heading'
import { Stack } from '#/layout/index.ts'

const meta = {
  component: Heading,
  args: { children: 'Customer feedback' },
  argTypes: {
    level: { control: 'select', options: [1, 2, 3, 4, 5, 6] },
    size: {
      control: 'select',
      options: ['1', '2', '3', '4', '5', '6', '7', '8', '9'],
    },
  },
} satisfies Meta<typeof Heading>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}

/** Each level with the size it gets when none is given. */
export const Levels: Story = {
  render: (args) => (
    <Stack gap="3">
      {([1, 2, 3, 4, 5, 6] as const).map((level) => (
        <Heading key={level} {...args} level={level}>
          Heading {level}
        </Heading>
      ))}
    </Stack>
  ),
}

/** `size` sets the look apart from the level, which sets the element. */
export const LevelApartFromSize: Story = {
  args: { level: 1, size: '4' },
  play: async ({ canvas }) => {
    const heading = canvas.getByRole('heading', { level: 1 })
    await expect(heading).toHaveAttribute('data-slot', 'heading')
  },
}
