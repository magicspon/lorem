import type { Meta, StoryObj } from '@storybook/tanstack-react'
import { BellIcon } from 'lucide-react'
import { expect } from 'storybook/test'

import { Flex } from '#/layout/index.ts'
import { Dot } from './dot'
import { IconButton } from '#/actions/icon-button/index.ts'

const tones = ['primary', 'destructive', 'success', 'warning'] as const

const meta = {
  component: Dot,
  args: { tone: 'primary' },
  argTypes: { tone: { control: 'select', options: tones } },
} satisfies Meta<typeof Dot>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}

/** One dot per tone. */
export const Tones: Story = {
  render: () => (
    <Flex align="center" gap="3">
      {tones.map((tone) => (
        <Dot key={tone} tone={tone} aria-label={tone} />
      ))}
    </Flex>
  ),
  play: async ({ canvas }) => {
    await expect(canvas.getByLabelText('success')).toBeVisible()
  },
}

/** Pinned to a button's corner, as an unread marker. */
export const Corner: Story = {
  render: () => (
    <IconButton
      variant="ghost"
      icon={
        <>
          <BellIcon />
          <Dot tone="destructive" placement="corner" />
        </>
      }
    >
      Notifications, 2 unread
    </IconButton>
  ),
}
