import * as stylex from '@stylexjs/stylex'

import { Flex } from '#/layout/index.ts'
import { Separator } from '#/layout/separator/index.ts'
import { Heading } from '#/typography/heading/index.ts'
import { Text } from '#/typography/text/index.ts'
import type { TextSize } from '#/typography/type-styles.ts'
import {
  colors,
  fontSize,
  lineHeight,
  radii,
  size,
  space,
  type Space,
} from '../styles/tokens.stylex'
import { Frame } from './scheme-pair'

const TYPE_STEPS = ['1', '2', '3', '4', '5', '6', '7', '8', '9'] as const
const SPACE_STEPS = ['1', '2', '3', '4', '5', '6', '7', '8', '9'] as const

const styles = stylex.create({
  label: { width: size['40'], flexShrink: 0 },
  bar: (width: string) => ({
    width,
    height: size['4'],
    borderRadius: radii.sm,
    backgroundColor: colors.primary,
  }),
})

/** Each step of the type scale, with its size and line height. */
export function TypeScale() {
  return (
    <Frame>
      {TYPE_STEPS.map((step: TextSize) => (
        <Flex key={step} align="center" gap="4">
          <Text size="1" tone="muted" sx={styles.label}>
            {step} · {fontSize[step]} / {lineHeight[step]}
          </Text>
          <Text size={step} truncate>
            The quick brown fox jumps over the lazy dog
          </Text>
        </Flex>
      ))}
    </Frame>
  )
}

/** Headings at their default sizes, and the text tones and weights. */
export function TypeExamples() {
  return (
    <Frame>
      <Heading level={1}>Heading level 1</Heading>
      <Heading level={2}>Heading level 2</Heading>
      <Heading level={3}>Heading level 3</Heading>
      <Separator />
      <Text size="3">
        Body text at step 3. <Text weight="semibold">Semibold</Text>,{' '}
        <Text tone="muted">muted</Text>, <Text tone="accent">accent</Text> and{' '}
        <Text tone="destructive">destructive</Text>.
      </Text>
    </Frame>
  )
}

/** Each step of the space scale, drawn as a bar of its length. */
export function SpaceScale() {
  return (
    <Frame>
      {SPACE_STEPS.map((step: Space) => (
        <Flex key={step} align="center" gap="4">
          <Text size="1" tone="muted" sx={styles.label}>
            {step} · {space[step]}
          </Text>
          <div sx={styles.bar(space[step])} />
        </Flex>
      ))}
    </Frame>
  )
}
