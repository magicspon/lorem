import type { Meta, StoryObj } from '@storybook/tanstack-react'
import { expect } from 'storybook/test'
import * as stylex from '@stylexjs/stylex'

import { textStyles } from '#/typography/type-styles.ts'
import { size, space } from '../../styles/tokens.stylex'
import { Textarea } from './textarea'

const styles = stylex.create({
  narrow: { width: size['80'] },
  note: { height: size['40'], borderWidth: 1, borderStyle: 'dashed' },
  field: {
    display: 'grid',
    gap: space['2'],
    fontWeight: 500,
  },
})

const meta = {
  component: Textarea,
  args: {
    placeholder: 'Type your message here.',
    'aria-label': 'Message',
    disabled: false,
  },
  decorators: [
    (Story) => (
      <div sx={styles.narrow}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Textarea>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Disabled: Story = {
  args: { disabled: true },
}

/** `aria-invalid` shows the error ring. */
export const Invalid: Story = {
  args: { 'aria-invalid': true },
}

/** A visible label in place of `aria-label`. */
export const WithLabel: Story = {
  render: ({ 'aria-label': _label, ...args }) => (
    <label sx={[textStyles['2'], styles.field]}>
      Your message
      <Textarea {...args} />
    </label>
  ),
}

/**
 * `variant="bare"` fills its parent, which is the frame: here a dashed box
 * stands in for a note on a workspace. It scrolls rather than grows.
 */
export const Bare: Story = {
  args: { variant: 'bare', defaultValue: 'A note on a board.' },
  render: (args) => (
    <div sx={styles.note}>
      <Textarea {...args} />
    </div>
  ),
  play: async ({ canvas, canvasElement }) => {
    const box = canvas.getByRole('textbox')
    const frame = canvasElement.querySelector('textarea')?.parentElement
    if (!frame) throw new Error('No frame')
    // Fills the frame's height, inside its border.
    await expect(
      Math.abs(box.getBoundingClientRect().height - frame.clientHeight),
    ).toBeLessThanOrEqual(1)
  },
}
