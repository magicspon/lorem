import { size } from '../../styles/tokens.stylex'
import type { Meta, StoryObj } from '@storybook/tanstack-react'
import * as stylex from '@stylexjs/stylex'
import { expect } from 'storybook/test'
import { ArrowUpIcon, CopyIcon, SearchIcon } from 'lucide-react'

import * as InputGroup from './index.ts'

const styles = stylex.create({
  narrow: { width: size['80'] },
  push: { marginLeft: 'auto' },
})

const meta = {
  component: InputGroup.Root,
  decorators: [
    (Story) => (
      <div sx={styles.narrow}>
        <Story />
      </div>
    ),
  ],
  render: (args) => (
    <InputGroup.Root {...args}>
      <InputGroup.Input placeholder="Search…" aria-label="Search" />
      <InputGroup.Addon>
        <SearchIcon />
      </InputGroup.Addon>
      <InputGroup.Addon align="inline-end">12 results</InputGroup.Addon>
    </InputGroup.Root>
  ),
} satisfies Meta<typeof InputGroup.Root>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}

/** Fixed text on both sides of the input. */
export const WithText: Story = {
  render: (args) => (
    <InputGroup.Root {...args}>
      <InputGroup.Addon>
        <InputGroup.Text>https://</InputGroup.Text>
      </InputGroup.Addon>
      <InputGroup.Input placeholder="example" aria-label="Website" />
      <InputGroup.Addon align="inline-end">
        <InputGroup.Text>.com</InputGroup.Text>
      </InputGroup.Addon>
    </InputGroup.Root>
  ),
}

export const WithButton: Story = {
  render: (args) => (
    <InputGroup.Root {...args}>
      <InputGroup.Input
        readOnly
        defaultValue="https://example.com/invite/a1b2c3"
        aria-label="Invite link"
      />
      <InputGroup.Addon align="inline-end">
        <InputGroup.Button size="icon-xs" aria-label="Copy link">
          <CopyIcon />
        </InputGroup.Button>
      </InputGroup.Addon>
    </InputGroup.Root>
  ),
}

/** A textarea with a toolbar underneath. */
export const WithTextarea: Story = {
  render: (args) => (
    <InputGroup.Root {...args}>
      <InputGroup.Textarea placeholder="Ask anything…" aria-label="Message" />
      <InputGroup.Addon align="block-end">
        <InputGroup.Text>0 / 280</InputGroup.Text>
        <InputGroup.Button
          size="icon-xs"
          variant="default"
          sx={styles.push}
          aria-label="Send"
        >
          <ArrowUpIcon />
        </InputGroup.Button>
      </InputGroup.Addon>
    </InputGroup.Root>
  ),
}

/** `aria-invalid` on the control turns the whole group red. */
export const Invalid: Story = {
  render: (args) => (
    <InputGroup.Root {...args}>
      <InputGroup.Input
        aria-invalid
        defaultValue="not-an-email"
        aria-label="Email"
      />
      <InputGroup.Addon align="inline-end">
        <InputGroup.Text>Invalid</InputGroup.Text>
      </InputGroup.Addon>
    </InputGroup.Root>
  ),
}

/**
 * `search` is a toolbar's search box: a row of its own on a phone, 16rem
 * from `sm` up. Shown here without the story's narrow frame.
 */
export const Search: Story = {
  decorators: [(Story) => <Story />],
  args: { variant: 'search' },
  play: async ({ canvasElement }) => {
    const group = canvasElement.querySelector('[data-slot="input-group"]')
    await expect(group).not.toBeNull()
    if (group && window.matchMedia('(min-width: 40rem)').matches)
      await expect(getComputedStyle(group).width).toBe('256px')
  },
}
