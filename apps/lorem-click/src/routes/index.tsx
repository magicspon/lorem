import { Container, Stack } from '@repo/ui/layout'
import {
  createFileRoute,
  stripSearchParams,
  useRouter,
} from '@tanstack/react-router'
import type { ReactNode } from 'react'

import { GeneratorForm } from '#/components/generator/index.ts'
import { Output } from '#/components/output/index.ts'
import { defaultRequest, loremSearch } from '#/lorem/index.ts'
import { generate } from '#/server/generate.ts'

/**
 * `/?count=3&kind=paragraphs`. The query is the request, so every page is a
 * link; a value at its default is left out. The loader asks the server for the
 * text, and the first page arrives with it, so hydration never makes other text.
 */
export const Route = createFileRoute('/')({
  validateSearch: loremSearch,
  search: { middlewares: [stripSearchParams(defaultRequest)] },
  loaderDeps: ({ search }) => search,
  loader: async ({ deps }) => ({
    request: deps,
    blocks: await generate({ data: deps }),
  }),
  component: GeneratePage,
})

function GeneratePage(): ReactNode {
  const { request, blocks } = Route.useLoaderData()
  const navigate = Route.useNavigate()
  const router = useRouter()

  return (
    <Container size="2" px="6" py="9" render={<main />}>
      <Stack gap="9">
        <GeneratorForm
          request={request}
          // Replace, so each change does not add a step to Back.
          onGenerate={(search) => void navigate({ search, replace: true })}
        />
        {/* Running the loader again makes new text for the same address. */}
        <Output blocks={blocks} onRegenerate={() => void router.invalidate()} />
      </Stack>
    </Container>
  )
}
