import type { Meta, StoryObj } from '@storybook/tanstack-react'
import {
  AlignCenterIcon,
  AlignLeftIcon,
  AlignRightIcon,
  BoldIcon,
  ItalicIcon,
  UnderlineIcon,
} from 'lucide-react'
import { expect } from 'storybook/test'

import * as ToggleGroup from './index.ts'

const meta = {
  component: ToggleGroup.Root,
  args: {
    multiple: true,
    variant: 'default',
    size: 'default',
    spacing: '2',
    orientation: 'horizontal',
    'aria-label': 'Text formatting',
  },
  argTypes: {
    variant: { control: 'inline-radio', options: ['default', 'outline'] },
    size: { control: 'inline-radio', options: ['sm', 'default', 'lg'] },
    orientation: {
      control: 'inline-radio',
      options: ['horizontal', 'vertical'],
    },
  },
  render: (args) => (
    <ToggleGroup.Root {...args}>
      <ToggleGroup.Item value="bold" aria-label="Toggle bold">
        <BoldIcon />
      </ToggleGroup.Item>
      <ToggleGroup.Item value="italic" aria-label="Toggle italic">
        <ItalicIcon />
      </ToggleGroup.Item>
      <ToggleGroup.Item value="underline" aria-label="Toggle underline">
        <UnderlineIcon />
      </ToggleGroup.Item>
    </ToggleGroup.Root>
  ),
} satisfies Meta<typeof ToggleGroup.Root>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ canvas, userEvent }) => {
    const bold = canvas.getByRole('button', { name: 'Toggle bold' })
    const italic = canvas.getByRole('button', { name: 'Toggle italic' })

    await userEvent.click(bold)
    await userEvent.click(italic)
    // `multiple`: pressing one item leaves the others pressed.
    await expect(bold).toHaveAttribute('aria-pressed', 'true')
    await expect(italic).toHaveAttribute('aria-pressed', 'true')
  },
}

export const Outline: Story = {
  args: { variant: 'outline' },
}

/** `spacing="0"` joins the items into one segmented control. */
export const Segmented: Story = {
  args: { variant: 'outline', spacing: '0' },
}

export const Vertical: Story = {
  args: { orientation: 'vertical' },
}

/** Only one item can be pressed at a time. */
export const Single: Story = {
  args: {
    multiple: false,
    defaultValue: ['left'],
    'aria-label': 'Text alignment',
  },
  render: (args) => (
    <ToggleGroup.Root {...args}>
      <ToggleGroup.Item value="left" aria-label="Align left">
        <AlignLeftIcon />
      </ToggleGroup.Item>
      <ToggleGroup.Item value="center" aria-label="Align centre">
        <AlignCenterIcon />
      </ToggleGroup.Item>
      <ToggleGroup.Item value="right" aria-label="Align right">
        <AlignRightIcon />
      </ToggleGroup.Item>
    </ToggleGroup.Root>
  ),
}
