import type { Meta, StoryObj } from '@storybook/tanstack-react'
import { Trash2Icon } from 'lucide-react'
import { expect, screen, waitFor } from 'storybook/test'

import { Button } from '#/actions/button/index.ts'
import * as AlertDialog from './index.ts'

const meta = {
  component: AlertDialog.Root,
  args: {},
  // Every story composes the parts itself; `AlertDialog` alone renders nothing visible.
  render: (args) => (
    <AlertDialog.Root {...args}>
      <AlertDialog.Trigger render={<Button variant="outline" />}>
        Show dialog
      </AlertDialog.Trigger>
      <AlertDialog.Content>
        <AlertDialog.Header>
          <AlertDialog.Title>Are you absolutely sure?</AlertDialog.Title>
          <AlertDialog.Description>
            This cannot be undone. It deletes your account and removes your data
            from our servers.
          </AlertDialog.Description>
        </AlertDialog.Header>
        <AlertDialog.Footer>
          <AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
          <AlertDialog.Action>Continue</AlertDialog.Action>
        </AlertDialog.Footer>
      </AlertDialog.Content>
    </AlertDialog.Root>
  ),
} satisfies Meta<typeof AlertDialog.Root>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'Show dialog' }))

    // The popup is portalled to `document.body`, outside the story canvas.
    const alert = await screen.findByRole('alertdialog')
    await expect(alert).toHaveAccessibleName('Are you absolutely sure?')
    // No corner close button: the person must answer.
    await expect(screen.queryByRole('button', { name: 'Close' })).toBeNull()

    await userEvent.click(screen.getByRole('button', { name: 'Cancel' }))
    await waitFor(() => expect(screen.queryByRole('alertdialog')).toBeNull())
  },
}

/** Starts open, so the popup is visible without interaction (useful for visual tests). */
export const Open: Story = {
  args: { defaultOpen: true },
}

/** `sm` keeps the header centred and puts the two actions side by side. */
export const Small: Story = {
  args: { defaultOpen: true },
  render: (args) => (
    <AlertDialog.Root {...args}>
      <AlertDialog.Content size="sm">
        <AlertDialog.Header>
          <AlertDialog.Title>Allow notifications?</AlertDialog.Title>
          <AlertDialog.Description>
            We will tell you when someone replies to your form.
          </AlertDialog.Description>
        </AlertDialog.Header>
        <AlertDialog.Footer>
          <AlertDialog.Cancel>Not now</AlertDialog.Cancel>
          <AlertDialog.Action>Allow</AlertDialog.Action>
        </AlertDialog.Footer>
      </AlertDialog.Content>
    </AlertDialog.Root>
  ),
}

/** An icon in `Media` and a destructive action, for a choice that cannot be undone. */
export const Destructive: Story = {
  args: { defaultOpen: true },
  render: (args) => (
    <AlertDialog.Root {...args}>
      <AlertDialog.Content>
        <AlertDialog.Header>
          <AlertDialog.Media>
            <Trash2Icon />
          </AlertDialog.Media>
          <AlertDialog.Title>Delete this form?</AlertDialog.Title>
          <AlertDialog.Description>
            Its responses are deleted with it.
          </AlertDialog.Description>
        </AlertDialog.Header>
        <AlertDialog.Footer>
          <AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
          <AlertDialog.Action variant="destructive">Delete</AlertDialog.Action>
        </AlertDialog.Footer>
      </AlertDialog.Content>
    </AlertDialog.Root>
  ),
}
