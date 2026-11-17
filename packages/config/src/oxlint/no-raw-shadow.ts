import {
  forEachStyle,
  isObject,
  isProperty,
  keyName,
  type Node,
  type ObjectExpression,
} from './no-raw-length.ts'
import type { RuleContext } from './types.ts'

// `boxShadow`, `textShadow`, or a custom property holding one
// (`--ts-chart-tooltip-shadow`).
const SHADOW = /shadow$/i

// `default`, a pseudo-class, an at-rule or a computed `stylex.when` key.
const isCondition = (name: string | undefined) =>
  name === undefined || name === 'default' || /^[:@[]/.test(name)

/** `null`, `'none'`, or a read of the `shadows` token group. */
function isTokenOrNone(node: Node): boolean {
  if (node.type === 'Literal') {
    const { value } = node as Node & { value: unknown }
    return value === null || value === 'none'
  }
  if (node.type !== 'MemberExpression') return false
  const { object } = node as Node & { object: Node & { name?: unknown } }
  return object.type === 'Identifier' && object.name === 'shadows'
}

/**
 * A shadow in `stylex.create` that is not a `shadows` token. Every shadow lives
 * in ui's `shadows.stylex.ts`, so the library has one set to keep in step with
 * the theme.
 */
export const noRawShadow = {
  meta: {
    type: 'problem' as const,
    docs: {
      description:
        'Disallow shadow literals in `stylex.create`: use `shadows` from shadows.stylex.ts.',
    },
  },
  create(context: RuleContext) {
    // Walks a style object; `css` is the property a condition sits under.
    const walk = (style: ObjectExpression, css: string | undefined) => {
      for (const property of style.properties) {
        if (!isProperty(property)) continue
        const name = keyName(property)
        const target = isCondition(name) ? css : name
        if (isObject(property.value)) walk(property.value, target)
        else if (
          target &&
          SHADOW.test(target) &&
          !isTokenOrNone(property.value)
        )
          context.report({
            node: property.value,
            message: `\`${target}\` takes a token from \`shadows\` in @repo/ui/styles/shadows.stylex, not a literal. Add one there if none fits.`,
          })
      }
    }

    return forEachStyle((style) => walk(style, undefined))
  },
}
