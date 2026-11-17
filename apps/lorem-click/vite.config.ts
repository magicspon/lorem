import path from 'node:path'
import { fileURLToPath } from 'node:url'

import stylex from '@stylexjs/unplugin/vite'
import { stylexLightningcss } from '@repo/config/vite/stylex-lightningcss'
import { stylexSx } from '@repo/config/vite/stylex-sx'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import react from '@vitejs/plugin-react'
import { nitro } from 'nitro/vite'
import { defineConfig } from 'vite'

// ui's tokens hash from their path, so StyleX resolves from the repo root the
// same way here as in ui. Once the app has its own repo, this is that root.
const repoRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '../..',
)

export default defineConfig(({ command }) => ({
  // Beside the client's 3000, so both can run at once.
  server: { port: 3001 },
  plugins: [
    tanstackStart(),
    // Builds the server for its host. On Vercel it finds the platform from the
    // build's environment and writes Vercel's output; elsewhere, a Node server.
    nitro(),
    // Before stylex(), which skips any file that does not import StyleX.
    stylexSx(),
    // Before react, for React Refresh to work.
    stylex({
      dev: command === 'serve',
      // The root route links the collected CSS in dev, so the server-rendered
      // page is styled before any script runs.
      runtimeInjection: false,
      unstable_moduleResolution: { type: 'commonJS', rootDir: repoRoot },
      // Keeps `light-dark()`, which every colour token is.
      lightningcssOptions: stylexLightningcss,
    }),
    react(),
  ],
}))
