import type { ViteUserConfig } from 'vitest/config'

type CoverageOptions = NonNullable<
  NonNullable<ViteUserConfig['test']>['coverage']
>

/**
 * The coverage every run writes, for fallow's CRAP scores.
 *
 * Shared by the root run and each package's own run, which Turborepo starts
 * from the package folder. A project's coverage settings count only when its
 * config is the run's root, so the root config passes these too.
 *
 * @param reportsDirectory Where the maps go, relative to the run's root. A
 *   package with both Node and browser tests gives each run its own folder.
 */
export function coverage(reportsDirectory = 'coverage'): CoverageOptions {
  return {
    provider: 'v8',
    // Istanbul-format JSON for fallow, and a summary for people.
    reporter: ['json', 'text-summary'],
    reportsDirectory,
    // A failing test must not hide the maps: fallow reads them to score the
    // code, and the failure is reported by the run itself.
    reportOnFailure: true,
    // A run limited to one package matches these against that package's own
    // folder, so a path from the repo root would match nothing and the report
    // would come out empty. `allowExternal` keeps the workspace packages it
    // imports, which sit outside its folder. That glob also matches packages
    // inside `node_modules`, and setting `exclude` drops Vitest's own list, so
    // they are left out here, and so are the agent skills.
    include: ['**/src/**/*.{ts,tsx}'],
    allowExternal: true,
    exclude: ['**/node_modules/**', '**/.agents/**', '**/*.stories.tsx'],
  }
}
