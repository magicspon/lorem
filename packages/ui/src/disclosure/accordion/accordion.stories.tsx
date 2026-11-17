import type { Meta, StoryObj } from '@storybook/tanstack-react'
import * as stylex from '@stylexjs/stylex'
import { expect } from 'storybook/test'

import * as Accordion from './index.ts'

const styles = stylex.create({
  accordion: { maxWidth: '32rem' },
})

const ITEMS = [
  {
    value: 'shipping',
    title: 'What are your shipping options?',
    content:
      'We offer standard (5-7 days), express (2-3 days) and overnight shipping.',
  },
  {
    value: 'returns',
    title: 'What is your return policy?',
    content:
      'Return any unused item in its original packaging within 30 days for a full refund.',
  },
  {
    value: 'support',
    title: 'How can I contact support?',
    content: 'Email, live chat or phone. We reply within 24 hours.',
  },
]

/** The three items, with the one holding `disabledValue` disabled. */
const Items = ({ disabledValue }: { disabledValue?: string }) =>
  ITEMS.map((item) => (
    <Accordion.Item
      key={item.value}
      value={item.value}
      disabled={item.value === disabledValue}
    >
      <Accordion.Trigger>{item.title}</Accordion.Trigger>
      <Accordion.Content>
        <p>{item.content}</p>
      </Accordion.Content>
    </Accordion.Item>
  ))

const meta = {
  component: Accordion.Root,
  args: { multiple: false, disabled: false, keepMounted: false },
  render: (args) => (
    <Accordion.Root {...args} sx={styles.accordion}>
      <Items />
    </Accordion.Root>
  ),
} satisfies Meta<typeof Accordion.Root>

export default meta

type Story = StoryObj<typeof meta>

/** One item open at a time: expanding another collapses the first. */
export const Default: Story = {
  play: async ({ canvas, userEvent }) => {
    const shipping = canvas.getByRole('button', {
      name: 'What are your shipping options?',
    })
    const returns = canvas.getByRole('button', {
      name: 'What is your return policy?',
    })

    await userEvent.click(shipping)
    await expect(shipping).toHaveAttribute('aria-expanded', 'true')
    await expect(
      await canvas.findByRole('region', {
        name: 'What are your shipping options?',
      }),
    ).toBeVisible()

    await userEvent.click(returns)
    await expect(returns).toHaveAttribute('aria-expanded', 'true')
    await expect(shipping).toHaveAttribute('aria-expanded', 'false')
  },
}

/** Starts with an item expanded, so it is visible without interaction. */
export const Open: Story = {
  args: { defaultValue: ['shipping'] },
  play: async ({ canvas }) => {
    await expect(
      canvas.getByRole('region', { name: 'What are your shipping options?' }),
    ).toBeVisible()
  },
}

/** `multiple` lets several items stay expanded together. */
export const Multiple: Story = {
  args: { multiple: true },
  play: async ({ canvas, userEvent }) => {
    const shipping = canvas.getByRole('button', {
      name: 'What are your shipping options?',
    })
    const returns = canvas.getByRole('button', {
      name: 'What is your return policy?',
    })

    await userEvent.click(shipping)
    await userEvent.click(returns)
    await expect(shipping).toHaveAttribute('aria-expanded', 'true')
    await expect(returns).toHaveAttribute('aria-expanded', 'true')
  },
}

/** A disabled item can't be expanded; the others still work. */
export const Disabled: Story = {
  render: (args) => (
    <Accordion.Root {...args} sx={styles.accordion}>
      <Items disabledValue="support" />
    </Accordion.Root>
  ),
  play: async ({ canvas }) => {
    // Since Base UI 1.9 a native-button trigger takes the real `disabled` attribute.
    await expect(
      canvas.getByRole('button', { name: 'How can I contact support?' }),
    ).toBeDisabled()
  },
}
