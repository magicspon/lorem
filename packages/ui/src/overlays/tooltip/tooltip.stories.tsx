import type { Meta, StoryObj } from '@storybook/tanstack-react'
import { expect, screen, waitFor } from 'storybook/test'

import { Button } from '#/actions/button/index.ts'
import * as Tooltip from './index.ts'
import { Flex } from '#/layout/index.ts'

const meta = {
  component: Tooltip.Root,
  parameters: { layout: 'centered' },
  // The provider's default: no delay.
  decorators: [
    (Story) => (
      <Tooltip.Provider>
        <Story />
      </Tooltip.Provider>
    ),
  ],
  render: (args) => (
    <Tooltip.Root {...args}>
      <Tooltip.Trigger render={<Button variant="outline" />}>
        Hover
      </Tooltip.Trigger>
      <Tooltip.Content>Add to library</Tooltip.Content>
    </Tooltip.Root>
  ),
} satisfies Meta<typeof Tooltip.Root>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ canvas, userEvent }) => {
    await userEvent.hover(canvas.getByRole('button', { name: 'Hover' }))

    // The tooltip is portalled to `document.body`, outside the story canvas,
    // and fades in from opacity 0.
    const tooltip = await screen.findByText('Add to library')
    await waitFor(() => expect(tooltip).toBeVisible())
  },
}

/** Starts open, so the tooltip is visible without interaction. */
export const Open: Story = {
  args: { defaultOpen: true },
}

/** One tooltip on each side of its trigger. */
export const Sides: Story = {
  render: () => (
    <Flex gap="4">
      {(['top', 'right', 'bottom', 'left'] as const).map((side) => (
        <Tooltip.Root key={side} defaultOpen>
          <Tooltip.Trigger render={<Button variant="outline" />}>
            {side}
          </Tooltip.Trigger>
          <Tooltip.Content side={side}>{`On the ${side}`}</Tooltip.Content>
        </Tooltip.Root>
      ))}
    </Flex>
  ),
}
