import type { AstNode, RuleContext } from './types.ts'

export interface Node extends AstNode {
  range: [number, number]
}

interface Literal extends Node {
  type: 'Literal'
  value: unknown
}

interface UnaryExpression extends Node {
  type: 'UnaryExpression'
  operator: string
  argument: Node
}

export interface Property extends Node {
  type: 'Property'
  computed: boolean
  key: Node & { name?: unknown; value?: unknown }
  value: Node
}

export interface ObjectExpression extends Node {
  type: 'ObjectExpression'
  properties: Node[]
}

interface ArrowFunction extends Node {
  type: 'ArrowFunctionExpression'
  body: Node & { expression?: Node }
}

interface CallExpression extends Node {
  type: 'CallExpression'
  callee: Node & {
    computed?: boolean
    object?: Node & { name?: unknown }
    property?: Node & { name?: unknown }
  }
  arguments: Node[]
}

export const isObject = (node: Node): node is ObjectExpression =>
  node.type === 'ObjectExpression'

export const isProperty = (node: Node): node is Property =>
  node.type === 'Property'

const isArrow = (node: Node): node is ArrowFunction =>
  node.type === 'ArrowFunctionExpression'

const isLiteral = (node: Node): node is Literal => node.type === 'Literal'

const isCall = (node: AstNode): node is CallExpression =>
  node.type === 'CallExpression'

// The properties a token scale covers: `space`, `size`, `radii` and
// `fontSize`. Border widths stay literal, since a hairline is not a step.
const SCALED =
  /^(?:padding|margin|gap$|rowGap$|columnGap$|inset|top$|right$|bottom$|left$|(?:min|max)?(?:Width|Height|BlockSize|InlineSize)$|width$|height$|blockSize$|inlineSize$|flexBasis$|fontSize$|borderRadius$|border\w+Radius$)/

// An absolute length. Relative units (`em`, `%`, `vh`) depend on their
// context, which no token can stand for, so they pass.
const ABSOLUTE = /^-?(?:\d+\.?\d*|\.\d+)(?:px|rem)$/

// A width or height past the largest `size` step (24rem) is a container's,
// which AGENTS.md lets stay literal rather than grow the scale.
const DIMENSION =
  /^(?:min|max)?(?:width|height|Width|Height|BlockSize|InlineSize|blockSize|inlineSize)$/
const LARGEST_SIZE_REM = 24

/** A length in rem, reading a bare number as pixels the way StyleX does. */
function toRem(value: number | string): number {
  if (typeof value === 'number') return value / 16
  const amount = Number.parseFloat(value)
  return value.endsWith('px') ? amount / 16 : amount
}

/** A property key's name, or undefined for a computed key. */
export function keyName(property: Property): string | undefined {
  if (property.computed) return undefined
  const { name, value } = property.key
  if (typeof name === 'string') return name
  return typeof value === 'string' ? value : undefined
}

// `default`, a pseudo-class, an at-rule or a computed `stylex.when` key: a
// condition on the property around it, not a property of its own.
const isCondition = (name: string | undefined) =>
  name === undefined || name === 'default' || /^[:@[]/.test(name)

/**
 * A number other than zero, a negated one, or an absolute length string,
 * except a container's width or height past the scale.
 */
function isRawLength(node: Node, css: string): boolean {
  if (node.type === 'UnaryExpression') {
    const { operator, argument } = node as UnaryExpression
    return operator === '-' && isRawLength(argument, css)
  }
  if (!isLiteral(node)) return false
  const { value } = node
  if (typeof value === 'number') {
    if (value === 0) return false
  } else if (typeof value !== 'string' || !ABSOLUTE.test(value)) return false
  return !(DIMENSION.test(css) && toRem(value) > LARGEST_SIZE_REM)
}

const isStylexCreate = (node: CallExpression) =>
  node.callee.type === 'MemberExpression' &&
  !node.callee.computed &&
  node.callee.object?.name === 'stylex' &&
  node.callee.property?.name === 'create'

/**
 * Calls `visit` with each namespace's style object in a `stylex.create` call:
 * the oxlint visitor every style rule returns.
 */
export const forEachStyle = (visit: (style: ObjectExpression) => void) => ({
  CallExpression(node: AstNode) {
    if (!isCall(node) || !isStylexCreate(node)) return
    const [namespaces] = node.arguments
    if (!namespaces || !isObject(namespaces)) return
    for (const namespace of namespaces.properties) {
      if (!isProperty(namespace)) continue
      // A dynamic style is an arrow returning its object.
      const body: Node & { expression?: Node } = isArrow(namespace.value)
        ? namespace.value.body
        : namespace.value
      const style =
        body.type === 'ParenthesizedExpression' && body.expression
          ? body.expression
          : body
      if (isObject(style)) visit(style)
    }
  },
})

/**
 * A raw length in `stylex.create` where a token belongs. StyleX reads a bare
 * number as pixels, so `padding: 3` is 3px, not step 3 of `space`, and no
 * type catches it: every token is typed `string`.
 */
export const noRawLength = {
  meta: {
    type: 'problem' as const,
    docs: {
      description:
        'Disallow raw lengths in `stylex.create`: use `space`, `size` or `radii`.',
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
          SCALED.test(target) &&
          isRawLength(property.value, target)
        )
          context.report({
            node: property.value,
            message: `\`${target}\` takes a token, not a raw length: StyleX reads a number as pixels. Use \`space\`, \`size\` or \`radii\` from tokens.stylex.ts, adding a step if one is missing, or \`textStyles\` for type.`,
          })
      }
    }

    return forEachStyle((style) => walk(style, undefined))
  },
}
