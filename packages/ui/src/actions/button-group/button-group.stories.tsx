import type { Meta, StoryObj } from '@storybook/tanstack-react'
import { ChevronDownIcon, RedoIcon, UndoIcon } from 'lucide-react'
import { expect } from 'storybook/test'

import { Button } from '#/actions/button/index.ts'
import * as ButtonGroup from './index.ts'

const meta = {
  component: ButtonGroup.Root,
  args: { orientation: 'horizontal' },
  argTypes: {
    orientation: {
      control: 'inline-radio',
      options: ['horizontal', 'vertical'],
    },
  },
  render: (args) => (
    <ButtonGroup.Root {...args}>
      <Button variant="outline">One</Button>
      <Button variant="outline">Two</Button>
      <Button variant="outline">Three</Button>
    </ButtonGroup.Root>
  ),
} satisfies Meta<typeof ButtonGroup.Root>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ canvas }) => {
    const group = canvas.getByRole('group')
    await expect(group).toHaveAttribute('data-orientation', 'horizontal')
    await expect(canvas.getAllByRole('button')).toHaveLength(3)
  },
}

export const Vertical: Story = {
  args: { orientation: 'vertical' },
}

/** Fixed text joined to the buttons. */
export const WithText: Story = {
  render: (args) => (
    <ButtonGroup.Root {...args}>
      <ButtonGroup.Text>https://</ButtonGroup.Text>
      <Button variant="outline">example.com</Button>
    </ButtonGroup.Root>
  ),
}

/** A separator splits the group where the shared border was removed. */
export const WithSeparator: Story = {
  render: (args) => (
    <ButtonGroup.Root {...args}>
      <Button variant="outline" aria-label="Undo">
        <UndoIcon />
      </Button>
      <ButtonGroup.Separator />
      <Button variant="outline" aria-label="Redo">
        <RedoIcon />
      </Button>
    </ButtonGroup.Root>
  ),
}

/** Nested groups are spaced rather than joined. */
export const Nested: Story = {
  render: (args) => (
    <ButtonGroup.Root {...args}>
      <ButtonGroup.Root>
        <Button variant="outline">Copy</Button>
        <Button variant="outline">Paste</Button>
      </ButtonGroup.Root>
      <ButtonGroup.Root>
        <Button variant="outline" aria-label="More">
          <ChevronDownIcon />
        </Button>
      </ButtonGroup.Root>
    </ButtonGroup.Root>
  ),
}
