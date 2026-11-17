import type { Meta, StoryObj } from '@storybook/tanstack-react'

import { linkStyles } from './link'
import { Stack } from '#/layout/index.ts'
import { Text } from '../text/index.ts'

const meta = {} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

/** `linkStyles` is passed to a link's `sx`; there is no link component. */
export const Tones: Story = {
  render: () => (
    <Stack gap="2">
      <a href="#inherit" sx={linkStyles()}>
        Inherits the text colour
      </a>
      <a href="#accent" sx={linkStyles({ tone: 'accent' })}>
        Accent
      </a>
      <a href="#muted" sx={linkStyles({ tone: 'muted' })}>
        Muted
      </a>
    </Stack>
  ),
}

/** `inline` underlines at rest, for a link inside a sentence. */
export const Inline: Story = {
  render: () => (
    <Text render={<p />}>
      Read the{' '}
      <a href="#guide" sx={linkStyles({ inline: true, tone: 'accent' })}>
        publishing guide
      </a>{' '}
      before you share a form.
    </Text>
  ),
}
