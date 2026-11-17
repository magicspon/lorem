import type { Meta, StoryObj } from '@storybook/tanstack-react'
import { expect } from 'storybook/test'

import { Text } from '#/typography/text/index.ts'
import { ScrambledText } from './scrambled-text'

const meta = {
  component: ScrambledText,
  args: {
    children:
      'Lorem ipsum dolor sit amet consectetur adipisicing elit. Similique pariatur dignissimos porro eius quam doloremque.',
  },
  argTypes: {
    effect: {
      control: 'select',
      options: ['scramble', 'lift', 'blur', 'magnify'],
    },
  },
  render: (args) => (
    <Text size="7" render={<p />}>
      <ScrambledText {...args} />
    </Text>
  ),
} satisfies Meta<typeof ScrambledText>

export default meta

type Story = StoryObj<typeof meta>

/** Letters near the pointer scramble. A screen reader reads the text once. */
export const Default: Story = {
  play: async ({ canvas, canvasElement, args }) => {
    await expect(canvas.getByText(args.children)).toBeInTheDocument()
    const shown = canvasElement.querySelector(
      '[data-slot="scrambled-text"] [aria-hidden="true"]',
    )
    await expect(shown).toBeInTheDocument()
  },
}

/** Letters rise out of the way of the pointer. */
export const Lift: Story = { args: { effect: 'lift' } }

/** Letters blur and fade near the pointer. */
export const Blur: Story = { args: { effect: 'blur' } }

/** Letters swell like a lens under the pointer. */
export const Magnify: Story = { args: { effect: 'magnify', strength: 0.6 } }

/** Scrambled letters show in another colour. */
export const ScrambleColor: Story = {
  args: { scrambleColor: '#61dca3', scrambleChars: '01' },
}
