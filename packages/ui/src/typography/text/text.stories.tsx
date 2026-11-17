import type { Meta, StoryObj } from '@storybook/tanstack-react'
import { expect } from 'storybook/test'

import { Text } from './text'
import { Stack } from '#/layout/index.ts'

const sizes = ['1', '2', '3', '4', '5', '6', '7', '8', '9'] as const

const meta = {
  component: Text,
  args: { children: 'The quick brown fox jumps over the lazy dog.' },
  argTypes: {
    size: { control: 'select', options: sizes },
    weight: {
      control: 'select',
      options: ['regular', 'medium', 'semibold', 'bold'],
    },
    tone: {
      control: 'select',
      options: ['default', 'strong', 'muted', 'accent', 'destructive'],
    },
    align: { control: 'select', options: ['start', 'center', 'end'] },
  },
} satisfies Meta<typeof Text>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}

/** The nine steps of the type scale. */
export const Sizes: Story = {
  render: (args) => (
    <Stack gap="3">
      {sizes.map((size) => (
        <Text key={size} {...args} size={size} render={<p />} />
      ))}
    </Stack>
  ),
}

/** `tone` picks a colour by role, so text never names a colour. */
export const Tones: Story = {
  render: (args) => (
    <Stack gap="3">
      {(['default', 'strong', 'muted', 'accent', 'destructive'] as const).map(
        (tone) => (
          <Text key={tone} {...args} tone={tone} render={<p />}>
            {tone}
          </Text>
        ),
      )}
    </Stack>
  ),
}

/** `render` swaps the `span` for a paragraph. */
export const Paragraph: Story = {
  args: { render: <p />, size: '3' },
  play: async ({ canvas }) => {
    const text = canvas.getByText(/quick brown fox/)
    await expect(text.tagName).toBe('P')
    await expect(text).toHaveAttribute('data-slot', 'text')
  },
}

/** `truncate` keeps one line and cuts it with an ellipsis. */
export const Truncate: Story = {
  args: { truncate: true, render: <p />, style: { width: 200 } },
}
