import * as React from 'react'
import type { Meta, StoryObj } from '@storybook/tanstack-react'
import { expect, screen, waitFor } from 'storybook/test'

import { Button } from '#/actions/button/index.ts'
import * as DropdownMenu from './index.ts'
import { IconButton } from '#/actions/icon-button/index.ts'

type MenuProps = React.ComponentProps<typeof DropdownMenu.Root>

function CheckboxMenu(props: MenuProps): React.JSX.Element {
  const [statusBar, setStatusBar] = React.useState(true)
  const [activityBar, setActivityBar] = React.useState(false)

  return (
    <DropdownMenu.Root {...props}>
      <DropdownMenu.Trigger render={<Button variant="outline" />}>
        View
      </DropdownMenu.Trigger>
      <DropdownMenu.Content>
        {/* Base UI's group label needs a surrounding group. */}
        <DropdownMenu.Group>
          <DropdownMenu.Label>Appearance</DropdownMenu.Label>
          <DropdownMenu.CheckboxItem
            checked={statusBar}
            onCheckedChange={setStatusBar}
          >
            Status bar
          </DropdownMenu.CheckboxItem>
          <DropdownMenu.CheckboxItem
            checked={activityBar}
            onCheckedChange={setActivityBar}
          >
            Activity bar
          </DropdownMenu.CheckboxItem>
        </DropdownMenu.Group>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  )
}

function RadioMenu(props: MenuProps): React.JSX.Element {
  const [position, setPosition] = React.useState('bottom')

  return (
    <DropdownMenu.Root {...props}>
      <DropdownMenu.Trigger render={<Button variant="outline" />}>
        Panel position
      </DropdownMenu.Trigger>
      <DropdownMenu.Content>
        <DropdownMenu.RadioGroup value={position} onValueChange={setPosition}>
          <DropdownMenu.RadioItem value="top">Top</DropdownMenu.RadioItem>
          <DropdownMenu.RadioItem value="bottom">Bottom</DropdownMenu.RadioItem>
          <DropdownMenu.RadioItem value="right">Right</DropdownMenu.RadioItem>
        </DropdownMenu.RadioGroup>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  )
}

const meta = {
  component: DropdownMenu.Root,
  // Every story composes the parts itself; `DropdownMenu` alone renders nothing visible.
  render: (args) => (
    <DropdownMenu.Root {...args}>
      <DropdownMenu.Trigger render={<Button variant="outline" />}>
        Open menu
      </DropdownMenu.Trigger>
      <DropdownMenu.Content>
        <DropdownMenu.Group>
          <DropdownMenu.Label>My account</DropdownMenu.Label>
          <DropdownMenu.Item>
            Profile <DropdownMenu.Shortcut>⇧⌘P</DropdownMenu.Shortcut>
          </DropdownMenu.Item>
          <DropdownMenu.Item>
            Settings <DropdownMenu.Shortcut>⌘S</DropdownMenu.Shortcut>
          </DropdownMenu.Item>
        </DropdownMenu.Group>
        <DropdownMenu.Separator />
        <DropdownMenu.Group>
          <DropdownMenu.Item>Team</DropdownMenu.Item>
          <DropdownMenu.Sub>
            <DropdownMenu.SubTrigger>Invite users</DropdownMenu.SubTrigger>
            <DropdownMenu.SubContent>
              <DropdownMenu.Item>Email</DropdownMenu.Item>
              <DropdownMenu.Item>Message</DropdownMenu.Item>
            </DropdownMenu.SubContent>
          </DropdownMenu.Sub>
          <DropdownMenu.Item disabled>API</DropdownMenu.Item>
        </DropdownMenu.Group>
        <DropdownMenu.Separator />
        <DropdownMenu.Item variant="destructive">Log out</DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  ),
} satisfies Meta<typeof DropdownMenu.Root>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'Open menu' }))

    // The menu is portalled to `document.body`, outside the story canvas.
    const menu = await screen.findByRole('menu')
    // Polled because the menu fades in from opacity 0.
    await waitFor(() => expect(menu).toBeVisible())

    await userEvent.keyboard('{Escape}')
    await waitFor(() => expect(screen.queryByRole('menu')).toBeNull())
  },
}

/** Starts open, so the menu is visible without interaction (useful for visual tests). */
export const Open: Story = {
  args: { defaultOpen: true },
}

/** Items that toggle on and off. */
export const Checkboxes: Story = {
  render: (args) => <CheckboxMenu {...args} />,
}

/** Items where only one can be chosen. */
export const RadioGroup: Story = {
  render: (args) => <RadioMenu {...args} />,
}

/** `wide` makes room for a heading and shortcuts beside a narrow trigger. */
export const Wide: Story = {
  render: (args) => (
    <DropdownMenu.Root {...args}>
      <DropdownMenu.Trigger
        render={
          <IconButton variant="ghost" icon="⋯">
            Open menu
          </IconButton>
        }
      />
      <DropdownMenu.Content size="wide">
        <DropdownMenu.Group>
          <DropdownMenu.Label>Sam Carter</DropdownMenu.Label>
          <DropdownMenu.Item>
            Profile <DropdownMenu.Shortcut>⇧⌘P</DropdownMenu.Shortcut>
          </DropdownMenu.Item>
        </DropdownMenu.Group>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  ),
  args: { defaultOpen: true },
  play: async () => {
    const menu = await screen.findByRole('menu')
    await expect(getComputedStyle(menu).minWidth).toBe('224px')
  },
}
