import { size } from '../../styles/tokens.stylex'
import type { Meta, StoryObj } from '@storybook/tanstack-react'
import * as stylex from '@stylexjs/stylex'
import { expect, screen } from 'storybook/test'

import * as Select from './index.ts'

const styles = stylex.create({
  trigger: { width: size['48'] },
})

const fruits = [
  { label: 'Apple', value: 'apple' },
  { label: 'Banana', value: 'banana' },
  { label: 'Blueberry', value: 'blueberry' },
  { label: 'Grapes', value: 'grapes' },
  { label: 'Pineapple', value: 'pineapple' },
]

const produce = [
  { label: 'Fruit', items: fruits.slice(0, 3) },
  {
    label: 'Vegetables',
    items: [
      { label: 'Broccoli', value: 'broccoli' },
      { label: 'Carrot', value: 'carrot' },
    ],
  },
]

const meta = {
  component: Select.Root,
  parameters: { layout: 'centered' },
  args: { items: fruits },
  render: (args) => (
    <Select.Root {...args}>
      <Select.Trigger sx={styles.trigger} aria-label="Fruit">
        <Select.Value placeholder="Select a fruit" />
      </Select.Trigger>
      <Select.Content>
        <Select.Group>
          {fruits.map((fruit) => (
            <Select.Item key={fruit.value} value={fruit.value}>
              {fruit.label}
            </Select.Item>
          ))}
        </Select.Group>
      </Select.Content>
    </Select.Root>
  ),
} satisfies Meta<typeof Select.Root>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ canvas, userEvent }) => {
    const trigger = canvas.getByRole('combobox', { name: 'Fruit' })
    await userEvent.click(trigger)

    // The list is portalled to `document.body`, outside the story canvas.
    await userEvent.click(await screen.findByRole('option', { name: 'Banana' }))
    await expect(trigger).toHaveTextContent('Banana')
  },
}

/** Labelled groups with a separator between them. */
export const Grouped: Story = {
  args: { items: produce.flatMap((group) => group.items) },
  render: (args) => (
    <Select.Root {...args}>
      <Select.Trigger sx={styles.trigger} aria-label="Produce">
        <Select.Value placeholder="Select produce" />
      </Select.Trigger>
      <Select.Content>
        {produce.map((group, index) => [
          index > 0 && <Select.Separator key={`${group.label}-separator`} />,
          <Select.Group key={group.label}>
            <Select.Label>{group.label}</Select.Label>
            {group.items.map((item) => (
              <Select.Item key={item.value} value={item.value}>
                {item.label}
              </Select.Item>
            ))}
          </Select.Group>,
        ])}
      </Select.Content>
    </Select.Root>
  ),
}

/** A shorter trigger. */
export const Small: Story = {
  render: (args) => (
    <Select.Root {...args}>
      <Select.Trigger size="sm" sx={styles.trigger} aria-label="Fruit">
        <Select.Value placeholder="Select a fruit" />
      </Select.Trigger>
      <Select.Content>
        {fruits.map((fruit) => (
          <Select.Item key={fruit.value} value={fruit.value}>
            {fruit.label}
          </Select.Item>
        ))}
      </Select.Content>
    </Select.Root>
  ),
}

export const Disabled: Story = {
  args: { disabled: true },
}
