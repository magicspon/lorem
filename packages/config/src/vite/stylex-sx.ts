/**
 * The slice of a Vite plugin this one needs, so config takes no Vite
 * dependency. A plain object of this shape is a valid Vite plugin.
 */
export interface StylexSxPlugin {
  name: string
  enforce: 'pre'
  transform: (code: string, id: string) => string | null
}

const SOURCE_RE = /\.[cm]?[jt]sx$/
// Any import of the runtime, in the forms the StyleX plugin itself looks for.
const STYLEX_IMPORT_RE =
  /(?:from\s*['"]@stylexjs\/stylex['"]|^\s*import\s*['"]@stylexjs\/stylex['"])/m
const SX_PROP_RE = /\ssx=\{/

/**
 * Lets a file use the `sx` prop without importing StyleX. The StyleX plugin
 * only compiles files that import `@stylexjs/stylex`, so a file whose one use
 * of StyleX is `sx` would ship the prop to the DOM untouched. This adds a bare
 * import to such a file; the compiler then adds the binding it needs.
 *
 * Place it directly before `stylex()` in `plugins`.
 */
export function stylexSx(): StylexSxPlugin {
  return {
    name: 'tuesday:stylex-sx',
    enforce: 'pre',
    transform(code, id) {
      const file = id.split('?')[0] ?? id
      if (!SOURCE_RE.test(file)) return null
      if (!SX_PROP_RE.test(code) || STYLEX_IMPORT_RE.test(code)) return null
      return `import '@stylexjs/stylex'\n${code}`
    },
  }
}
