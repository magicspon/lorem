import type { Meta, StoryObj } from '@storybook/tanstack-react'
import * as stylex from '@stylexjs/stylex'
import { expect } from 'storybook/test'

import { size } from '../../styles/tokens.stylex'
import * as Field from '#/forms/field/index.ts'
import { Input } from '#/inputs/input/index.ts'
import * as Fieldset from './index.ts'

const styles = stylex.create({
  narrow: { width: size['80'] },
})

const meta = {
  component: Fieldset.Root,
  args: { disabled: false },
  decorators: [
    (Story) => (
      <div sx={styles.narrow}>
        <Story />
      </div>
    ),
  ],
  render: (args) => (
    <Fieldset.Root {...args}>
      <Fieldset.Legend>Address information</Fieldset.Legend>
      <Field.Description>
        We need your address to deliver your order.
      </Field.Description>
      <Field.Group>
        <Field.Root>
          <Field.Label htmlFor="street">Street address</Field.Label>
          <Input id="street" placeholder="123 Main St" />
        </Field.Root>
        <Field.Root>
          <Field.Label htmlFor="city">City</Field.Label>
          <Input id="city" placeholder="New York" />
        </Field.Root>
      </Field.Group>
    </Fieldset.Root>
  ),
} satisfies Meta<typeof Fieldset.Root>

export default meta

type Story = StoryObj<typeof meta>

/** The legend names the group. */
export const Default: Story = {
  play: async ({ canvas }) => {
    await expect(
      canvas.getByRole('group', { name: 'Address information' }),
    ).toBeInTheDocument()
  },
}

/** `label` sets the legend at label size. */
export const LabelLegend: Story = {
  render: (args) => (
    <Fieldset.Root {...args}>
      <Fieldset.Legend variant="label">Contact</Fieldset.Legend>
      <Field.Root>
        <Field.Label htmlFor="phone">Phone</Field.Label>
        <Input id="phone" type="tel" placeholder="+1 555 0100" />
      </Field.Root>
    </Fieldset.Root>
  ),
}

/** `disabled` disables the native controls inside. */
export const Disabled: Story = {
  args: { disabled: true },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('textbox', { name: 'City' })).toBeDisabled()
  },
}
