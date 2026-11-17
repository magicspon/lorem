import type { Meta, StoryObj } from '@storybook/tanstack-react'
import * as stylex from '@stylexjs/stylex'
import { expect, screen, waitFor } from 'storybook/test'

import { space } from '../../styles/tokens.stylex'
import { Button } from '#/actions/button/index.ts'
import { Input } from '#/inputs/input/index.ts'
import * as Dialog from './index.ts'

const styles = stylex.create({
  scroller: {
    marginInline: `-${space['5']}`,
    maxHeight: '50vh',
    overflowY: 'auto',
    paddingInline: space['5'],
  },
  paragraph: { marginTop: 0, marginBottom: space['4'] },
})

const meta = {
  component: Dialog.Root,
  args: {
    modal: true,
  },
  // Every story composes the parts itself; `Dialog` alone renders nothing visible.
  render: (args) => (
    <Dialog.Root {...args}>
      <Dialog.Trigger render={<Button variant="outline" />}>
        Open dialog
      </Dialog.Trigger>
      <Dialog.Content>
        <Dialog.Header>
          <Dialog.Title>Edit profile</Dialog.Title>
          <Dialog.Description>
            Make changes to your profile here. Click save when you&apos;re done.
          </Dialog.Description>
        </Dialog.Header>
        <Dialog.Footer>
          <Dialog.Close render={<Button variant="outline" />}>
            Cancel
          </Dialog.Close>
          <Button>Save changes</Button>
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog.Root>
  ),
} satisfies Meta<typeof Dialog.Root>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'Open dialog' }))

    // The popup is portalled to `document.body`, outside the story canvas.
    const dialog = await screen.findByRole('dialog')
    await expect(dialog).toHaveAccessibleName('Edit profile')

    await userEvent.click(screen.getByRole('button', { name: 'Cancel' }))
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull())
  },
}

/** Starts open, so the popup is visible without interaction (useful for visual tests). */
export const Open: Story = {
  args: {
    defaultOpen: true,
  },
}

/** Uses the footer's built-in close button and hides the corner one. */
export const FooterCloseButton: Story = {
  render: (args) => (
    <Dialog.Root {...args}>
      <Dialog.Trigger render={<Button variant="outline" />}>
        Show terms
      </Dialog.Trigger>
      <Dialog.Content showCloseButton={false}>
        <Dialog.Header>
          <Dialog.Title>Terms of service</Dialog.Title>
          <Dialog.Description>
            Read our <a href="#terms">full terms</a> before continuing.
          </Dialog.Description>
        </Dialog.Header>
        <Dialog.Footer showCloseButton />
      </Dialog.Content>
    </Dialog.Root>
  ),
}

/** Long content inside a scrollable region, so the popup never outgrows the viewport. */
export const ScrollableContent: Story = {
  render: (args) => (
    <Dialog.Root {...args}>
      <Dialog.Trigger render={<Button variant="outline" />}>
        Read changelog
      </Dialog.Trigger>
      <Dialog.Content>
        <Dialog.Header>
          <Dialog.Title>Changelog</Dialog.Title>
          <Dialog.Description>
            Everything that changed recently.
          </Dialog.Description>
        </Dialog.Header>
        <div sx={styles.scroller}>
          {Array.from({ length: 20 }, (_, i) => (
            <p key={i} sx={styles.paragraph}>
              Release {20 - i}: improved performance and fixed a number of small
              bugs.
            </p>
          ))}
        </div>
        <Dialog.Footer showCloseButton />
      </Dialog.Content>
    </Dialog.Root>
  ),
}

/**
 * `Dialog.Form` holds the header, fields and footer, and keeps the space
 * between them that a bare `<form>` would lose.
 */
export const WithForm: Story = {
  args: { defaultOpen: true },
  render: (args) => (
    <Dialog.Root {...args}>
      <Dialog.Content>
        <Dialog.Form onSubmit={(event) => event.preventDefault()}>
          <Dialog.Header>
            <Dialog.Title>Rename team</Dialog.Title>
            <Dialog.Description>Give the team a new name.</Dialog.Description>
          </Dialog.Header>
          <Input aria-label="Name" defaultValue="Design" />
          <Dialog.Footer>
            <Dialog.Close render={<Button variant="outline" type="button" />}>
              Cancel
            </Dialog.Close>
            <Button type="submit">Rename team</Button>
          </Dialog.Footer>
        </Dialog.Form>
      </Dialog.Content>
    </Dialog.Root>
  ),
  play: async () => {
    const field = await screen.findByRole('textbox', { name: 'Name' })
    const footer = screen.getByRole('button', { name: 'Rename team' })
    // The form's gap, 1.5rem, sits between the field and the footer, once
    // the opening zoom has finished.
    await waitFor(() =>
      expect(
        footer.getBoundingClientRect().top -
          field.getBoundingClientRect().bottom,
      ).toBeGreaterThanOrEqual(24),
    )
  },
}
