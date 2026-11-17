import { IconButton } from '@repo/ui/actions/icon-button'
import { ScrambledText } from '@repo/ui/effects/scrambled-text'
import { Flex, Stack } from '@repo/ui/layout'
import { Text } from '@repo/ui/typography/text'
import type { TextSize } from '@repo/ui/typography/type-styles'
import { CopyIcon, RefreshCwIcon } from 'lucide-react'
import type { ReactNode } from 'react'

/** Props for {@link Output}. */
export type OutputProps = {
  /** The generated text, one paragraph per block. */
  blocks: readonly string[]
  /** The type-scale step to show it at. */
  size: TextSize
}

/** The generated text, one paragraph per block. */
export function Output({ blocks, size }: OutputProps): ReactNode {
  return (
    <Stack gap="5">
      {blocks.map((block, index) => (
        // Generated text can repeat, so the position is the stable key.
        // eslint-disable-next-line react/no-array-index-key
        <Text key={index} size={size} render={<p />}>
          {/* A click on the page copies the text, and sends a scramble out
              from where it landed, to show it happened. */}
          <ScrambledText>{block}</ScrambledText>
        </Text>
      ))}
    </Stack>
  )
}

/** Props for {@link OutputActions}. */
export type OutputActionsProps = {
  /** Puts the text on the clipboard. */
  onCopy: () => void
  /** Makes new text for the same request. */
  onRegenerate: () => void
}

/**
 * Buttons to copy the text and to make it again. Clicking the page copies
 * too, but only these reach a keyboard.
 */
export function OutputActions({
  onCopy,
  onRegenerate,
}: OutputActionsProps): ReactNode {
  return (
    <Flex gap="1" shrink={false}>
      <IconButton type="button" icon={<CopyIcon />} onClick={onCopy}>
        Copy
      </IconButton>
      <IconButton
        type="button"
        variant="ghost"
        icon={<RefreshCwIcon />}
        onClick={onRegenerate}
      >
        New text
      </IconButton>
    </Flex>
  )
}
