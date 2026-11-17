import { LetterGlitch } from '@repo/ui/effects/letter-glitch'
import { Container } from '@repo/ui/layout'
import * as Stage from '@repo/ui/layout/stage'
import {
  createFileRoute,
  stripSearchParams,
  useRouter,
} from '@tanstack/react-router'
import type { ReactNode } from 'react'

import { GeneratorForm } from '#/components/generator/index.ts'
import { Output, OutputActions, useCopy } from '#/components/output/index.ts'
import {
  defaultRequest,
  generateLorem,
  loremSearch,
  textScale,
} from '#/lorem/index.ts'

/**
 * `/?count=3&kind=paragraphs`. The query is the request, so every page is a
 * link; a value at its default is left out. The browser makes the text, so
 * the page works offline: the server sends the same shell for every address,
 * which the service worker keeps (`public/sw.js`).
 */
export const Route = createFileRoute('/')({
  validateSearch: loremSearch,
  search: { middlewares: [stripSearchParams(defaultRequest)] },
  // Not rendered on the server, so no address's text is baked into the HTML
  // and one saved page can open any link offline.
  ssr: false,
  loaderDeps: ({ search }) => search,
  loader: ({ deps }) => ({ request: deps, blocks: generateLorem(deps) }),
  component: GeneratePage,
})

function GeneratePage(): ReactNode {
  const { request, blocks } = Route.useLoaderData()
  const navigate = Route.useNavigate()
  const router = useRouter()
  const copy = useCopy(blocks)

  // A click that ends a drag to select text is left alone, so the person can
  // still copy part of it themselves.
  function copyOnClick() {
    if (window.getSelection()?.isCollapsed === false) return
    void copy()
  }

  return (
    <>
      {/* Faded, so the form and the text read clearly over it. */}
      <LetterGlitch variant="backdrop" edgeFade={0.1} opacity={0.4} />
      {/* The text fills the page behind the form; a click anywhere on it
          copies. The keyboard copies with the button in the form. */}
      <Stage.Back cursor="copy" align="center" onClick={copyOnClick}>
        <Container size="3" px="6" py="9">
          {/* The less text, the bigger it shows. */}
          <Output blocks={blocks} scale={textScale(request)} />
        </Container>
      </Stage.Back>
      <Stage.Front px="4" py="3" render={<main />}>
        <GeneratorForm
          request={request}
          // Replace, so each change does not add a step to Back.
          onGenerate={(search) => void navigate({ search, replace: true })}
          actions={
            // Running the loader again makes new text for the same address.
            <OutputActions
              onCopy={() => void copy()}
              onRegenerate={() => void router.invalidate()}
            />
          }
        />
      </Stage.Front>
    </>
  )
}
