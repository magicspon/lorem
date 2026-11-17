import type { Meta, StoryObj } from '@storybook/tanstack-react'
import * as stylex from '@stylexjs/stylex'
import { expect } from 'storybook/test'

import { size } from '../../styles/tokens.stylex'
import { Checkbox } from '#/inputs/checkbox/index.ts'
import * as Fieldset from '#/forms/fieldset/index.ts'
import { Input } from '#/inputs/input/index.ts'
import * as RadioGroup from '#/inputs/radio-group/index.ts'
import { Switch } from '#/inputs/switch/index.ts'
import { Textarea } from '#/inputs/textarea/index.ts'
import * as Field from './index.ts'

const styles = stylex.create({
  narrow: { width: size['80'] },
  wide: { width: '36rem' },
  normal: { fontWeight: 400 },
})

// The parts hold no form state: ids, `data-invalid` and errors come from the
// form library, as they would from TanStack Form.

const meta = {
  component: Field.Root,
  args: { orientation: 'vertical' },
  argTypes: {
    orientation: {
      control: 'inline-radio',
      options: ['vertical', 'horizontal', 'responsive'],
    },
  },
  decorators: [
    (Story) => (
      <div sx={styles.narrow}>
        <Story />
      </div>
    ),
  ],
  render: (args) => (
    <Field.Root {...args}>
      <Field.Label htmlFor="username">Username</Field.Label>
      <Input
        id="username"
        placeholder="shadcn"
        aria-describedby="username-description"
      />
      <Field.Description id="username-description">
        Choose a unique username.
      </Field.Description>
    </Field.Root>
  ),
} satisfies Meta<typeof Field.Root>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ canvas }) => {
    const input = canvas.getByRole('textbox', { name: 'Username' })
    await expect(input).toHaveAccessibleDescription('Choose a unique username.')
  },
}

export const WithTextarea: Story = {
  render: (args) => (
    <Field.Root {...args}>
      <Field.Label htmlFor="feedback">Feedback</Field.Label>
      <Textarea id="feedback" placeholder="Your feedback helps us improve." />
      <Field.Description>
        Share your thoughts about the service.
      </Field.Description>
    </Field.Root>
  ),
}

/** A checkbox beside its label. Clicking the label ticks the box. */
export const WithCheckbox: Story = {
  args: { orientation: 'horizontal' },
  render: (args) => (
    <Field.Root {...args}>
      <Checkbox id="terms" />
      <Field.Label htmlFor="terms">Accept the terms and conditions</Field.Label>
    </Field.Root>
  ),
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByText('Accept the terms and conditions'))
    await expect(
      canvas.getByRole('checkbox', { name: 'Accept the terms and conditions' }),
    ).toBeChecked()
  },
}

/** A title and description beside a switch. */
export const WithSwitch: Story = {
  args: { orientation: 'horizontal' },
  render: (args) => (
    <Field.Root {...args}>
      <Field.Content>
        <Field.Label htmlFor="mfa">Multi-factor authentication</Field.Label>
        <Field.Description>
          Enable multi-factor authentication to secure your account.
        </Field.Description>
      </Field.Content>
      <Switch id="mfa" />
    </Field.Root>
  ),
}

export const WithRadioGroup: Story = {
  render: () => (
    <Fieldset.Root>
      <Fieldset.Legend variant="label">Subscription plan</Fieldset.Legend>
      <Field.Description>
        Yearly and lifetime plans save money.
      </Field.Description>
      <RadioGroup.Root defaultValue="monthly">
        {['Monthly', 'Yearly', 'Lifetime'].map((plan) => (
          <Field.Root key={plan} orientation="horizontal">
            <RadioGroup.Item value={plan.toLowerCase()} id={`plan-${plan}`} />
            <Field.Label htmlFor={`plan-${plan}`} sx={styles.normal}>
              {plan}
            </Field.Label>
          </Field.Root>
        ))}
      </RadioGroup.Root>
    </Fieldset.Root>
  ),
}

/** A label wrapping a whole field becomes a selectable card. */
export const ChoiceCard: Story = {
  render: () => (
    <RadioGroup.Root defaultValue="plus" aria-label="Plan">
      {[
        ['plus', 'Plus', 'For individuals and small teams.'],
        ['pro', 'Pro', 'For growing businesses.'],
      ].map(([value = '', title, description]) => (
        <Field.Label key={value}>
          <Field.Root orientation="horizontal">
            <Field.Content>
              <Field.Title>{title}</Field.Title>
              <Field.Description>{description}</Field.Description>
            </Field.Content>
            <RadioGroup.Item value={value} aria-label={title} />
          </Field.Root>
        </Field.Label>
      ))}
    </RadioGroup.Root>
  ),
}

/** Fields stacked in a group, with a separator between sections. */
export const Group: Story = {
  render: () => (
    <Field.Group>
      <Field.Root>
        <Field.Label htmlFor="group-name">Name</Field.Label>
        <Input id="group-name" placeholder="Evil Rabbit" />
      </Field.Root>
      <Field.Root>
        <Field.Label htmlFor="group-email">Email</Field.Label>
        <Input id="group-email" type="email" placeholder="you@example.com" />
      </Field.Root>
      <Field.Separator>Or</Field.Separator>
      <Field.Root orientation="horizontal">
        <Checkbox id="guest" />
        <Field.Label htmlFor="guest">Sign in as a guest</Field.Label>
      </Field.Root>
    </Field.Group>
  ),
}

/** Stacked when the group is narrow, side by side once it is wide. */
export const Responsive: Story = {
  decorators: [
    (Story) => (
      <div sx={styles.wide}>
        <Story />
      </div>
    ),
  ],
  render: () => (
    <Field.Group>
      <Field.Root orientation="responsive">
        <Field.Content>
          <Field.Label htmlFor="responsive-name">Name</Field.Label>
          <Field.Description>Shown on your profile.</Field.Description>
        </Field.Content>
        <Input id="responsive-name" placeholder="Evil Rabbit" />
      </Field.Root>
      <Field.Root orientation="responsive">
        <Field.Content>
          <Field.Label htmlFor="message">Message</Field.Label>
          <Field.Description>Keep it short.</Field.Description>
        </Field.Content>
        <Textarea id="message" placeholder="Hello, world!" />
      </Field.Root>
    </Field.Group>
  ),
}

/** `data-disabled` fades the label; disable the control itself. */
export const Disabled: Story = {
  render: (args) => (
    <Field.Root {...args} data-disabled>
      <Field.Label htmlFor="disabled-username">Username</Field.Label>
      <Input id="disabled-username" placeholder="shadcn" disabled />
      <Field.Description>Choose a unique username.</Field.Description>
    </Field.Root>
  ),
  play: async ({ canvas }) => {
    await expect(
      canvas.getByRole('textbox', { name: 'Username' }),
    ).toBeDisabled()
  },
}

/** `data-invalid` colours the field; `Field.Error` shows the given errors. */
export const Invalid: Story = {
  render: (args) => (
    <Field.Root {...args} data-invalid>
      <Field.Label htmlFor="invalid-username">Username</Field.Label>
      <Input id="invalid-username" defaultValue="a" aria-invalid />
      <Field.Error
        errors={[
          { message: 'Username is too short.' },
          { message: 'Username must start with a capital letter.' },
        ]}
      />
    </Field.Root>
  ),
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('alert')).toHaveTextContent(
      'Username is too short.',
    )
  },
}
