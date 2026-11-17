import type { Meta, StoryObj } from '@storybook/tanstack-react'
import { expect } from 'storybook/test'

import { Container } from './container'
import { computed, Tile } from '#/layout/layout-stories.tsx'

const meta = {
  component: Container,
  args: { size: '1', px: '4', children: <Tile>Container</Tile> },
  argTypes: {
    size: { control: 'inline-radio', options: ['1', '2', '3', '4'] },
  },
} satisfies Meta<typeof Container>

export default meta
type Story = StoryObj<typeof meta>

/** Size 1 caps the width at 28rem and centres it. */
export const Default: Story = {
  play: async ({ canvasElement }) => {
    const container = canvasElement.querySelector('[data-slot="container"]')
    await expect(computed(container, 'max-width')).toBe('448px')
    await expect(computed(container, 'padding-left')).toBe('16px')
  },
}
