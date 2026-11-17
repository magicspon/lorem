import * as React from 'react'
import type { Meta, StoryObj } from '@storybook/tanstack-react'
import * as stylex from '@stylexjs/stylex'
import { expect, screen, waitFor } from 'storybook/test'

import { space } from '../../styles/tokens.stylex'
import { Button } from '#/actions/button/index.ts'
import { Text } from '#/typography/text/index.ts'
import { Input } from '#/inputs/input/index.ts'
import * as Popover from './index.ts'

const styles = stylex.create({
  field: { display: 'grid', gap: space['2'], fontWeight: 500 },
  padded: { paddingBlock: space['8'] },
})

type Placement = Pick<
  React.ComponentProps<typeof Popover.Content>,
  'side' | 'align' | 'sideOffset'
>

/* The canonical assembly. Controlled so Done can close it: ui exports no PopoverClose. */
function ComposedPopover(placement: Placement): React.JSX.Element {
  const [open, setOpen] = React.useState(false)

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger render={<Button variant="outline" />}>
        Open popover
      </Popover.Trigger>
      <Popover.Content {...placement}>
        <Popover.Header>
          <Popover.Title>Dimensions</Popover.Title>
          <Popover.Description>
            Set the dimensions for the layer.
          </Popover.Description>
        </Popover.Header>
        <label sx={styles.field}>
          Width
          <Input defaultValue="100%" />
        </label>
        <label sx={styles.field}>
          Height
          <Input defaultValue="25px" />
        </label>
        <Button onClick={() => setOpen(false)}>Done</Button>
      </Popover.Content>
    </Popover.Root>
  )
}

const meta = {
  component: Popover.Root,
  parameters: { layout: 'centered' },
} satisfies Meta<typeof Popover.Root>

export default meta

type Story = StoryObj<typeof meta>

export const Composed: Story = {
  render: () => <ComposedPopover />,
  play: async ({ canvas, userEvent }) => {
    const trigger = canvas.getByRole('button', { name: 'Open popover' })
    await expect(trigger).toHaveAttribute('aria-haspopup', 'dialog')
    await expect(trigger).toHaveAttribute('aria-expanded', 'false')

    await userEvent.click(trigger)
    // The popup is portalled to `document.body`, outside the story canvas.
    const popover = await screen.findByRole('dialog', { name: 'Dimensions' })
    await expect(popover).toHaveAccessibleDescription(
      'Set the dimensions for the layer.',
    )
    await expect(trigger).toHaveAttribute('aria-expanded', 'true')

    // Escape closes and focus goes back to the trigger.
    await userEvent.keyboard('{Escape}')
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull())
    await expect(trigger).toHaveFocus()
    await expect(trigger).toHaveAttribute('aria-expanded', 'false')
  },
}

/** Opens to the right, top edges aligned. */
export const Placement: Story = {
  render: () => (
    // Room above the trigger: at the page's top edge Base UI moves the popup
    // down to keep its collision padding, which would break the alignment check.
    <div sx={styles.padded}>
      <ComposedPopover side="right" align="start" sideOffset={0} />
    </div>
  ),
  play: async ({ canvas, userEvent }) => {
    const trigger = canvas.getByRole('button', { name: 'Open popover' })
    await userEvent.click(trigger)
    const popover = await screen.findByRole('dialog', { name: 'Dimensions' })

    // Polled because the popup zooms in from 95% while it enters.
    await waitFor(async () => {
      const t = trigger.getBoundingClientRect()
      const p = popover.getBoundingClientRect()
      // Within half a pixel. Rounding a sub-pixel gap can give -0, which
      // `toBe(0)` rejects.
      await expect(p.left - t.right).toBeCloseTo(0, 0)
      await expect(p.top - t.top).toBeCloseTo(0, 0)
    })
  },
}

/** `fit` sizes the panel to what it holds. */
export const Fit: Story = {
  render: () => (
    <Popover.Root>
      <Popover.Trigger render={<Button variant="outline" />}>
        Pick a date
      </Popover.Trigger>
      <Popover.Content size="fit">
        <Popover.Title>Date</Popover.Title>
        <Text>Today</Text>
      </Popover.Content>
    </Popover.Root>
  ),
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'Pick a date' }))
    const popover = await screen.findByRole('dialog', { name: 'Date' })
    // Never narrower than 14rem, however little it holds.
    await expect(getComputedStyle(popover).minWidth).toBe('224px')
  },
}

/** `lg` holds a list, such as notifications. */
export const Large: Story = {
  render: () => (
    <Popover.Root>
      <Popover.Trigger render={<Button variant="outline" />}>
        Notifications
      </Popover.Trigger>
      <Popover.Content size="lg">
        <Popover.Header>
          <Popover.Title>Notifications</Popover.Title>
          <Popover.Description>You have 3 unread messages.</Popover.Description>
        </Popover.Header>
      </Popover.Content>
    </Popover.Root>
  ),
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'Notifications' }))
    const popover = await screen.findByRole('dialog', { name: 'Notifications' })
    await expect(getComputedStyle(popover).width).toBe('360px')
  },
}
