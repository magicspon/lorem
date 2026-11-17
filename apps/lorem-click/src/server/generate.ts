import { createServerFn } from '@tanstack/react-start'

import { generateLorem, loremRequest } from '#/lorem/index.ts'

/**
 * Makes the text on the server, so faker and its word lists never reach the
 * browser's bundle.
 */
export const generate = createServerFn({ method: 'GET' })
  .validator(loremRequest)
  .handler(({ data }) => generateLorem(data))
