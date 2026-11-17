import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { defineMain } from '@repo/config/storybook/main'
import stylex from '@stylexjs/unplugin/vite'
import { stylexSx } from '@repo/config/vite/stylex-sx'
import { stylexLightningcss } from '@repo/config/vite/stylex-lightningcss'

const packageRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '..',
)

export default defineMain({
  // `src/docs/introduction.mdx`, the page Storybook opens on.
  mdx: true,
  // Forces `:hover`, `:active` and `:focus-visible` for the states grid in
  // `src/docs/states.stories.tsx`.
  addons: ['storybook-addon-pseudo-states'],
  // The Vitest story runner applies this too.
  viteFinal: (viteConfig, { configType }) => ({
    ...viteConfig,
    optimizeDeps: {
      ...viteConfig.optimizeDeps,
      // Pre-bundled, so Vite doesn't find it mid-run and reload the tests.
      include: [
        ...(viteConfig.optimizeDeps?.include ?? []),
        '@stylexjs/stylex/lib/stylex-inject',
      ],
    },
    plugins: [
      ...(viteConfig.plugins ?? []),
      // Before stylex(), which skips any file that does not import StyleX.
      stylexSx(),
      stylex({
        dev: configType !== 'PRODUCTION',
        // Styles inject from each module in dev, so Storybook's iframe and
        // Vitest's browser runner need no CSS link. A build extracts a file.
        runtimeInjection: configType !== 'PRODUCTION',
        // Tokens hash from their path, so pin the root rather than the cwd.
        unstable_moduleResolution: { type: 'commonJS', rootDir: packageRoot },
        // Keeps `light-dark()`, which every colour token is. See the option.
        lightningcssOptions: stylexLightningcss,
      }),
    ],
  }),
})
