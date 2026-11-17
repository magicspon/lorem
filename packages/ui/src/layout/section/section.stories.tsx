import type { Meta, StoryObj } from '@storybook/tanstack-react'
import { expect } from 'storybook/test'

import { computed, Tile } from '#/layout/layout-stories.tsx'
import { Section } from './section'

const meta = {
  component: Section,
  args: { size: '2', children: <Tile>Section</Tile> },
  argTypes: {
    size: { control: 'inline-radio', options: ['1', '2', '3'] },
  },
} satisfies Meta<typeof Section>

export default meta
type Story = StoryObj<typeof meta>

/** Size 2 pads the top and bottom by 2.5rem. */
export const Default: Story = {
  play: async ({ canvasElement }) => {
    const section = canvasElement.querySelector('[data-slot="section"]')
    await expect(section?.tagName).toBe('SECTION')
    await expect(computed(section, 'padding-top')).toBe('40px')
  },
}
