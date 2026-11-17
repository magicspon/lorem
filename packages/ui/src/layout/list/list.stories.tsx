import type { Meta, StoryObj } from '@storybook/tanstack-react'
import { expect } from 'storybook/test'

import { computed } from '#/layout/layout-stories.tsx'
import { List, ListItem } from './list'

const meta = {
  component: List,
  parameters: { layout: 'centered' },
  args: {
    gap: '2',
    children: ['Draft', 'Published', 'Archived'].map((item) => (
      <ListItem key={item}>{item}</ListItem>
    )),
  },
} satisfies Meta<typeof List>

export default meta
type Story = StoryObj<typeof meta>

/** No bullets or indent, and a 0.5rem gap between items. */
export const Default: Story = {
  play: async ({ canvasElement }) => {
    const list = canvasElement.querySelector('[data-slot="list"]')
    await expect(list?.tagName).toBe('UL')
    await expect(computed(list, 'list-style-type')).toBe('none')
    await expect(computed(list, 'padding-left')).toBe('0px')
    await expect(computed(list, 'gap')).toBe('8px')
  },
}

/** An ordered list keeps its numbers. */
export const Ordered: Story = {
  args: { render: <ol />, marker: 'decimal' },
  play: async ({ canvasElement }) => {
    const list = canvasElement.querySelector('[data-slot="list"]')
    await expect(list?.tagName).toBe('OL')
    await expect(computed(list, 'list-style-type')).toBe('decimal')
  },
}

/** `divided` draws a rule between items, not under the last. */
export const Divided: Story = {
  args: { variant: 'divided' },
  play: async ({ canvasElement }) => {
    const items = canvasElement.querySelectorAll('[data-slot="list-item"]')
    await expect(computed(items[0] ?? null, 'border-bottom-width')).toBe('1px')
    await expect(computed(items[2] ?? null, 'border-bottom-width')).toBe('0px')
  },
}
