// Vercel's "ignored build step" (`ignoreCommand` in `vercel.json`). Exit 0
// skips the build, exit 1 runs it.
//
// Production ships only what changesets releases. Merging the "Version
// packages" pull request bumps this app's version, so a production build runs
// only when the version differs from the last production deploy's. Every
// other push to main is skipped. Previews always build, so each pull request
// still gets its own URL.

import { execFileSync } from 'node:child_process'

const BUILD = 1
const SKIP = 0

/** This app's version at a commit, or `undefined` when the commit is not in the clone. */
function versionAt(sha) {
  try {
    const json = execFileSync('git', ['show', `${sha}:./package.json`], {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    })
    return JSON.parse(json).version
  } catch {
    return undefined
  }
}

function decide() {
  if (process.env.VERCEL_ENV !== 'production') {
    console.log('Preview: building.')
    return BUILD
  }

  const current = versionAt('HEAD')
  // The last production deploy's commit. Vercel's clone is shallow, so fall
  // back to the parent when that commit is too far back to read.
  const previousSha = process.env.VERCEL_GIT_PREVIOUS_SHA
  const previous =
    (previousSha ? versionAt(previousSha) : undefined) ?? versionAt('HEAD^')

  if (current === undefined || previous === undefined) {
    // Unsure what changed: building is safer than missing a release.
    console.log('Could not read both versions: building.')
    return BUILD
  }
  if (current === previous) {
    console.log(`Still ${current}, no release: skipping.`)
    return SKIP
  }
  console.log(`Released ${previous} → ${current}: building.`)
  return BUILD
}

process.exit(decide())
