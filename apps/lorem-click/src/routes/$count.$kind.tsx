import { createFileRoute, redirect } from '@tanstack/react-router'

import { loremSearch } from '#/lorem/index.ts'

/**
 * The old address, `/10/words`, from before the request moved to the query.
 * Kept so links people shared still open the text they asked for.
 */
export const Route = createFileRoute('/$count/$kind')({
  beforeLoad: ({ params }) => {
    throw redirect({
      to: '/',
      search: loremSearch.parse(params),
      statusCode: 301,
    })
  },
})
