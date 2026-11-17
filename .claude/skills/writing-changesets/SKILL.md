---
name: writing-changesets
description: >
  Write changesets (.changeset/*.md), one per package a change touches, that tell each package's
  reader what changed, in one or two plain sentences. Use when the user asks for a changeset, release note or changelog entry, when
  a branch is ready for a PR and changes something users see, or when deciding whether a change
  needs a changeset at all.
---

# Writing changesets

A changeset becomes a line in one package's changelog. Who reads it depends on the package:

- **`client`** (`apps/client`): someone **using tuesday**, not someone reading its code. Tell
  them what they can now do, or what no longer goes wrong.
- **A `@repo/*` package**: a developer using that package. Tell them what they can now call,
  what changed and what was removed.

## What gets versioned

Every workspace package, by its `name` in `package.json` (`client`, `@repo/ui`). Read
`.changeset/config.json` first; anything in `ignore` is not versioned. `pnpm changeset:check`
fails a name that is not a workspace package.

**One package per file.** A change that touches `@repo/auth`, `@repo/contracts` and the app
is three files, each written for its own reader.

## Does it need one?

- **`client`**: when a user would notice: a new feature, a fix, a changed behaviour, a removed
  option, whichever package the code is in. Ask: "would a user care?"
- **A `@repo/*` package**: when its exports or behaviour change for code that uses it, or it
  gains a dependency it ships. Name the package's tooling too: a new lint rule in
  `@repo/config`, new tests in `@repo/e2e`.

Skip it for refactors, tests of the package itself, CI, docs and Storybook-only changes.

A package that depends on a bumped package gets a patch bump on its own, with "Updated
dependencies" in its changelog, so do not write a changeset just to bump a dependent.

## Dependency updates

Renovate writes its own, so never add one to a Renovate branch for the bump itself. When a
production dependency (`dependencies` or `peerDependencies`) changes in a workspace package,
`scripts/renovate-changeset.mjs` adds a patch for that package, named
`renovate-<package>-<dependency>.md`, whose summary names the dependency:

```md
---
'@repo/ui': patch
---

Update `@base-ui/react` dependency to `^1.9.0`.
```

It is the one `client` changeset that names code rather than what users see; the release still
ships the new version, so the changelog records it. Dev dependencies, the root manifest and GitHub
Actions get none.

On a branch that updates a dependency:

- **A Renovate changeset is already there.** Leave it. If the update changes something users see
  (a fixed bug, a new look), add a second changeset in the usual words for that; keep Renovate's.
- **You upgraded a dependency by hand** and the change is only the version: write the same patch
  Renovate would, with its summary format, so the two read alike. If you also changed code to fit
  the new version, write that change as its own changeset only when users would notice it.

## The bump

- **major**: users must act or lose something. A feature is removed, saved data or links stop
  working, or a workflow changes in a way that breaks habits.
- **minor**: something new users can do.
- **patch**: a fix, or a small improvement to something that already exists.

For a `@repo/*` package, "users" are the code that imports it: a removed or renamed export is
a major. While a package is below 1.0.0, a breaking change is a minor instead.

## The file

Give it a short kebab-case name that says what changed, starting with the package for a
`@repo/*` one, such as `.changeset/repeater-field-reorder.md` and
`.changeset/builder-repeater-reorder.md`, rather than the CLI's random name.

```md
---
'client': minor
---

Reorder rows in a repeater field by dragging them.
```

```md
---
'@repo/builder': minor
---

Add the `moveItem` action, which reorders the rows of a repeater.
```

One change and one package per file. Two unrelated changes are two files.

## The words

- **One sentence, two at most.** No headings, no lists, no trailing summary.
- **Lead with the outcome**, in the user's terms: "Forms now save…", "Fix…", "Add…".
  Imperative or present tense, ending with a full stop.
- **In `client`, name what the user sees**, not the code: "the field editor", not
  `fieldEditorForm`; "the drop zone at the end of a page", not `resolveDropIntent`. No file paths,
  package names or function names.
- **In a `@repo/*` package, name the exports** a developer calls: "Add `QrCode`", "Remove
  `signInInput`". No file paths.
- No ticket numbers or PR links in either (the changelog adds the PR link itself).
- **For a fix, describe the symptom that is gone**: "Fix dates shifting by a day in some
  time zones", not "Fix timezone handling in date parser".
- **For a major, say what to do**: add a second sentence with the action the user must take.
- Plain language (ISO 24495-1): common words, no jargon, no hype ("powerful", "seamless").

| Avoid                                               | Write                                                  |
| --------------------------------------------------- | ------------------------------------------------------ |
| Refactor `move.ts` to prune empty rows after moves. | Empty rows no longer stay behind after moving a field. |
| Added new `ChartLegendToggle` component.            | Hide or show a series by clicking it in the legend.    |
| Various bug fixes and improvements.                 | (One specific changeset per fix.)                      |

## Steps

1. Read the diff (`git diff main...HEAD --stat`) and the changesets already in `.changeset/`. List
   the packages it touches, and decide for each, and for `client`, whether its reader would
   notice. If none would, stop and say so. For a dependency update, see above.
2. Pick each bump from the list above.
3. Write one file per package in `.changeset/`, then read each back as its reader would.
4. Run `pnpm changeset:check` to confirm every name is a workspace package.
