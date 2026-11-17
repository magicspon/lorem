# @repo/config

The tooling settings every workspace package shares: TypeScript, Vitest, Storybook, Vite and oxlint. A package
extends these instead of repeating them, so one change here reaches all of them. It holds no
runtime code, and nothing imports it at run time.

`src/oxlint/tuesday.ts` holds the repo's own lint rules, which `.oxlintrc.json` loads through
`jsPlugins`: `tuesday/sx-on-foreign-component` rejects `sx` on a component from outside the
workspace, which would pass it to the DOM unresolved.

## Exports

| Path                                 | What it gives you                                                                                                                        |
| ------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------- |
| `@repo/config/tsconfig/base.json`    | The strict compiler options. Emits declarations, so use it only for a package that is built.                                             |
| `@repo/config/tsconfig/library.json` | `base` for a package whose source is read as-is by the apps or by other packages. Adds Node types.                                       |
| `@repo/config/tsconfig/react.json`   | `library` with `jsx: react-jsx`.                                                                                                         |
| `@repo/config/vitest/coverage`       | `coverage(reportsDirectory?)`: the coverage settings every run writes, for fallow. The two presets below use it.                         |
| `@repo/config/vitest/node`           | `nodeProject(name, { passWithNoTests })`: a Vitest project that runs in Node.                                                            |
| `@repo/config/vitest/storybook`      | `storybookProject(name, import.meta.dirname)`: runs a package's stories, and any `src/**/*.test.{ts,tsx}`, as browser tests in Chromium. |
| `@repo/config/storybook/main`        | `defineMain(options)`: the story glob, the shared addons and the React + Vite framework.                                                 |
| `@repo/config/storybook/preview`     | `previewParameters`: the controls matchers and a11y setting every preview shares.                                                        |
| `@repo/config/vite/stylex-sx`        | `stylexSx()`: a Vite plugin, placed before `stylex()`, that adds the StyleX import to a file using `sx` without one.                     |

## Use it

Add `"@repo/config": "workspace:*"` to `devDependencies`, then:

```jsonc
// tsconfig.json: `include` and `exclude` stay in the package, because a path
// in a shared file would resolve from here.
{ "extends": "@repo/config/tsconfig/react.json", "include": ["src"] }
```

```ts
// vitest.config.ts
import { nodeProject } from '@repo/config/vitest/node'
export default nodeProject('my-package')
```

```ts
// .storybook/main.ts
import { defineMain } from '@repo/config/storybook/main'
export default defineMain({ addons: ['@storybook/addon-themes'] })
```

## What stays in the package

- **Storybook's dependencies.** A package that runs Storybook installs `storybook`, its framework
  and every addon itself, including the shared ones listed in `storybook/main.ts`. Storybook and
  Vite find an addon by name from the package's own folder, so an addon installed only here is not
  found. `@storybook/addon-vitest` and `@vitest/browser-playwright` stay for the same reason.
- **Anything one package decides.** A `viteFinal` plugin, a theme decorator or a font belongs to the
  package that uses it.
- **Lint and format.** Oxlint and Oxfmt read the root `.oxlintrc.json` and `.oxfmtrc.json`.
