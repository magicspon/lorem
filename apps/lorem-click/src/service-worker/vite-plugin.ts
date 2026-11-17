import { readFileSync, readdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

import { transformWithOxc, type Plugin } from 'vite'

import { appName } from '#/brand.ts'

const source = fileURLToPath(new URL('./sw.ts', import.meta.url))
const placeholder = /(["'`])__PRECACHE_MANIFEST__\1/

/** The web app manifest, so the app can be installed and opened offline. */
const manifest = {
  name: appName,
  short_name: appName,
  description: 'Lorem ipsum to copy and paste.',
  start_url: '/',
  display: 'standalone',
  icons: [{ src: '/favicon.svg', type: 'image/svg+xml', sizes: 'any' }],
}

/**
 * Writes `src/service-worker/sw.ts` to `/sw.js` in the browser's build, with
 * the list of files it keeps: every file the build writes, plus `public/`.
 * Hand-written rather than Workbox, because Start writes no `index.html` for
 * such tools to read, and the app needs only a shell and its files.
 * Also writes `/manifest.webmanifest`.
 *
 * The worker imports nothing, so its types are stripped rather than bundled:
 * the browser build takes only one entry.
 */
export function serviceWorker(): Plugin {
  return {
    name: 'lorem-click:service-worker',
    apply: 'build',
    applyToEnvironment: (environment) => environment.name === 'client',
    buildStart() {
      this.addWatchFile(source)
      this.emitFile({
        type: 'asset',
        fileName: 'manifest.webmanifest',
        source: JSON.stringify(manifest, null, 2),
      })
    },
    async generateBundle(_options, bundle) {
      const built = Object.keys(bundle).filter((file) => !file.endsWith('.map'))
      const files = [
        ...built,
        ...publicFiles(this.environment.config.publicDir),
      ]
      const list = JSON.stringify(files.map((file) => `/${file}`))

      const { code } = await transformWithOxc(
        readFileSync(source, 'utf8'),
        source,
        {
          lang: 'ts',
        },
      )
      // The file is a module only for its types. A worker registered without
      // `type: 'module'` is a classic script, where `export` will not parse.
      const script = code.replace(/^export \{\};\n/m, '')
      if (/^\s*(?:export|import)\b/m.test(script)) {
        this.error('The service worker must not import or export anything.')
      }
      if (!placeholder.test(script)) {
        this.error('The service worker lost its file list placeholder.')
      }
      this.emitFile({
        type: 'asset',
        fileName: 'sw.js',
        // A string literal of the JSON, which the worker parses.
        source: script.replace(placeholder, JSON.stringify(list)),
      })
    },
  }
}

// The files Vite copies as they are, served from the root.
function publicFiles(dir: string): string[] {
  if (dir === '') return []
  return readdirSync(dir, { recursive: true, withFileTypes: true })
    .filter((entry) => entry.isFile())
    .map((entry) => `${entry.parentPath.slice(dir.length + 1)}/${entry.name}`)
    .map((file) => file.replace(/^\//, ''))
}
