import type { Meta, StoryObj } from '@storybook/tanstack-react'
import { expect, screen, waitFor } from 'storybook/test'

import { Button } from '#/actions/button/index.ts'
import { Flex } from '#/layout/index.ts'
import * as Toast from './index.ts'

/* Buttons that add each kind of toast. They must sit inside the provider. */
function Triggers() {
  const toast = Toast.useToast()
  return (
    <Flex gap="2" wrap="wrap">
      <Button
        variant="outline"
        onClick={() =>
          toast.add({
            title: 'Form saved',
            description: 'Your changes are live.',
          })
        }
      >
        Default
      </Button>
      <Button
        variant="outline"
        onClick={() =>
          toast.add({ type: 'success', title: 'Response submitted' })
        }
      >
        Success
      </Button>
      <Button
        variant="outline"
        onClick={() =>
          toast.add({
            type: 'error',
            title: 'Upload failed',
            description: 'The file is larger than 10 MB.',
            priority: 'high',
          })
        }
      >
        Error
      </Button>
      <Button
        variant="outline"
        onClick={() =>
          toast.add({
            type: 'warning',
            title: 'Form closes soon',
            description: 'It stops taking responses in an hour.',
          })
        }
      >
        Warning
      </Button>
      <Button
        variant="outline"
        onClick={() =>
          toast.add({
            title: 'Form archived',
            actionProps: { children: 'Undo' },
          })
        }
      >
        With action
      </Button>
      <Button
        variant="outline"
        onClick={() =>
          void toast.promise(
            new Promise<void>((resolve) => {
              setTimeout(() => resolve(), 1500)
            }),
            {
              loading: 'Publishing…',
              success: 'Form published',
              error: 'Could not publish',
            },
          )
        }
      >
        Promise
      </Button>
    </Flex>
  )
}

const meta = {
  component: Toast.Provider,
  parameters: { layout: 'centered' },
  render: (args) => (
    <Toast.Provider {...args}>
      <Triggers />
    </Toast.Provider>
  ),
} satisfies Meta<typeof Toast.Provider>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'Default' }))
    // The viewport is portalled to `document.body`, outside the story canvas.
    await expect(await screen.findByText('Form saved')).toBeVisible()
    await expect(screen.getByText('Your changes are live.')).toBeVisible()

    // Base UI hides the close button from screen readers until the stack
    // expands, on hover or focus.
    await userEvent.hover(screen.getByText('Form saved'))
    await userEvent.click(await screen.findByRole('button', { name: 'Close' }))
    await waitFor(() => expect(screen.queryByText('Form saved')).toBeNull())
  },
}

/** A promise toast spins while loading, then shows the result. */
export const FollowsPromise: Story = {
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'Promise' }))
    await expect(await screen.findByText('Publishing…')).toBeVisible()
    await expect(
      await screen.findByText('Form published', {}, { timeout: 3000 }),
    ).toBeVisible()
  },
}

/** `actionProps` adds a button beside the text. */
export const WithAction: Story = {
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'With action' }))
    await expect(
      await screen.findByRole('button', { name: 'Undo' }),
    ).toBeVisible()
  },
}

/** `timeout={0}` keeps toasts until they are closed. */
export const Persistent: Story = {
  args: { timeout: 0 },
}
