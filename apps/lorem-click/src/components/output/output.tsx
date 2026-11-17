import { Button } from '@repo/ui/actions/button'
import * as Toast from '@repo/ui/feedback/toast'
import { Flex, Stack } from '@repo/ui/layout'
import { Text } from '@repo/ui/typography/text'
import { CopyIcon, RefreshCwIcon } from 'lucide-react'
import type { ReactNode } from 'react'

import { joinBlocks } from '#/lorem/index.ts'

/** Props for {@link Output}. */
export type OutputProps = {
  /** The generated text, one paragraph or line per block. */
  blocks: readonly string[]
  /** Makes new text for the same request. */
  onRegenerate: () => void
}

/** The generated text, with buttons to copy it and to make it again. */
export function Output({ blocks, onRegenerate }: OutputProps): ReactNode {
  const toast = Toast.useToast()

  async function copy() {
    try {
      await navigator.clipboard.writeText(joinBlocks(blocks))
      toast.add({
        title: 'Copied',
        description: 'The text is on your clipboard.',
        type: 'success',
      })
    } catch {
      // Browsers refuse the clipboard on an insecure page or without focus.
      toast.add({
        title: 'Could not copy',
        description: 'Select the text and copy it yourself.',
        type: 'error',
      })
    }
  }

  return (
    <Stack gap="6" align="center">
      <Stack gap="5">
        {blocks.map((block, index) => (
          // Generated text can repeat, so the position is the stable key.
          // eslint-disable-next-line react/no-array-index-key
          <Text key={index} size="5" render={<p />}>
            {block}
          </Text>
        ))}
      </Stack>
      <Flex gap="2">
        <Button onClick={() => void copy()}>
          <CopyIcon aria-hidden />
          Copy
        </Button>
        <Button variant="ghost" onClick={onRegenerate}>
          <RefreshCwIcon aria-hidden />
          New text
        </Button>
      </Flex>
    </Stack>
  )
}
