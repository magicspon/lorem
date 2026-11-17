import type { Meta, StoryObj } from '@storybook/tanstack-react'
import { BoldIcon, ItalicIcon } from 'lucide-react'
import { expect } from 'storybook/test'

import { Toggle } from './toggle'
import { Flex } from '#/layout/index.ts'

const meta = {
  component: Toggle,
  args: {
    variant: 'default',
    size: 'default',
    disabled: false,
    'aria-label': 'Toggle bold',
  },
  argTypes: {
    variant: { control: 'inline-radio', options: ['default', 'outline'] },
    size: { control: 'inline-radio', options: ['sm', 'default', 'lg'] },
  },
  render: (args) => (
    <Toggle {...args}>
      <BoldIcon />
    </Toggle>
  ),
} satisfies Meta<typeof Toggle>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ canvas, userEvent }) => {
    const toggle = canvas.getByRole('button', { name: 'Toggle bold' })
    await expect(toggle).toHaveAttribute('aria-pressed', 'false')

    await userEvent.click(toggle)
    await expect(toggle).toHaveAttribute('aria-pressed', 'true')
  },
}

export const Outline: Story = {
  args: { variant: 'outline' },
}

/** An icon and a label; the label names the button, so no `aria-label`. */
export const WithText: Story = {
  args: { 'aria-label': undefined },
  render: (args) => (
    <Toggle {...args}>
      <ItalicIcon data-icon="inline-start" />
      Italic
    </Toggle>
  ),
}

export const Sizes: Story = {
  render: (args) => (
    <Flex align="center" gap="2">
      {(['sm', 'default', 'lg'] as const).map((size) => (
        <Toggle key={size} {...args} size={size}>
          <BoldIcon />
        </Toggle>
      ))}
    </Flex>
  ),
}

export const Disabled: Story = {
  args: { disabled: true },
}
