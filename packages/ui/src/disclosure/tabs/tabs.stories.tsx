import type React from 'react'
import type { Meta, StoryObj } from '@storybook/tanstack-react'
import * as stylex from '@stylexjs/stylex'
import { expect } from 'storybook/test'

import { size } from '../../styles/tokens.stylex'
import * as Tabs from './index.ts'

const styles = stylex.create({
  tabs: { width: size['96'] },
})

type TabsArgs = React.ComponentProps<typeof Tabs.Root>

// Shared by every story: three tabs and their panels.
const renderTabs = (
  args: TabsArgs,
  variant: 'default' | 'line' | 'sidebar' = 'default',
  disableLast = false,
): React.JSX.Element => (
  <Tabs.Root {...args} sx={styles.tabs}>
    <Tabs.List variant={variant}>
      <Tabs.Trigger value="account">Account</Tabs.Trigger>
      <Tabs.Trigger value="password">Password</Tabs.Trigger>
      <Tabs.Trigger value="team" disabled={disableLast}>
        Team
      </Tabs.Trigger>
    </Tabs.List>
    <Tabs.Content value="account">
      Update your name and email address.
    </Tabs.Content>
    <Tabs.Content value="password">
      Change your password. You&apos;ll be signed out on other devices.
    </Tabs.Content>
    <Tabs.Content value="team">
      Invite people and manage their roles.
    </Tabs.Content>
  </Tabs.Root>
)

const meta = {
  component: Tabs.Root,
  args: { defaultValue: 'account' },
  render: (args) => renderTabs(args),
} satisfies Meta<typeof Tabs.Root>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ canvas, userEvent }) => {
    const password = canvas.getByRole('tab', { name: 'Password' })
    await userEvent.click(password)

    await expect(password).toHaveAttribute('aria-selected', 'true')
    // By name: Base UI keeps the other panels mounted.
    await expect(
      canvas.getByRole('tabpanel', { name: 'Password' }),
    ).toHaveTextContent(/Change your password/)
  },
}

/** An underline marks the active tab, with no background. */
export const Line: Story = {
  render: (args) => renderTabs(args, 'line'),
}

/** The list sits beside the panels. */
export const Vertical: Story = {
  args: { orientation: 'vertical' },
}

/** A disabled tab can't be selected. */
export const Disabled: Story = {
  render: (args) => renderTabs(args, 'default', true),
}

/** A fixed-width line list beside a page's sections, spaced as a page. */
export const Sidebar: Story = {
  args: { orientation: 'vertical', variant: 'page' },
  render: (args) => renderTabs(args, 'sidebar'),
  play: async ({ canvas }) => {
    const list = canvas.getByRole('tablist')
    await expect(getComputedStyle(list).width).toBe('208px')
  },
}

/** `page` spaces tabs that switch a screen's main content. */
export const Page: Story = {
  args: { variant: 'page' },
  play: async ({ canvasElement }) => {
    const tabs = canvasElement.querySelector('[data-slot="tabs"]')
    await expect(tabs).not.toBeNull()
    if (tabs) await expect(getComputedStyle(tabs).rowGap).toBe('16px')
  },
}
