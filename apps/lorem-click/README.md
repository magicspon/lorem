# lorem-click

lorem.click: placeholder text to copy and paste. A rebuild of
[cplo](https://github.com/magicspon/cplo) on TanStack Start, using `@repo/ui` for every
component. It lives here to start quickly and will move to its own repository.

## Run it

```sh
pnpm dev   # http://localhost:3001
```

## How it works

- The address is the request: `/?count=3&kind=paragraphs`. A value at its default (10 words)
  is left out, and a missing or bad one falls back to it. Old links like `/10/words` redirect.
- The form updates the text by itself once the controls rest for 250 ms; Enter updates at once.
- `src/lorem/` holds the kinds, the schemas (`loremRequest`, counts 1 to 100, and `loremSearch`
  for the query) and `generateLorem`, which calls `faker.lorem`.
- `src/server/generate.ts` runs the generator on the server, so faker stays out of the browser's
  bundle. The route's loader calls it; New text runs the loader again.

## Deploy

Vercel deploys main, and a preview of each pull request, through its Git integration.
`nitro()` in `vite.config.ts` sees Vercel's build and writes Vercel's output. To set up the
project in Vercel:

- **Root Directory:** `apps/lorem-click`. Vercel installs from the workspace root.
- **Framework preset:** TanStack Start, or Other. The build command is `pnpm build`.
- **Node.js version:** the newest Vercel offers. The repo asks for Node 26 (`.nvmrc`).

GitHub Actions run the checks (`.github/workflows/ci.yml`) and the changesets release
(`.github/workflows/release.yml`). Make CI a required check on main, so a PR cannot merge when
it fails.

## Moving it out

It imports only `@repo/ui` at run time. `@repo/config` gives it the shared tsconfig, the
Vite plugins for StyleX and the Vitest project, so the new repository needs those, or copies of
them. `vite.config.ts` resolves StyleX from the repository root, which changes with the move.
