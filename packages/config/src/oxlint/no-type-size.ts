import {
  forEachStyle,
  isObject,
  isProperty,
  keyName,
  type ObjectExpression,
} from './no-raw-length.ts'
import type { RuleContext } from './types.ts'

// The two properties the type scale sets as a pair.
const TYPE_SIZE = new Set(['fontSize', 'lineHeight'])

/**
 * `fontSize` or `lineHeight` in `stylex.create` outside ui's typography. Type
 * comes from one place, so a part composes `textStyles[step]` or renders
 * `Text` or `Heading`, and a size off the scale cannot creep back in. ui's
 * `typography/` folder is exempt in `.oxlintrc.json`.
 */
export const noTypeSize = {
  meta: {
    type: 'suggestion' as const,
    docs: {
      description:
        'Disallow `fontSize` and `lineHeight` in `stylex.create`: compose `textStyles` or use `Text` and `Heading`.',
    },
  },
  create(context: RuleContext) {
    // Walks every nested object, so a condition or pseudo-element is caught too.
    const walk = (style: ObjectExpression) => {
      for (const property of style.properties) {
        if (!isProperty(property)) continue
        const name = keyName(property)
        if (name && TYPE_SIZE.has(name))
          context.report({
            node: property.key,
            message: `\`${name}\` belongs to the type scale. Compose \`textStyles\` from @repo/ui/typography/type-styles before the part's own styles, or render \`Text\` or \`Heading\`.`,
          })
        else if (isObject(property.value)) walk(property.value)
      }
    }

    return forEachStyle(walk)
  },
}
