import { defineConfig } from 'vitest/config'
import type { ViteUserConfig } from 'vitest/config'

import { coverage } from './coverage.ts'

/** Options for {@link nodeProject}. */
export interface NodeProjectOptions {
  /** Set while a package is scaffolded ahead of its first test. */
  passWithNoTests?: boolean
  /**
   * Test globs, relative to the config file. For a package whose Node tests
   * sit beside a browser project, so each runs only its own.
   */
  include?: string[]
}

/**
 * A Vitest project that runs in Node, for code with no DOM.
 *
 * `name` is what the root run prints in front of a failure, so it is the
 * package's folder name.
 */
export function nodeProject(
  name: string,
  { passWithNoTests, include }: NodeProjectOptions = {},
): ViteUserConfig {
  return defineConfig({
    test: {
      name,
      environment: 'node',
      // Read only when Turborepo runs the package on its own. Apart from the
      // stories, so builder's two runs do not overwrite each other's map.
      coverage: coverage('coverage/unit'),
      // As in the root run: output only for a failing test, since stories of an
      // error state log that error on purpose.
      silent: 'passed-only',
      // A suite that migrates an in-memory Postgres in `beforeAll` takes longer
      // than the default 10 seconds when the whole workspace runs under coverage.
      hookTimeout: 60_000,
      // Left out rather than `false`, so a package that omits it inherits
      // Vitest's default.
      ...(passWithNoTests === undefined ? {} : { passWithNoTests }),
      ...(include === undefined ? {} : { include }),
    },
  })
}
