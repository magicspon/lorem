import path from 'node:path'

import { storybookTest } from '@storybook/addon-vitest/vitest-plugin'
import { playwright } from '@vitest/browser-playwright'
import { defineConfig } from 'vitest/config'
import type { ViteUserConfig } from 'vitest/config'

import { coverage } from './coverage.ts'

/**
 * A Vitest project that runs a package's stories as browser tests.
 *
 * Every story renders in headless Chromium and runs its `play` function, and
 * so does any `*.test.ts` in `src`. The coverage it produces feeds fallow's
 * CRAP scores.
 *
 * @param name The package's folder name, as the root run prints it.
 * @param root The package's directory, which holds its `.storybook` folder.
 *   Pass `import.meta.dirname`: this file cannot know which package is asking.
 * @param options.unitTests The plain tests to run beside the stories. Pass
 *   `[]` when a package runs its tests in Node instead, as builder does.
 */
export function storybookProject(
  name: string,
  root: string,
  { unitTests = ['src/**/*.test.{ts,tsx}'] }: { unitTests?: string[] } = {},
): ViteUserConfig {
  return defineConfig({
    plugins: [
      storybookTest({ configDir: path.join(root, '.storybook') }),
      // The Storybook plugin discards a `test.include` set in the config and
      // lists only stories, so the test glob comes in through a plugin, which
      // Vite merges instead. A plain test suits logic too pure for a story to
      // reach, such as a gesture's maths.
      {
        name: 'tuesday:unit-tests',
        config: () => ({ test: { include: unitTests } }),
      },
    ],
    test: {
      name,
      // The root run shares the CPU with every other project, and a story that
      // loads Monaco cold can pass Vitest's 15s browser default there alone.
      testTimeout: 30_000,
      // Read only when Turborepo runs the package on its own.
      coverage: coverage('coverage/component'),
      // As in the root run: output only for a failing test, since stories of an
      // error state log that error on purpose.
      silent: 'passed-only',
      browser: {
        enabled: true,
        headless: true,
        provider: playwright({}),
        instances: [{ browser: 'chromium' }],
        // A desktop window, as in Storybook. Vitest's 414px default pushes
        // side-placed popups back inside the edge.
        viewport: { width: 1280, height: 720 },
      },
    },
  })
}
