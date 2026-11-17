# lorem.click

The best lorem ipsum tool in the world.

Pick how much placeholder text you want and what shape it takes. lorem.click makes it at once,
ready to copy and paste.

## What it makes

Ask for 1 to 100 of any of these:

| Kind         | What you get                         |
| ------------ | ------------------------------------ |
| `words`      | Loose words                          |
| `sentences`  | That many sentences                  |
| `paragraphs` | That many paragraphs                 |
| `slug`       | A URL slug, like `lorem-ipsum-dolor` |

## Share a link

The address holds the request, so any link opens the same kind of text:

```text
https://lorem.click/?count=3&kind=paragraphs
```

A missing or wrong value falls back to the default: 10 words. Old links like
`/10/words` still work and redirect to the new form.

## Run it locally

You need Node 26 (see `.nvmrc`) and pnpm.

```sh
pnpm install
pnpm dev      # http://localhost:3001
```

To run more than one copy at once (one per agent or git worktree), start it with
[portless](https://portless.sh) instead: `pnpm dev:portless` serves it at
<https://lorem-click.localhost>, and a worktree on branch `fix-ui` at
`https://fix-ui.lorem-click.localhost`. Install portless once with `pnpm add -g portless`.

## Before you commit

```sh
pnpm format
pnpm check
pnpm typecheck
pnpm test
```

Each package a change touches needs its own changeset: run `pnpm changeset`.

## What's inside

| Folder             | What it is                                                          |
| ------------------ | ------------------------------------------------------------------- |
| `apps/lorem-click` | The app, built on [TanStack Start](https://tanstack.com/start).     |
| `packages/ui`      | The components: [Base UI](https://base-ui.com) styled with StyleX.  |
| `packages/config`  | Shared settings for TypeScript, Vitest, Storybook, Vite and oxlint. |

The app writes no styles of its own. It builds every screen from `@repo/ui`. `AGENTS.md` lists
the rules the code follows, and each folder's `README.md` explains that part in more detail.

## Licence

[MIT](LICENSE)
