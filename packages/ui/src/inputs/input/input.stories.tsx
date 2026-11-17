import type { Meta, StoryObj } from '@storybook/tanstack-react'
import * as stylex from '@stylexjs/stylex'

import { textStyles } from '#/typography/type-styles.ts'
import { size, space } from '../../styles/tokens.stylex'
import { Input } from './input'

const styles = stylex.create({
  narrow: { width: size['72'] },
  field: {
    display: 'grid',
    gap: space['2'],
    fontWeight: 500,
  },
})

const meta = {
  component: Input,
  args: {
    type: 'email',
    placeholder: 'you@example.com',
    'aria-label': 'Email',
    disabled: false,
  },
  decorators: [
    (Story) => (
      <div sx={styles.narrow}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Input>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Disabled: Story = {
  args: { disabled: true },
}

/** `aria-invalid` shows the error ring. */
export const Invalid: Story = {
  args: { 'aria-invalid': true, defaultValue: 'not-an-email' },
}

export const File: Story = {
  args: { type: 'file', placeholder: undefined, 'aria-label': 'Picture' },
}

/** A visible label in place of `aria-label`. */
export const WithLabel: Story = {
  render: ({ 'aria-label': _label, ...args }) => (
    <label sx={[textStyles['2'], styles.field]}>
      Email
      <Input {...args} />
    </label>
  ),
}
