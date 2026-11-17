import type { Meta, StoryObj } from '@storybook/tanstack-react'

import { Code } from './code'
import { Text } from '../text/index.ts'

const meta = {
  component: Code,
  args: { children: 'organization_id' },
} satisfies Meta<typeof Code>

export default meta

type Story = StoryObj<typeof meta>

/** Inline, inside a sentence. */
export const Default: Story = {
  render: (args) => (
    <Text render={<p />}>
      Every app table has a required <Code {...args} /> column.
    </Text>
  ),
}

/** A snippet as its own block, in a `pre`. */
export const Block: Story = {
  args: {
    block: true,
    render: <pre />,
    children: 'pnpm --filter @repo/database db:generate',
  },
}
