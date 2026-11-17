import type { Meta, StoryObj } from '@storybook/tanstack-react'
import * as stylex from '@stylexjs/stylex'

import { size } from '../../styles/tokens.stylex'
import * as Progress from './index.ts'

const styles = stylex.create({
  narrow: { width: size['72'] },
})

const meta = {
  component: Progress.Root,
  args: { value: 60 },
  argTypes: {
    value: { control: { type: 'range', min: 0, max: 100 } },
  },
  decorators: [
    (Story) => (
      <div sx={styles.narrow}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Progress.Root>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: { 'aria-label': 'Upload progress' },
}

/** A visible label and the value as a percentage above the track. */
export const WithLabel: Story = {
  render: (args) => (
    <Progress.Root {...args}>
      <Progress.Label>Upload progress</Progress.Label>
      <Progress.Value />
    </Progress.Root>
  ),
}

/** `null` means the amount of work left is unknown. */
export const Indeterminate: Story = {
  args: { value: null, 'aria-label': 'Loading' },
}

export const Complete: Story = {
  args: { value: 100, 'aria-label': 'Upload progress' },
}
