import type { Meta, StoryObj } from '@storybook/tanstack-react'
import * as stylex from '@stylexjs/stylex'
import type { ReactNode } from 'react'

import { Button } from '#/actions/button/index.ts'
import { Checkbox } from '#/inputs/checkbox/index.ts'
import { Input } from '#/inputs/input/index.ts'
import * as RadioGroup from '#/inputs/radio-group/index.ts'
import { Flex, Stack } from '#/layout/index.ts'
import { Text } from '#/typography/text/index.ts'
import { size } from '../styles/tokens.stylex'
import { Frame } from './scheme-pair'

const STATES = ['default', 'hover', 'active', 'focus', 'disabled'] as const
type State = (typeof STATES)[number]

// The control each row draws, as `pseudo-states` must find it to force a state.
const CONTROLS = ':is(button, input, [role=checkbox], [role=radio])'
const column = (state: State) => `[data-state-column="${state}"] ${CONTROLS}`

const styles = stylex.create({
  grid: {
    display: 'grid',
    gridTemplateColumns: `${size['24']} repeat(5, minmax(0, 1fr))`,
    columnGap: size['4'],
    rowGap: size['5'],
    alignItems: 'center',
  },
})

/** One row: a label, then the same control once per state. */
const ROWS: { label: string; render: (disabled: boolean) => ReactNode }[] = [
  {
    label: 'Button',
    render: (disabled) => <Button disabled={disabled}>Save</Button>,
  },
  {
    label: 'Outline button',
    render: (disabled) => (
      <Button variant="outline" disabled={disabled}>
        Cancel
      </Button>
    ),
  },
  {
    label: 'Checkbox',
    render: (disabled) => (
      <Flex gap="3">
        <Checkbox aria-label="Off" disabled={disabled} />
        <Checkbox aria-label="On" defaultChecked disabled={disabled} />
      </Flex>
    ),
  },
  {
    label: 'Radio',
    render: (disabled) => (
      <RadioGroup.Root defaultValue="b" disabled={disabled} aria-label="Radio">
        <Flex gap="3">
          <RadioGroup.Item value="a" aria-label="Off" />
          <RadioGroup.Item value="b" aria-label="On" />
        </Flex>
      </RadioGroup.Root>
    ),
  },
  {
    label: 'Text input',
    render: (disabled) => (
      <Input aria-label="Name" placeholder="Name" disabled={disabled} />
    ),
  },
]

function StateGrid({ scheme }: { scheme: 'light' | 'dark' }) {
  return (
    <Frame scheme={scheme}>
      <Text size="1" tone="muted" weight="medium">
        {scheme === 'light' ? 'Light' : 'Dark'}
      </Text>
      <div sx={styles.grid}>
        <span />
        {STATES.map((state) => (
          <Text key={state} size="1" tone="muted">
            {state}
          </Text>
        ))}
        {ROWS.flatMap(({ label, render }) => [
          <Text key={label} size="2">
            {label}
          </Text>,
          ...STATES.map((state) => (
            <div key={`${label}-${state}`} data-state-column={state}>
              {render(state === 'disabled')}
            </div>
          )),
        ])}
      </div>
    </Frame>
  )
}

/**
 * Every basic control in each state. Browsers can't be told to show a state,
 * so `storybook-addon-pseudo-states` rewrites the `:hover`, `:active` and
 * `:focus-visible` rules into classes and sets them on each column.
 */
const meta = {
  title: 'Design system/Interactive states',
  parameters: {
    pseudo: {
      hover: column('hover'),
      active: column('active'),
      focusVisible: column('focus'),
    },
  },
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

/** The grid in both schemes. */
export const States: Story = {
  render: () => (
    <Stack gap="0">
      <StateGrid scheme="light" />
      <StateGrid scheme="dark" />
    </Stack>
  ),
}
