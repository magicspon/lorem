import type { Meta, StoryObj } from '@storybook/tanstack-react'
import * as stylex from '@stylexjs/stylex'
import { ChevronsUpDownIcon } from 'lucide-react'
import { expect } from 'storybook/test'

import { textStyles } from '#/typography/type-styles.ts'
import { colors, radii, size, space } from '../../styles/tokens.stylex'
import * as Collapsible from './index.ts'
import { Flex } from '#/layout/index.ts'
import { IconButton } from '#/actions/icon-button/index.ts'

const styles = stylex.create({
  root: {
    display: 'flex',
    width: size['80'],
    flexDirection: 'column',
    gap: space['2'],
  },
  heading: {
    fontWeight: 600,
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    gap: space['2'],
  },
  item: {
    borderRadius: radii.md,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: colors.border,
    paddingBlock: space['2'],
    paddingInline: space['4'],
    fontFamily: 'monospace',
  },
})

const meta = {
  component: Collapsible.Root,
  args: { defaultOpen: false },
  render: (args) => (
    <Collapsible.Root {...args} {...stylex.props(styles.root)}>
      <Flex align="center" justify="between" gap="4">
        <h4 sx={[textStyles['2'], styles.heading]}>
          @peduarte starred 3 repositories
        </h4>
        <Collapsible.Trigger
          render={
            <IconButton variant="ghost" size="sm" icon={<ChevronsUpDownIcon />}>
              Toggle
            </IconButton>
          }
        />
      </Flex>
      <div sx={[textStyles['2'], styles.item]}>@base-ui/react</div>
      <Collapsible.Content {...stylex.props(styles.content)}>
        <div sx={[textStyles['2'], styles.item]}>@stylexjs/stylex</div>
        <div sx={[textStyles['2'], styles.item]}>@tanstack/react-form</div>
      </Collapsible.Content>
    </Collapsible.Root>
  ),
} satisfies Meta<typeof Collapsible.Root>

export default meta

type Story = StoryObj<typeof meta>

/** Closed by default: expanding it reveals the two extra items. */
export const Default: Story = {
  play: async ({ canvas, userEvent }) => {
    const trigger = canvas.getByRole('button', { name: 'Toggle' })
    await expect(trigger).toHaveAttribute('aria-expanded', 'false')

    await userEvent.click(trigger)
    await expect(trigger).toHaveAttribute('aria-expanded', 'true')
    await expect(canvas.getByText('@stylexjs/stylex')).toBeVisible()
  },
}

/** Starts expanded, so the extra items are visible without interaction. */
export const Open: Story = {
  args: { defaultOpen: true },
  play: async ({ canvas }) => {
    await expect(canvas.getByText('@tanstack/react-form')).toBeVisible()
  },
}
