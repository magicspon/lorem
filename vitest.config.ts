import { coverage } from '@repo/config/vitest/coverage'
import { defineConfig } from 'vitest/config'

/**
 * One run for the whole workspace. Projects rather than a flat glob, so a
 * failure names the package it came from. Tests resolve `@repo/*` through
 * the workspace `exports`, which point at source, so nothing is built first.
 */
export default defineConfig({
  test: {
    projects: ['packages/*', 'apps/*'],
    // A test's console output is printed only when it fails.
    silent: 'passed-only',
    coverage: coverage(),
  },
})
