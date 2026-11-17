import type { Meta, StoryObj } from '@storybook/tanstack-react'
import { expect } from 'storybook/test'
import * as stylex from '@stylexjs/stylex'

import { textStyles } from '#/typography/type-styles.ts'
import { size, space } from '../../styles/tokens.stylex'
import { Button } from '#/actions/button/index.ts'
import { Badge } from '#/data-display/badge/index.ts'
import * as Card from './index.ts'
import { Input } from '#/inputs/input/index.ts'

const styles = stylex.create({
  card: { width: size['96'] },
  stack: { display: 'flex', flexDirection: 'column', gap: space['4'] },
  field: {
    display: 'grid',
    gap: space['2'],
    fontWeight: 500,
  },
  footer: { flexDirection: 'column', gap: space['2'] },
  fullWidth: { width: '100%' },
  image: { aspectRatio: '16 / 9', width: '100%', objectFit: 'cover' },
})

const meta = {
  component: Card.Root,
  parameters: { layout: 'centered' },
  args: { size: 'default' },
  argTypes: {
    size: { control: 'inline-radio', options: ['default', 'sm'] },
  },
  render: (args) => (
    <Card.Root {...args} sx={styles.card}>
      <Card.Header>
        <Card.Title>Log in to your account</Card.Title>
        <Card.Description>Enter your email below to log in.</Card.Description>
        <Card.Action>
          <Button variant="link">Sign up</Button>
        </Card.Action>
      </Card.Header>
      <Card.Content>
        <form sx={styles.stack}>
          <label sx={[textStyles['2'], styles.field]}>
            Email
            <Input type="email" placeholder="you@example.com" />
          </label>
          <label sx={[textStyles['2'], styles.field]}>
            Password
            <Input type="password" />
          </label>
        </form>
      </Card.Content>
      <Card.Footer sx={styles.footer}>
        <Button sx={styles.fullWidth}>Log in</Button>
        <Button variant="outline" sx={styles.fullWidth}>
          Log in with Google
        </Button>
      </Card.Footer>
    </Card.Root>
  ),
} satisfies Meta<typeof Card.Root>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}

/** Tighter spacing between and around the parts. */
export const Small: Story = {
  args: { size: 'sm' },
}

/** An image as the first child sits flush with the top edge. */
export const WithImage: Story = {
  render: (args) => (
    <Card.Root {...args} sx={styles.card}>
      <img
        src="https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=800"
        alt="A mountain valley at sunrise"
        sx={styles.image}
      />
      <Card.Header>
        <Card.Title>Weekend in the mountains</Card.Title>
        <Card.Description>Two nights, guided hikes included.</Card.Description>
      </Card.Header>
      <Card.Footer>
        <Button sx={styles.fullWidth}>Book now</Button>
      </Card.Footer>
    </Card.Root>
  ),
}

/** A `stat` title: a headline figure under the label that names it. */
export const Stat: Story = {
  render: (args) => (
    <Card.Root {...args} sx={styles.card}>
      <Card.Header>
        <Card.Description>Total revenue</Card.Description>
        <Card.Title variant="stat">$45,231.89</Card.Title>
        <Card.Action>
          <Badge variant="outline">+20.1%</Badge>
        </Card.Action>
      </Card.Header>
    </Card.Root>
  ),
  play: async ({ canvasElement }) => {
    const action = canvasElement.querySelector('[data-slot="card-action"]')
    await expect(action).not.toBeNull()
    // The action keeps to the label's row, leaving the figure its own.
    if (action) await expect(getComputedStyle(action).gridRowEnd).toBe('span 1')
  },
}
