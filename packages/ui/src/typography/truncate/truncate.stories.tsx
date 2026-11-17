import type { Meta, StoryObj } from '@storybook/tanstack-react'
import * as stylex from '@stylexjs/stylex'
import { expect, screen, waitFor } from 'storybook/test'

import { size } from '../../styles/tokens.stylex'
import { Stack } from '#/layout/index.ts'
import { Truncate } from './truncate'

const styles = stylex.create({
  narrow: { width: size['48'] },
})

const long =
  'Deleting a team that still has projects shows “Something went wrong”. It should name the projects that keep it.'

const meta = {
  component: Truncate,
  args: { children: long },
  render: (args) => (
    <div sx={styles.narrow}>
      <Truncate {...args} />
    </div>
  ),
} satisfies Meta<typeof Truncate>

export default meta

type Story = StoryObj<typeof meta>

/** One line, cut with an ellipsis; hovering shows the rest. */
export const OneLine: Story = {
  play: async ({ canvas, userEvent }) => {
    await userEvent.hover(canvas.getByText(long))
    // The tooltip is portalled to `document.body`, beside the cut text.
    await waitFor(() => expect(screen.getAllByText(long)).toHaveLength(2))
  },
}

/** Up to three lines before the cut. */
export const ThreeLines: Story = { args: { lines: 3 } }

/** Text that fits is plain text, with no tooltip to hover. */
export const Fits: Story = {
  args: { children: 'Fix the sign-up email' },
  play: async ({ canvas, userEvent }) => {
    await userEvent.hover(canvas.getByText('Fix the sign-up email'))
    await expect(screen.getAllByText('Fix the sign-up email')).toHaveLength(1)
  },
}

/** Cut text in a column of a list, each at its own width. */
export const InAList: Story = {
  render: () => (
    <Stack gap="2" sx={styles.narrow}>
      <Truncate>Short</Truncate>
      <Truncate>{long}</Truncate>
    </Stack>
  ),
}
