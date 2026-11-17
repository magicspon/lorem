import type { Meta, StoryObj } from '@storybook/tanstack-react'
import * as stylex from '@stylexjs/stylex'
import { expect, within } from 'storybook/test'

import { textStyles } from '#/typography/type-styles.ts'
import { space } from '../../styles/tokens.stylex'
import { Checkbox } from './checkbox'

const styles = stylex.create({
  label: {
    display: 'flex',
    alignItems: 'center',
    gap: space['2'],
  },
})

const meta = {
  component: Checkbox,
  args: { disabled: false },
  render: (args) => (
    <label sx={[textStyles['2'], styles.label]}>
      <Checkbox {...args} />
      Accept terms and conditions
    </label>
  ),
} satisfies Meta<typeof Checkbox>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ canvas, userEvent }) => {
    const checkbox = canvas.getByRole('checkbox')
    await expect(checkbox).toHaveAttribute('aria-checked', 'false')

    await userEvent.click(checkbox)
    await expect(checkbox).toHaveAttribute('aria-checked', 'true')
  },
}

export const Checked: Story = {
  args: { defaultChecked: true },
}

export const Disabled: Story = {
  args: { disabled: true },
  play: async ({ canvasElement }) => {
    // Dimmed like every disabled control, though Base UI renders a span.
    for (const control of within(canvasElement).getAllByRole('checkbox'))
      await expect(getComputedStyle(control).opacity).toBe('0.5')
  },
}

/** `aria-invalid` shows the error ring. */
export const Invalid: Story = {
  args: { 'aria-invalid': true },
}
