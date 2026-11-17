import type { Meta, StoryObj } from '@storybook/tanstack-react'
import * as stylex from '@stylexjs/stylex'
import { expect } from 'storybook/test'

import { textStyles } from '#/typography/type-styles.ts'
import { colors, size, space } from '../../styles/tokens.stylex'
import { Separator } from './separator'

const styles = stylex.create({
  frame: {
    maxWidth: size['60'],
  },
  title: { fontWeight: 500 },
  muted: { color: colors.mutedForeground },
  separator: { marginBlock: space['4'] },
  links: {
    display: 'flex',
    height: size['5'],
    alignItems: 'center',
    gap: space['4'],
  },
  inlineLinks: {
    display: 'flex',
    height: size['5'],
    alignItems: 'center',
    gap: space['4'],
  },
})

const meta = {
  component: Separator,
  render: (args) => (
    <div sx={[textStyles['2'], styles.frame]}>
      <div sx={styles.title}>Base UI</div>
      <div sx={styles.muted}>An open-source UI library.</div>
      <Separator {...args} sx={styles.separator} />
      <div sx={styles.links}>
        <span>Blog</span>
        <Separator orientation="vertical" />
        <span>Docs</span>
        <Separator orientation="vertical" />
        <span>Source</span>
      </div>
    </div>
  ),
} satisfies Meta<typeof Separator>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const rules = canvasElement.querySelectorAll('[data-slot="separator"]')
    await expect(rules).toHaveLength(3)
    // The vertical rules stretch to the row's height.
    const vertical = rules[1]
    await expect(vertical?.getBoundingClientRect().height).toBe(20)
  },
}

export const Vertical: Story = {
  render: (args) => (
    <div sx={[textStyles['2'], styles.inlineLinks]}>
      <span>Blog</span>
      <Separator {...args} orientation="vertical" />
      <span>Docs</span>
    </div>
  ),
}
