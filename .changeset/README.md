# Changesets

Each Markdown file here is one change to one package, waiting for the next release. Make one with
`pnpm changeset` for each package a change touches. Write a `client` summary for the app's users,
and a `@repo/*` summary for the developers who use that package. It becomes the entry in that
package's changelog.

A changeset that names something that is not a workspace package fails the `Changesets` check in
CI. See [Releases](../README.md#releases) in the main README.
