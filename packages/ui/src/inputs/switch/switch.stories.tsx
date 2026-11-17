import type { Meta, StoryObj } from '@storybook/tanstack-react'
import * as stylex from '@stylexjs/stylex'
import { expect } from 'storybook/test'

import { textStyles } from '#/typography/type-styles.ts'
import { space } from '../../styles/tokens.stylex'
import { Switch } from './switch'
import { Flex } from '#/layout/index.ts'

const styles = stylex.create({
  row: { display: 'flex', alignItems: 'center', gap: space['2'] },
})

const meta = {
  component: Switch,
  args: {
    size: 'default',
    disabled: false,
    'aria-label': 'Airplane mode',
  },
  argTypes: {
    size: { control: 'inline-radio', options: ['sm', 'default'] },
  },
  render: (args) => (
    <div sx={[styles.row, textStyles['2']]}>
      <Switch {...args} />
      <span>Airplane mode</span>
    </div>
  ),
} satisfies Meta<typeof Switch>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ canvas, userEvent }) => {
    const control = canvas.getByRole('switch', { name: 'Airplane mode' })
    await expect(control).toHaveAttribute('aria-checked', 'false')

    await userEvent.click(control)
    await expect(control).toHaveAttribute('aria-checked', 'true')
  },
}

export const Checked: Story = {
  args: { defaultChecked: true },
}

export const Sizes: Story = {
  render: (args) => (
    <Flex align="center" gap="2">
      {(['sm', 'default'] as const).map((size) => (
        <Switch key={size} {...args} size={size} aria-label={size} />
      ))}
    </Flex>
  ),
}

export const Disabled: Story = {
  args: { disabled: true },
}

/** `aria-invalid` shows the error ring. */
export const Invalid: Story = {
  args: { 'aria-invalid': true },
}
