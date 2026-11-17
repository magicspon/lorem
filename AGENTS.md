# lorem-click

lorem.click makes placeholder text to copy. The app is `apps/lorem-click` (TanStack Start). It
uses the shared `@repo/<folder>` packages copied from the tuesday repo: `ui` (Base UI styled
with StyleX, cut down to the basic components the app needs) and `config`. Each
package's `README.md` lists its exports; update it when they change. `packages/ui/AGENTS.md`
holds ui's own rules.

## Rules

- **The app writes no styles.** A screen composes ui's components and passes ui's exported looks
  as `sx`. A look ui cannot build is a missing variant: add it to ui. `tuesday/no-local-styles`
  enforces this.
- **The product's name comes from `apps/lorem-click/src/brand.ts`.** Never write it as a literal.
- **Imports use `#/` for anything above the current folder**, naming the extension; siblings stay
  `./x`. `*.stylex.ts` imports stay relative inside a package. An app imports tokens as
  `@repo/ui/styles/tokens.stylex`.
- **TypeScript is strict, with `noUncheckedIndexedAccess`.** Narrow and guard rather than cast.
- **Styles in ui** follow the `stylex` skill.
- Keep files under 200 lines. Comment the **why**. JSDoc on every exported function and type.
- Each package a change touches gets its own changeset (`pnpm changeset`).
- The workspace holds back releases younger than three days (`minimumReleaseAge`).
- Before committing, run `pnpm format`, `pnpm check`, `pnpm typecheck` and `pnpm test`.

## Communication

Always respond to the user in plain language using ISO 24495-1:2023.
