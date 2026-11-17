import { createFileRoute } from '@tanstack/react-router'

import { appName } from '#/brand.ts'

// Served from a route rather than `public/`, so the product's name comes
// from `brand.ts` like everywhere else. See https://humanstxt.org.
const body = `/* TEAM */
Developer: David Stockley
GitHub: https://github.com/magicspon

/* THANKS */
Geist Mono, by Vercel
Radix Colors, for the palette
React Bits, for the letter glitch and scrambled text: https://reactbits.dev

/* SITE */
Name: ${appName}
Language: English
Standards: HTML, CSS, TypeScript
Components: React, TanStack Start, Base UI, StyleX
`

/** `/humans.txt`: the people and tools behind the site, as plain text. */
export const Route = createFileRoute('/humans.txt')({
  server: {
    handlers: {
      GET: () =>
        new Response(body, {
          headers: {
            'Content-Type': 'text/plain; charset=utf-8',
            // It changes only with a deploy, so a day's caching is safe.
            'Cache-Control': 'public, max-age=86400',
          },
        }),
    },
  },
})
