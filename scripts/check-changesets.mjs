// Fails when a changeset names something that is not a workspace package.
//
// Every package is versioned, so a changeset names each package it changes,
// by its `name` (`client`, `@repo/ui`). A misspelt name only surfaces when
// `changeset version` runs on main, after the PR has merged. CI runs this so
// that mistake fails the PR instead.

import { readFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'

const root = process.cwd()
const dir = join(root, '.changeset')

/** The name of every package under `apps/` and `packages/`. */
const packages = new Set(
  ['apps', 'packages'].flatMap((folder) =>
    readdirSync(join(root, folder)).flatMap((entry) => {
      try {
        const file = join(root, folder, entry, 'package.json')
        return [JSON.parse(readFileSync(file, 'utf8')).name]
      } catch {
        // A folder with no manifest is not a package.
        return []
      }
    }),
  ),
)

const problems = readdirSync(dir)
  .filter((entry) => entry.endsWith('.md') && entry !== 'README.md')
  .flatMap((entry) => {
    const text = readFileSync(join(dir, entry), 'utf8')
    // The front matter is the block between the first two `---` lines.
    const frontMatter = text.split(/^---$/m)[1] ?? ''
    const names = [...frontMatter.matchAll(/^\s*["']?([^"':]+)["']?\s*:/gm)]
      .map((match) => match[1]?.trim())
      .filter((name) => name !== undefined)
    return names
      .filter((name) => !packages.has(name))
      .map((name) => `.changeset/${entry} names "${name}"`)
  })

if (problems.length > 0) {
  console.error(problems.join('\n'))
  console.error(
    `\nName a workspace package: ${[...packages].sort((a, b) => a.localeCompare(b)).join(', ')}.`,
  )
  process.exit(1)
}
