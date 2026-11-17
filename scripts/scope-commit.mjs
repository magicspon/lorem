#!/usr/bin/env node
/**
 * commit-msg hook: adds the changed package name(s) as the conventional-commit scope.
 *
 *   feat: add migrations      ->  feat(database): add migrations
 *   fix!: drop old api        ->  fix(api,web)!: drop old api
 *
 * Leaves the message alone if it already has a scope, isn't a conventional
 * commit, is a merge/revert/fixup, or only touches root-level files.
 *
 * Usage (husky v9):  .husky/commit-msg  ->  node scripts/scope-commit.mjs "$1"
 */
import { readFileSync, writeFileSync, existsSync } from 'node:fs'
import { execSync } from 'node:child_process'
import path from 'node:path'

// ---- config -------------------------------------------------------------
const MAX_SCOPES = 3 // more than this -> use FALLBACK_MANY
const FALLBACK_MANY = 'repo' // scope used when too many packages changed
const STRIP_NPM_SCOPE = true // @acme/database -> database
// Folders whose files never decide the scope, wherever they sit in the tree
const IGNORED_DIRS = new Set(['graphify-out', '.changeset'])
// -------------------------------------------------------------------------

const msgFile = process.argv[2]
if (!msgFile) process.exit(0)

const git = (cmd) => execSync(`git ${cmd}`, { encoding: 'utf8' }).trim()
const root = git('rev-parse --show-toplevel')

const raw = readFileSync(msgFile, 'utf8')
const lines = raw.split('\n')
const headerIdx = lines.findIndex((l) => l.trim() && !l.startsWith('#'))
if (headerIdx === -1) process.exit(0)

const header = lines[headerIdx]
if (/^(Merge|Revert|fixup!|squash!|amend!)/.test(header)) process.exit(0)

// type(scope)!: subject
const m = header.match(/^(\w+)(\([^)]*\))?(!)?\s*:\s*(.+)$/)
if (!m) process.exit(0)
const [, type, existingScope, bang = '', subject] = m
if (existingScope) process.exit(0)

const files = git('diff --cached --name-only --diff-filter=ACMRD')
  .split('\n')
  .filter(Boolean)
  .filter(
    (file) => !file.split('/').some((segment) => IGNORED_DIRS.has(segment)),
  )

// The package a folder holds, named by its package.json, or null if it has none
function packageIn(dir) {
  const pj = path.join(dir, 'package.json')
  if (!existsSync(pj)) return null
  try {
    return JSON.parse(readFileSync(pj, 'utf8')).name || path.basename(dir)
  } catch {
    return path.basename(dir)
  }
}

// Walk up from a file to the nearest package.json (excluding the root one)
function packageFor(file) {
  for (
    let dir = path.dirname(path.join(root, file));
    dir.startsWith(root) && dir !== root;
    dir = path.dirname(dir)
  ) {
    const name = packageIn(dir)
    if (name) return name
  }
  return null
}

const scopes = [
  ...new Set(
    files
      .map(packageFor)
      .filter(Boolean)
      .map((n) => (STRIP_NPM_SCOPE ? n.replace(/^@[^/]+\//, '') : n)),
  ),
].sort((a, b) => a.localeCompare(b))

if (scopes.length === 0) process.exit(0)

const scope = scopes.length > MAX_SCOPES ? FALLBACK_MANY : scopes.join(',')
lines[headerIdx] = `${type}(${scope})${bang}: ${subject}`
writeFileSync(msgFile, lines.join('\n'))
