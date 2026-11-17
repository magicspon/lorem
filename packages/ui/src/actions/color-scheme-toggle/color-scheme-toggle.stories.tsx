import * as React from 'react'
import type { Meta, StoryObj } from '@storybook/tanstack-react'
import { expect, fn, userEvent as user, within } from 'storybook/test'

import { Box } from '#/layout/index.ts'
import { darkTheme, lightTheme } from '#/styles/themes.ts'
import {
  ColorSchemeToggle,
  type ColorScheme,
  useSystemColorScheme,
} from './color-scheme-toggle'

const meta = {
  component: ColorSchemeToggle,
  args: { value: null, onValueChange: fn() },
} satisfies Meta<typeof ColorSchemeToggle>

export default meta

type Story = StoryObj<typeof meta>

/** Following the system, a press picks the other scheme. */
export const FollowingTheSystem: Story = {
  play: async ({ args, canvasElement }) => {
    const other = window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'light'
      : 'dark'
    const button = within(canvasElement).getByRole('button', {
      name: `Use the ${other} theme`,
    })
    await user.click(button)
    await expect(args.onValueChange).toHaveBeenCalledWith(other)
  },
}

/** With a scheme picked, a press goes back to the system's. */
export const Picked: Story = {
  args: { value: 'dark' },
  play: async ({ args, canvasElement }) => {
    const button = within(canvasElement).getByRole('button', {
      name: /^Use the system theme/,
    })
    await user.click(button)
    await expect(args.onValueChange).toHaveBeenCalledWith(null)
  },
}

/** Two presses go out to the other scheme and back to the system. */
export const RoundTrip: Story = {
  render: function Render() {
    const [value, setValue] = React.useState<ColorScheme | null>(null)
    const system = useSystemColorScheme()
    const scheme = { light: lightTheme, dark: darkTheme }
    return (
      <Box p="4" sx={value && scheme[value]}>
        <ColorSchemeToggle value={value} onValueChange={setValue} />
        <output>{value ?? `system (${system})`}</output>
      </Box>
    )
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const button = canvas.getByRole('button')
    await user.click(button)
    await expect(canvas.getByRole('status')).not.toHaveTextContent('system')
    await user.click(button)
    await expect(canvas.getByRole('status')).toHaveTextContent('system')
  },
}
