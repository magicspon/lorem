import '@repo/ui/globals.css'

import * as Toast from '@repo/ui/feedback/toast'
import {
  createRootRoute,
  HeadContent,
  Link,
  Outlet,
  Scripts,
} from '@tanstack/react-router'
import type { ReactNode } from 'react'

import { appName } from '#/brand.ts'
import { defaultRequest } from '#/lorem/index.ts'

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { title: appName },
      { name: 'description', content: 'Lorem ipsum to copy and paste.' },
    ],
    links: [
      { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
      // The StyleX plugin serves its CSS from a virtual path in dev. A build
      // appends it to the bundled stylesheet, where a link would 404.
      ...(import.meta.env.DEV
        ? [{ rel: 'stylesheet', href: '/virtual:stylex.css' }]
        : []),
    ],
    // Refetches the dev sheet when a page reached by client navigation brings
    // rules it lacks. Start never renders `index.html`, where the plugin
    // would add this itself.
    scripts: import.meta.env.DEV
      ? [{ type: 'module', src: '/@id/virtual:stylex:runtime' }]
      : [],
  }),
  component: RootDocument,
  notFoundComponent: NotFound,
})

/** The document every page sits in. Every page can show toasts. */
function RootDocument(): ReactNode {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        <Toast.Provider>
          <Outlet />
        </Toast.Provider>
        <Scripts />
      </body>
    </html>
  )
}

/** Shown for any address no route matches. */
function NotFound(): ReactNode {
  return (
    <main>
      <p>
        There is nothing at this address.{' '}
        <Link to="/" search={defaultRequest}>
          Make some text
        </Link>
        .
      </p>
    </main>
  )
}
