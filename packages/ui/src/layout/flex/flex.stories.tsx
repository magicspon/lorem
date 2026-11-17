import type { Meta, StoryObj } from '@storybook/tanstack-react'
import { expect } from 'storybook/test'

import { Flex } from './flex'
import { computed, Tile } from '#/layout/layout-stories.tsx'

const meta = {
  component: Flex,
  parameters: { layout: 'centered' },
  args: {
    gap: '3',
    align: 'center',
    children: [
      <Tile key="a">A</Tile>,
      <Tile key="b">B</Tile>,
      <Tile key="c">C</Tile>,
    ],
  },
  argTypes: {
    direction: {
      control: 'inline-radio',
      options: ['row', 'column', 'row-reverse', 'column-reverse'],
    },
    gap: {
      control: 'select',
      options: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
    },
  },
} satisfies Meta<typeof Flex>

export default meta
type Story = StoryObj<typeof meta>

/** A row with a 0.75rem gap. */
export const Default: Story = {
  play: async ({ canvasElement }) => {
    const flex = canvasElement.querySelector('[data-slot="flex"]')
    await expect(computed(flex, 'display')).toBe('flex')
    await expect(computed(flex, 'gap')).toBe('12px')
  },
}

/** `direction="column"` stacks the children. */
export const Column: Story = {
  args: { direction: 'column' },
  play: async ({ canvasElement }) => {
    const flex = canvasElement.querySelector('[data-slot="flex"]')
    await expect(computed(flex, 'flex-direction')).toBe('column')
  },
}

const wide = (query: string) => window.matchMedia(query).matches

/** `direction` and `gap` change at a breakpoint: a column on a phone, a row from `sm`. */
export const Responsive: Story = {
  args: {
    direction: { initial: 'column', sm: 'row' },
    gap: { initial: '1', lg: '5' },
  },
  play: async ({ canvasElement }) => {
    const flex = canvasElement.querySelector('[data-slot="flex"]')
    await expect(computed(flex, 'flex-direction')).toBe(
      wide('(min-width: 40rem)') ? 'row' : 'column',
    )
    await expect(computed(flex, 'gap')).toBe(
      wide('(min-width: 64rem)') ? '24px' : '4px',
    )
  },
}

/**
 * A responsive child reads only its own breakpoints: the parent sets a row at
 * every width, and the child, given only `initial`, stays a column.
 */
export const NestedResponsive: Story = {
  args: {
    direction: { initial: 'row', sm: 'row', md: 'row', lg: 'row' },
    children: (
      <Flex data-testid="child" direction={{ initial: 'column' }} gap="1">
        <Tile>1</Tile>
        <Tile>2</Tile>
      </Flex>
    ),
  },
  play: async ({ canvas }) => {
    await expect(computed(canvas.getByTestId('child'), 'flex-direction')).toBe(
      'column',
    )
  },
}
