import type { Meta, StoryObj } from '@storybook/tanstack-react'
import { expect } from 'storybook/test'

import { VisuallyHidden } from './visually-hidden'
import { Text } from '../text/index.ts'

const meta = {
  component: VisuallyHidden,
  args: { children: 'opens in a new tab' },
} satisfies Meta<typeof VisuallyHidden>

export default meta

type Story = StoryObj<typeof meta>

/** The text is in the page for a screen reader, and takes no room. */
export const Default: Story = {
  render: (args) => (
    <Text size="2">
      Read the guide <VisuallyHidden {...args} />
    </Text>
  ),
  play: async ({ canvas }) => {
    const hidden = canvas.getByText('opens in a new tab')
    await expect(hidden).toBeInTheDocument()
    await expect(hidden.getBoundingClientRect().width).toBeLessThanOrEqual(1)
  },
}

/** As a paragraph, for a hint another element points to. */
export const AsParagraph: Story = {
  args: { render: <p />, children: 'Press Shift and an arrow key to move.' },
}
