import type { Meta, StoryObj } from '@storybook/tanstack-react'
import { CheckIcon } from 'lucide-react'

import { Badge } from './badge'
import { Flex } from '#/layout/index.ts'

const variants = [
  'default',
  'secondary',
  'destructive',
  'outline',
  'ghost',
  'link',
] as const

const meta = {
  component: Badge,
  args: { children: 'Badge', variant: 'default' },
  argTypes: {
    variant: { control: 'select', options: variants },
  },
} satisfies Meta<typeof Badge>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Variants: Story = {
  render: (args) => (
    <Flex wrap="wrap" align="center" gap="2">
      {variants.map((variant) => (
        <Badge key={variant} {...args} variant={variant}>
          {variant}
        </Badge>
      ))}
    </Flex>
  ),
}

/** `data-icon` tightens the padding on the icon's side. */
export const WithIcon: Story = {
  render: (args) => (
    <Badge {...args}>
      <CheckIcon data-icon="inline-start" />
      Verified
    </Badge>
  ),
}

/** `render` swaps the `span` for another element, here a link. */
export const AsLink: Story = {
  args: { render: <a href="#badge" />, children: 'Open link' },
}
