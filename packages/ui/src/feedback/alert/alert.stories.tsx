import type { Meta, StoryObj } from '@storybook/tanstack-react'
import * as stylex from '@stylexjs/stylex'
import { CircleAlertIcon, InfoIcon } from 'lucide-react'

import { expect } from 'storybook/test'

import * as Alert from './index.ts'
import { Button } from '#/actions/button/index.ts'

const styles = stylex.create({
  alert: { maxWidth: '28rem' },
})

const meta = {
  component: Alert.Root,
  parameters: { layout: 'padded' },
  args: { variant: 'default' },
  argTypes: {
    variant: { control: 'inline-radio', options: ['default', 'destructive'] },
  },
  render: (args) => (
    <Alert.Root {...args} sx={styles.alert}>
      <InfoIcon />
      <Alert.Title>Heads up!</Alert.Title>
      <Alert.Description>
        You can add components to your app using the CLI.
      </Alert.Description>
    </Alert.Root>
  ),
} satisfies Meta<typeof Alert.Root>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Destructive: Story = {
  args: { variant: 'destructive' },
  render: (args) => (
    <Alert.Root {...args} sx={styles.alert}>
      <CircleAlertIcon />
      <Alert.Title>Payment failed</Alert.Title>
      <Alert.Description>
        Your card was declined. Check your details and try again.
      </Alert.Description>
    </Alert.Root>
  ),
}

/** `Alert.Action` pins a control to the top-right corner. */
export const WithAction: Story = {
  render: (args) => (
    <Alert.Root {...args} sx={styles.alert}>
      <InfoIcon />
      <Alert.Title>Message archived</Alert.Title>
      <Alert.Description>
        You can find it in the archive folder.
      </Alert.Description>
      <Alert.Action>
        <Button size="xs" variant="outline">
          Undo
        </Button>
      </Alert.Action>
    </Alert.Root>
  ),
}

/** Without an icon the text spans the full width. */
export const WithoutIcon: Story = {
  render: (args) => (
    <Alert.Root {...args} sx={styles.alert}>
      <Alert.Title>Update available</Alert.Title>
      <Alert.Description>
        Restart the app to install version 2.0.
      </Alert.Description>
    </Alert.Root>
  ),
}

/** `AlertActions` holds buttons under the text, clear of the icon. */
export const WithActions: Story = {
  render: (args) => (
    <Alert.Root {...args} sx={styles.alert}>
      <InfoIcon />
      <Alert.Title>3 selected</Alert.Title>
      <Alert.Description>
        Actions here apply to every selected customer.
      </Alert.Description>
      <Alert.Actions>
        <Button variant="outline" size="sm">
          Export selected
        </Button>
        <Button variant="destructive" size="sm">
          Suspend selected
        </Button>
      </Alert.Actions>
    </Alert.Root>
  ),
  play: async ({ canvas, canvasElement }) => {
    const actions = canvasElement.querySelector('[data-slot="alert-actions"]')
    const title = canvas.getByText('3 selected')
    await expect(actions).not.toBeNull()
    // The buttons line up with the title, not with the icon.
    if (actions)
      await expect(actions.getBoundingClientRect().left).toBe(
        title.getBoundingClientRect().left,
      )
  },
}
