import { previewParameters } from '@repo/config/storybook/preview'
import type { Preview } from '@storybook/tanstack-react'
import '../src/styles/globals.css'

const preview: Preview = {
  parameters: {
    ...previewParameters,
    // The introduction first, so Storybook opens on it.
    options: { storySort: { order: ['Introduction'] } },
  },
}

export default preview
