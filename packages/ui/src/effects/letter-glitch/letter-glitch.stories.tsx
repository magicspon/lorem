import type { Meta, StoryObj } from '@storybook/tanstack-react'
import { expect } from 'storybook/test'

import { Box } from '#/layout/index.ts'
import { height } from '#/styles/sizing.ts'
import { LetterGlitch } from './letter-glitch'

const meta = {
  component: LetterGlitch,
  argTypes: {
    clickEffect: { control: 'select', options: ['tear', 'burst', 'none'] },
  },
  render: (args) => (
    <Box sx={height['96']}>
      <LetterGlitch {...args} />
    </Box>
  ),
} satisfies Meta<typeof LetterGlitch>

export default meta

type Story = StoryObj<typeof meta>

/** Fills its parent, here a box 384px tall. */
export const Default: Story = {
  play: async ({ canvasElement }) => {
    const root = canvasElement.querySelector('[data-slot="letter-glitch"]')
    await expect(root).toHaveAttribute('aria-hidden', 'true')
    await expect(root?.querySelector('canvas')).toBeInTheDocument()
  },
}

/** Clears the middle, so content laid over it stays readable. */
export const CenterFade: Story = {
  args: { centerFade: 0.9, edgeFade: 0.2 },
}

/** Faded to half, behind content. */
export const Faded: Story = {
  args: { opacity: 0.5 },
}

/** Glitching often, in brighter letters. */
export const Loud: Story = {
  args: { glitchAmount: 1, baseOpacity: 0.3, clickEffect: 'burst' },
}

/** Dark ink for a light background, whatever the system's scheme. */
export const LightMode: Story = {
  args: { lightMode: true },
}
