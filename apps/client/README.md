# lorem-click

lorem.click: placeholder text to copy and paste. Built on TanStack Start, using `@repo/ui` for
every component.

## Run it

```sh
pnpm dev   # http://localhost:3001
pnpm dev:portless   # https://lorem-click.localhost, one address per worktree
```

## How it works

- The address is the request: `/?count=3&kind=paragraphs`. A value at its default (10 words)
  is left out, and a missing or bad one falls back to it. Old links like
  `/10/words` redirect.
- The form updates the text by itself once the controls rest for 250 ms; Enter updates at once.
- `src/lorem/` holds the kinds, the schemas (`loremRequest`, counts 1 to 100, and `loremSearch`
  for the query) and `generateLorem`. It picks from faker's English word list (`words.ts`)
  with faker's ranges, but without faker, which cannot be tree-shaken and would add about 150 KB.
- The browser makes the text. The home route has `ssr: false`, so the server sends the same
  shell for every address. The route's loader calls `generateLorem`; New text runs it again.

## Offline

`src/service-worker/` holds a hand-written service worker. `serviceWorker()` in
`vite.config.ts` writes it to `/sw.js` in a build, with the list of every built file and
`public/` file, and writes `/manifest.webmanifest`. The worker keeps them all when it
installs. Pages come from the network first, and from the kept shell when offline. Each
build gets a new cache, and the old one is cleared. Dev registers no worker: try it with
`pnpm build && pnpm start`.

## Deploy

Vercel deploys main, and a preview of each pull request, through its Git integration.
`nitro()` in `vite.config.ts` sees Vercel's build and writes Vercel's output. To set up the
project in Vercel:

- **Root Directory:** `apps/client`. Vercel installs from the workspace root.
- **Framework preset:** TanStack Start, or Other. The build command is `pnpm build`.
- **Node.js version:** the newest Vercel offers. The repo asks for Node 26 (`.nvmrc`).

GitHub Actions run the checks (`.github/workflows/ci.yml`) and the changesets release
(`.github/workflows/release.yml`). Make CI a required check on main, so a PR cannot merge when
it fails.
