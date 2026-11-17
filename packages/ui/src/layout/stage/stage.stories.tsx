import type { Meta, StoryObj } from '@storybook/tanstack-react'
import { expect } from 'storybook/test'

import { Text } from '#/typography/text/index.ts'
import { computed } from '#/layout/layout-stories.tsx'
import * as Stage from './index.ts'

const LINES = Array.from({ length: 40 }, (_, index) => index)

const meta = {
  component: Stage.Front,
  parameters: { layout: 'fullscreen' },
  render: (args) => (
    <>
      <Stage.Back cursor="copy" p="6">
        {LINES.map((line) => (
          <Text key={line} render={<p />}>
            Line {line + 1} of the content behind the panel.
          </Text>
        ))}
      </Stage.Back>
      <Stage.Front {...args}>
        <Text>The floating panel</Text>
      </Stage.Front>
    </>
  ),
  args: { p: '6' },
} satisfies Meta<typeof Stage.Front>

export default meta
type Story = StoryObj<typeof meta>

/** The panel floats in the middle of the window, over content that scrolls. */
export const Default: Story = {
  play: async ({ canvasElement }) => {
    const back = canvasElement.querySelector('[data-slot="stage-back"]')
    const front = canvasElement.querySelector('[data-slot="stage-front"]')
    await expect(computed(back, 'position')).toBe('fixed')
    await expect(computed(back, 'cursor')).toBe('copy')
    await expect(computed(front, 'position')).toBe('fixed')
    // Centred: the gaps on its left and right match.
    const box = front?.getBoundingClientRect()
    if (!box) throw new Error('No front panel')
    await expect(Math.round(box.left)).toBe(
      Math.round(window.innerWidth - box.right),
    )
  },
}
