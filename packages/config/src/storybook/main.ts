import type { StorybookConfig } from '@storybook/react-vite'

/**
 * Addons by name, not path. Storybook and Vite resolve a name from the package
 * running Storybook (addon-docs asks Vite to pre-bundle itself by name), so
 * each package installs these itself, beside `storybook`. Add one here and to
 * every package that has a `.storybook` folder.
 */
const sharedAddons = [
  '@chromatic-com/storybook',
  '@storybook/addon-vitest',
  '@storybook/addon-a11y',
  '@storybook/addon-docs',
  '@storybook/addon-mcp',
]

/** What a package may add to the shared Storybook config. */
export type StorybookMainOptions = Omit<
  StorybookConfig,
  'stories' | 'framework'
> &
  Partial<Pick<StorybookConfig, 'framework'>> & {
    /** Also loads MDX docs pages from `src/`. */
    mdx?: boolean
  }

/**
 * The Storybook `main` config every package shares: where stories live, the
 * common addons, and plain React on Vite.
 *
 * `addons` in the options adds to the shared list rather than replacing it. Any
 * other option (`viteFinal`, `staticDirs`, `framework`) passes straight through,
 * so a package can give the framework options of its own.
 */
export function defineMain({
  addons = [],
  mdx = false,
  ...options
}: StorybookMainOptions = {}): StorybookConfig {
  return {
    // The MDX glob is opt-in: Storybook warns on every startup for a pattern
    // that matches nothing, and only some packages have MDX pages.
    stories: [
      ...(mdx ? ['../src/**/*.mdx'] : []),
      '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)',
    ],
    framework: '@storybook/react-vite',
    ...options,
    addons: [...sharedAddons, ...addons],
  }
}
