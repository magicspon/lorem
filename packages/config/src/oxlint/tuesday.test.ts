import { RuleTester } from 'oxlint/plugins-dev'
import { describe, it } from 'vitest'

import {
  noLocalStyles,
  noRawLength,
  noRawShadow,
  noTypeSize,
  sxOnForeignComponent,
} from './tuesday.ts'

RuleTester.describe = describe
RuleTester.it = it

const tester = new RuleTester({
  languageOptions: { parserOptions: { lang: 'tsx' } },
})

tester.run('sx-on-foreign-component', sxOnForeignComponent, {
  valid: [
    { name: 'a lowercase element', code: 'const a = <div sx={s.a} />' },
    {
      name: 'a ui part',
      code: "import { Button } from '@repo/ui/actions/button'\nconst a = <Button sx={s.a} />",
    },
    {
      name: 'the app Link',
      code: "import { Link } from '#/components/link/index.ts'\nconst a = <Link to='/' sx={s.a} />",
    },
    {
      name: 'a sibling component',
      code: "import { Card } from './card'\nconst a = <Card sx={s.a} />",
    },
    {
      name: 'a component defined in the file',
      code: 'function Row() { return null }\nconst a = <Row sx={s.a} />',
    },
    {
      name: 'a foreign component without sx',
      code: "import { Link } from '@tanstack/react-router'\nconst a = <Link to='/' />",
    },
  ],
  invalid: [
    {
      name: "the router's Link",
      code: "import { Link } from '@tanstack/react-router'\nconst a = <Link to='/' sx={s.a} />",
      errors: 1,
    },
    {
      name: 'a Base UI part, by namespace',
      code: "import { Tooltip } from '@base-ui/react/tooltip'\nconst a = <Tooltip.Trigger sx={s.a} />",
      errors: 1,
    },
    {
      name: 'an icon',
      code: "import { XIcon } from 'lucide-react'\nconst a = <XIcon sx={s.a} />",
      errors: 1,
    },
  ],
})

tester.run('no-local-styles', noLocalStyles, {
  valid: [
    {
      name: "ui's exported styles",
      code: "import { width } from '@repo/ui/styles/sizing'\nconst a = <div sx={width['44']} />",
    },
    {
      name: 'a ui component',
      code: "import { Text } from '@repo/ui/typography/text'",
    },
  ],
  invalid: [
    {
      name: 'the StyleX compiler',
      code: "import * as stylex from '@stylexjs/stylex'",
      errors: 1,
    },
    {
      name: 'the raw tokens',
      code: "import { space } from '@repo/ui/styles/tokens.stylex'",
      errors: 1,
    },
  ],
})

tester.run('no-raw-length', noRawLength, {
  valid: [
    {
      name: 'a token',
      code: "const s = stylex.create({ a: { padding: space['1'] } })",
    },
    {
      name: 'a negated token',
      code: 'const s = stylex.create({ a: { margin: `-${size.px}` } })',
    },
    {
      name: 'zero, a keyword and a relative length',
      code: "const s = stylex.create({ a: { margin: 0, width: '100%', fontSize: '0.9em', height: 'auto' } })",
    },
    {
      name: 'a container width past the scale',
      code: "const s = stylex.create({ a: { maxWidth: '40rem', width: 1400 } })",
    },
    {
      name: 'a property with no scale',
      code: 'const s = stylex.create({ a: { borderWidth: 1, lineHeight: 1.5, zIndex: 10 } })',
    },
    {
      name: 'outside stylex.create',
      code: 'const options = { padding: 10 }',
    },
  ],
  invalid: [
    {
      name: 'a bare number, which StyleX reads as pixels',
      code: 'const s = stylex.create({ a: { padding: 3 } })',
      errors: 1,
    },
    {
      name: 'a length string',
      code: "const s = stylex.create({ a: { gap: '1px', fontSize: '0.8rem' } })",
      errors: 2,
    },
    {
      name: 'a negative number',
      code: 'const s = stylex.create({ a: { bottom: -5 } })',
      errors: 1,
    },
    {
      name: 'a value under a condition',
      code: "const s = stylex.create({ a: { marginTop: { default: null, ':hover': 1, [stylex.when.ancestor(':focus')]: '2px' } } })",
      errors: 2,
    },
    {
      name: 'inside a pseudo-element',
      code: "const s = stylex.create({ a: { '::after': { height: 2 } } })",
      errors: 1,
    },
    {
      name: 'a dynamic style',
      code: 'const s = stylex.create({ a: (w) => ({ width: w, borderRadius: 9999 }) })',
      errors: 1,
    },
    {
      name: 'a width within the scale',
      code: 'const s = stylex.create({ a: { width: 384 } })',
      errors: 1,
    },
  ],
})

tester.run('no-type-size', noTypeSize, {
  valid: [
    {
      name: 'a composed step',
      code: "const s = stylex.create({ a: { fontWeight: 500 } })\nconst b = <p sx={[textStyles['2'], s.a]} />",
    },
    {
      name: 'outside stylex.create',
      code: 'const options = { fontSize: 13 }',
    },
  ],
  invalid: [
    {
      name: 'a size and its leading',
      code: "const s = stylex.create({ a: { fontSize: fontSize['2'], lineHeight: lineHeight['2'] } })",
      errors: 2,
    },
    {
      name: 'a leading alone',
      code: 'const s = stylex.create({ a: { lineHeight: 1 } })',
      errors: 1,
    },
    {
      name: 'inside a pseudo-element',
      code: "const s = stylex.create({ a: { '::after': { fontSize: '1rem' } } })",
      errors: 1,
    },
    {
      name: 'a dynamic style',
      code: 'const s = stylex.create({ a: (size) => ({ fontSize: size }) })',
      errors: 1,
    },
  ],
})

tester.run('no-raw-shadow', noRawShadow, {
  valid: [
    {
      name: 'a token, under a condition',
      code: "const s = stylex.create({ a: { boxShadow: { default: null, ':focus-visible': shadows.focusRing } } })",
    },
    {
      name: 'none',
      code: "const s = stylex.create({ a: { boxShadow: 'none' } })",
    },
    {
      name: 'outside stylex.create',
      code: "const options = { boxShadow: '0 1px 2px black' }",
    },
  ],
  invalid: [
    {
      name: 'a literal',
      code: "const s = stylex.create({ a: { boxShadow: '0 8px 24px rgb(0 0 0 / 0.12)' } })",
      errors: 1,
    },
    {
      name: 'a template under a condition',
      code: "const s = stylex.create({ a: { boxShadow: { default: null, ':hover': `0 0 0 1px ${colors.ring}` } } })",
      errors: 1,
    },
    {
      name: 'a local constant',
      code: "const ring = '0 0 0 3px red'\nconst s = stylex.create({ a: { boxShadow: ring } })",
      errors: 1,
    },
    {
      name: 'a custom property holding a shadow',
      code: "const s = stylex.create({ a: { '--tooltip-shadow': '0 1px 2px black' } })",
      errors: 1,
    },
  ],
})
