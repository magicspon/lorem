import type { Meta, StoryObj } from '@storybook/tanstack-react'
import { expect } from 'storybook/test'

import { Grid } from './grid'
import { computed, Tile } from '#/layout/layout-stories.tsx'

const meta = {
  component: Grid,
  args: {
    columns: '3',
    gap: '4',
    children: Array.from({ length: 6 }, (_, i) => <Tile key={i}>{i + 1}</Tile>),
  },
} satisfies Meta<typeof Grid>

export default meta
type Story = StoryObj<typeof meta>

/** Three equal columns with a 1rem gap. */
export const Default: Story = {
  play: async ({ canvasElement }) => {
    const grid = canvasElement.querySelector('[data-slot="grid"]')
    const tracks = computed(grid, 'grid-template-columns').split(' ')
    await expect(tracks).toHaveLength(3)
    await expect(computed(grid, 'row-gap')).toBe('16px')
  },
}

/** `gapX` and `gapY` set the two gaps apart. */
export const SplitGaps: Story = {
  args: { gap: undefined, gapX: '6', gapY: '1' },
  play: async ({ canvasElement }) => {
    const grid = canvasElement.querySelector('[data-slot="grid"]')
    await expect(computed(grid, 'column-gap')).toBe('32px')
    await expect(computed(grid, 'row-gap')).toBe('4px')
  },
}

/** One column on a phone, three from `md`. */
export const ResponsiveColumns: Story = {
  args: { columns: { initial: '1', md: '3' } },
  play: async ({ canvasElement }) => {
    const grid = canvasElement.querySelector('[data-slot="grid"]')
    const tracks = computed(grid, 'grid-template-columns').split(' ')
    await expect(tracks).toHaveLength(
      window.matchMedia('(min-width: 48rem)').matches ? 3 : 1,
    )
  },
}

/** As many 12rem columns as fit; the grid reflows with its own width. */
export const MinChildWidth: Story = {
  args: { columns: undefined, minChildWidth: '48', style: { width: 640 } },
  play: async ({ canvasElement }) => {
    const grid = canvasElement.querySelector('[data-slot="grid"]')
    // 640px holds three 192px columns and their two 16px gaps, not four.
    const tracks = computed(grid, 'grid-template-columns').split(' ')
    await expect(tracks).toHaveLength(3)
  },
}

/** `main-aside`: one column, then a wide one and a narrow one from `lg`. */
export const MainAside: Story = {
  args: {
    columns: undefined,
    template: 'main-aside',
    children: [<Tile key="main">Main</Tile>, <Tile key="aside">Aside</Tile>],
  },
  play: async ({ canvasElement }) => {
    const grid = canvasElement.querySelector('[data-slot="grid"]')
    const tracks = computed(grid, 'grid-template-columns').split(' ')
    const wide = window.matchMedia('(min-width: 64rem)').matches
    await expect(tracks).toHaveLength(wide ? 2 : 1)
  },
}

/** `label-value`: a first column as wide as its longest label. */
export const LabelValue: Story = {
  args: {
    columns: undefined,
    template: 'label-value',
    gapX: '5',
    gapY: '2',
    gap: undefined,
    render: <dl />,
    children: [
      <dt key="id-term">Customer ID</dt>,
      <dd key="id">cus_1042</dd>,
      <dt key="seen-term">Last seen</dt>,
      <dd key="seen">2 hours ago</dd>,
    ],
  },
  play: async ({ canvasElement }) => {
    const grid = canvasElement.querySelector('[data-slot="grid"]')
    const tracks = computed(grid, 'grid-template-columns').split(' ')
    await expect(tracks).toHaveLength(2)
  },
}
