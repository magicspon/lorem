import type { Meta, StoryObj } from '@storybook/tanstack-react'

import { Blockquote } from './blockquote'

const meta = {
  component: Blockquote,
  args: {
    children:
      'Forms that ask only what they need get finished. Every extra field is a reason to leave.',
  },
} satisfies Meta<typeof Blockquote>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Large: Story = { args: { size: '5' } }
