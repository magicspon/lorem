import type { Meta, StoryObj } from '@storybook/tanstack-react'
import { expect } from 'storybook/test'

import { Box } from './box'
import { computed, Tile } from '#/layout/layout-stories.tsx'

const meta = {
  component: Box,
  parameters: { layout: 'centered' },
  args: { p: '4', children: <Tile>Box</Tile> },
} satisfies Meta<typeof Box>

export default meta
type Story = StoryObj<typeof meta>

/** `p="4"` pads by step 4 of the space scale, 1rem. */
export const Default: Story = {
  play: async ({ canvasElement }) => {
    const box = canvasElement.querySelector('[data-slot="box"]')
    await expect(computed(box, 'padding-top')).toBe('16px')
  },
}

/** A longhand overrides the shorthand: `p="4"` then `pt="0"`. */
export const Longhand: Story = {
  args: { p: '4', pt: '0' },
  play: async ({ canvasElement }) => {
    const box = canvasElement.querySelector('[data-slot="box"]')
    await expect(computed(box, 'padding-top')).toBe('0px')
    await expect(computed(box, 'padding-bottom')).toBe('16px')
  },
}

/** `render` swaps the element and keeps the styles. */
export const Render: Story = {
  args: { render: <section />, display: 'inline-block' },
  play: async ({ canvasElement }) => {
    const box = canvasElement.querySelector('[data-slot="box"]')
    await expect(box?.tagName).toBe('SECTION')
    await expect(computed(box, 'display')).toBe('inline-block')
  },
}

/** `display` by breakpoint: hidden on a phone, shown from `md`. */
export const ResponsiveDisplay: Story = {
  args: { display: { initial: 'none', md: 'block' } },
  play: async ({ canvasElement }) => {
    const box = canvasElement.querySelector('[data-slot="box"]')
    await expect(computed(box, 'display')).toBe(
      window.matchMedia('(min-width: 48rem)').matches ? 'block' : 'none',
    )
  },
}
