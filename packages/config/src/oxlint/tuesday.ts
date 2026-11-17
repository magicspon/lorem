/**
 * The repo's own oxlint rules, loaded through `jsPlugins` in `.oxlintrc.json`.
 *
 * Nodes are typed by the few fields each rule reads, so this file needs no
 * types from oxlint, whose JS plugin API is still in alpha.
 */

import { noRawLength } from './no-raw-length.ts'
import { noRawShadow } from './no-raw-shadow.ts'
import { noTypeSize } from './no-type-size.ts'
import type { AstNode, RuleContext } from './types.ts'

// A name may be a node of its own (`a:b`), so it is read as `unknown`.
interface JsxName {
  type: string
  name?: unknown
  object?: JsxName
}

interface JsxAttribute {
  type: string
  range: [number, number]
  name?: { type: string; name?: unknown }
}

interface JsxOpeningElement {
  type: 'JSXOpeningElement'
  name: JsxName
  attributes: JsxAttribute[]
}

interface ImportDeclaration {
  type: 'ImportDeclaration'
  source: { value: string; range: [number, number] }
  specifiers: { local: { name: string } }[]
}

const isImport = (node: AstNode): node is ImportDeclaration =>
  node.type === 'ImportDeclaration'

const isOpeningElement = (node: AstNode): node is JsxOpeningElement =>
  node.type === 'JSXOpeningElement'

// A component from one of these resolves `sx` itself, or is ours to fix.
const WORKSPACE_SOURCE = /^(?:@repo\/|#\/|\.)/

/** The identifier a JSX name starts from: `Select` for `Select.Trigger`. */
function rootName(name: JsxName): string | undefined {
  if (name.type === 'JSXMemberExpression' && name.object)
    return rootName(name.object)
  return typeof name.name === 'string' ? name.name : undefined
}

/**
 * `sx` on a component from outside the workspace. The StyleX compiler only
 * rewrites `sx` on a lowercase element, so on, say, the router's `Link` or a
 * Base UI part it reaches the DOM as an object and styles nothing.
 */
const sxOnForeignComponent = {
  meta: {
    type: 'problem' as const,
    docs: {
      description:
        'Disallow `sx` on a component imported from outside the workspace.',
    },
  },
  create(context: RuleContext) {
    const sources = new Map<string, string>()
    return {
      ImportDeclaration(node: AstNode) {
        if (!isImport(node)) return
        for (const specifier of node.specifiers) {
          sources.set(specifier.local.name, node.source.value)
        }
      },
      JSXOpeningElement(node: AstNode) {
        if (!isOpeningElement(node)) return
        const sx = node.attributes.find(
          (attribute) =>
            attribute.type === 'JSXAttribute' && attribute.name?.name === 'sx',
        )
        if (!sx) return
        // A lowercase element is the compiler's to rewrite.
        const root = rootName(node.name)
        if (node.name.type === 'JSXIdentifier' && /^[a-z]/.test(root ?? ''))
          return
        const source = root === undefined ? undefined : sources.get(root)
        // Not imported: defined in this file, so it is ours.
        if (source === undefined || WORKSPACE_SOURCE.test(source)) return
        context.report({
          node: sx,
          message: `\`${root}\` comes from '${source}', which does not resolve \`sx\`. Use the workspace's own version (the app's \`Link\`, a ui part), or spread \`stylex.props(…)\`.`,
        })
      },
    }
  },
}

// Writing styles starts with one of these: the compiler's API, or the raw
// tokens a style object is made of.
const STYLE_SOURCES = new Set([
  '@stylexjs/stylex',
  '@repo/ui/styles/tokens.stylex',
])

/**
 * Styles written outside ui. An app composes ui's components and passes ui's
 * exported looks (`buttonStyles()`, `linkStyles()`, `width['44']`) as `sx`;
 * a layout ui cannot build is a missing variant there. A real exception
 * disables the rule for its file with a comment that says why.
 */
const noLocalStyles = {
  meta: {
    type: 'suggestion' as const,
    docs: {
      description:
        'Disallow StyleX and raw tokens outside ui: build the look from ui.',
    },
  },
  create(context: RuleContext) {
    return {
      ImportDeclaration(node: AstNode) {
        if (!isImport(node) || !STYLE_SOURCES.has(node.source.value)) return
        context.report({
          node: node.source,
          message: `Import from '${node.source.value}' writes styles outside ui. Compose ui's components, props and exported styles; add a variant to ui if one is missing.`,
        })
      },
    }
  },
}

/** The plugin oxlint loads, as `tuesday/<rule>`. */
const plugin = {
  meta: { name: 'tuesday' },
  rules: {
    'no-local-styles': noLocalStyles,
    'no-raw-length': noRawLength,
    'no-raw-shadow': noRawShadow,
    'no-type-size': noTypeSize,
    'sx-on-foreign-component': sxOnForeignComponent,
  },
}

export default plugin
export {
  noLocalStyles,
  noRawLength,
  noRawShadow,
  noTypeSize,
  sxOnForeignComponent,
}
