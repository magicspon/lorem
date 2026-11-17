import type { Meta, StoryObj } from '@storybook/tanstack-react'

import { Kbd } from './kbd'
import { Text } from '../text/index.ts'

const meta = {
  component: Kbd,
  args: { children: 'K' },
} satisfies Meta<typeof Kbd>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}

/** A combination, inside a sentence. */
export const InText: Story = {
  render: (args) => (
    <Text size="2" tone="muted">
      Press <Kbd>⌘</Kbd> <Kbd {...args} /> to search.
    </Text>
  ),
}
