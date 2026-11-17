import type { Meta, StoryObj } from '@storybook/tanstack-react'
import { expect } from 'storybook/test'

import { computed, Tile } from '#/layout/layout-stories.tsx'
import { Stack } from './stack'

const meta = {
  component: Stack,
  parameters: { layout: 'centered' },
  args: {
    gap: '2',
    children: [
      <Tile key="a">A</Tile>,
      <Tile key="b">B</Tile>,
      <Tile key="c">C</Tile>,
    ],
  },
} satisfies Meta<typeof Stack>

export default meta
type Story = StoryObj<typeof meta>

/** A column with a 0.5rem gap. */
export const Default: Story = {
  play: async ({ canvasElement }) => {
    const stack = canvasElement.querySelector('[data-slot="stack"]')
    await expect(computed(stack, 'flex-direction')).toBe('column')
    await expect(computed(stack, 'gap')).toBe('8px')
  },
}
