import type React from 'react'
import type { Meta, StoryObj } from '@storybook/tanstack-react'
import * as stylex from '@stylexjs/stylex'
import { expect, within } from 'storybook/test'

import { textStyles } from '#/typography/type-styles.ts'
import { space } from '../../styles/tokens.stylex'
import * as RadioGroup from './index.ts'

const styles = stylex.create({
  label: {
    display: 'flex',
    alignItems: 'center',
    gap: space['2'],
  },
})

const options = [
  ['default', 'Default'],
  ['comfortable', 'Comfortable'],
  ['compact', 'Compact'],
] as const

// Shared by every story: three labelled options.
const renderGroup = (
  args: React.ComponentProps<typeof RadioGroup.Root>,
  invalid = false,
): React.JSX.Element => (
  <RadioGroup.Root {...args}>
    {options.map(([value, label]) => (
      <label key={value} sx={[textStyles['2'], styles.label]}>
        <RadioGroup.Item value={value} aria-invalid={invalid || undefined} />
        {label}
      </label>
    ))}
  </RadioGroup.Root>
)

const meta = {
  component: RadioGroup.Root,
  args: { defaultValue: 'comfortable', 'aria-label': 'Density' },
  render: (args) => renderGroup(args),
} satisfies Meta<typeof RadioGroup.Root>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ canvas, userEvent }) => {
    const compact = canvas.getByRole('radio', { name: 'Compact' })
    await userEvent.click(compact)
    await expect(compact).toBeChecked()
  },
}

export const Disabled: Story = {
  args: { disabled: true },
  play: async ({ canvasElement }) => {
    // Dimmed like every disabled control, though Base UI renders a span.
    for (const control of within(canvasElement).getAllByRole('radio'))
      await expect(getComputedStyle(control).opacity).toBe('0.5')
  },
}

/** `aria-invalid` on the items shows the error ring. */
export const Invalid: Story = {
  render: (args) => renderGroup(args, true),
}
