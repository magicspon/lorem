import * as Toast from '@repo/ui/feedback/toast'

import { joinBlocks } from '#/lorem/index.ts'

/**
 * Returns a function that puts the text on the clipboard and says, in a toast,
 * whether it worked.
 */
export function useCopy(blocks: readonly string[]): () => Promise<void> {
  const toast = Toast.useToast()

  return async function copy() {
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
}
