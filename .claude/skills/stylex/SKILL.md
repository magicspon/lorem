---
name: stylex
description: >
  Write or fix StyleX styles in tuesday: `stylex.create`, tokens, themes, markers, keyframes,
  responsive and pseudo-class conditions. Use when adding or changing a ui component's styles,
  when a StyleX compile or type error appears, or when unsure which StyleX API fits.
---

# StyleX in tuesday

Two sources, in this order:

1. **The house rules** below, and the component rules in `packages/ui/AGENTS.md`. They win.
2. **The upstream guide**: [`reference/authoring.md`](reference/authoring.md), StyleX's own
   authoring guide for LLMs. Read it for any API the house rules do not cover (`firstThatWorks`,
   `viewTransitionClass`, `positionTry`, `when.siblingBefore`, `StyleXStylesWithout`, and so on).

## House rules

The compiler and types accept less than they appear to.

- **Where things live.** Tokens in `src/styles/tokens.stylex.ts`, `darkTheme` in `themes.ts`,
  keyframes in `animations.ts`, styles several components share in `shared.ts`, shadows in
  `shadows.stylex.ts`. `globals.css` holds only the reset and font. Each component keeps its
  styles in a local `stylex.create`.
- **Type comes from `textStyles`.** `fontSize`, `lineHeight` and leading trim are set only in
  `typography/type-styles.ts`. A part composes a step before its own styles
  (`sx={[textStyles['2'], styles.label]}`, `textStyles.control` for typed-in text), or renders
  `Text` or `Heading` (`tuesday/no-type-size`).
- **Gap, padding and margin come from `space`**, nine steps: `space['3']` is 0.75rem. The key is
  the step; its type is `Space`. A negative or `calc()` interpolates it: `` `-${space['1']}` ``.
- **Other lengths come from `size`**, keyed by multiples of 0.25rem (`size['9']` is 2.25rem). Add a
  missing length to `size`; only container widths past the scale stay literal. A hairline is
  `size.px`, a pill `radii.full`. StyleX reads a bare number as pixels (`tuesday/no-raw-length`).
- **Shadows are tokens.** A shadow reads `colors`, so `darkTheme` declares the shadows again; add a
  new one to both (`tuesday/no-raw-shadow`).
- **A token picked at runtime goes through a static map.** `create()` takes only a literal object,
  so a map keyed by token (`gap`, `padding` in `src/layout/`) spells out each step, and the prop's
  type is `keyof` the map.
- **Selectors are local `const` strings** in the file that uses them. Write
  `stylex.when.ancestor(...)` inline in the style key: a `const` holding it runs in the browser
  and throws.
- **Ancestor state goes through markers.** Give the ancestor `stylex.defaultMarker()` and key the
  child on `stylex.when.ancestor(':is([data-slot=…][data-…])')`, naming the slot so nested parts
  stay apart.
- **Conditions on one property are mutually exclusive**, because output order is not source
  order. Narrow each one: `':hover:not([data-selected])'`.
- **A pseudo-element takes plain values.** Choose `::after` styles in JavaScript, or set a custom
  property on the part with conditions and read it inside `::after`.
- **Icons passed as children** are sized from the part with a `':where(*) svg'` key on `width` and
  `height`.
- **`styleProps`** is for inside a part only, where it merges Base UI's `style`. `stylexSx` in
  `@repo/config` adds the StyleX import a file using only `sx` needs.

## Where upstream and tuesday differ

The upstream examples are written for a plain StyleX app. Translate them:

| Upstream writes                                | tuesday writes                                                                                                           |
| ---------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| `<div {...stylex.props(a, b)} />`              | `<div sx={[a, b]} />` on any native element; the compiler rewrites it to the `stylex.props` spread.                      |
| `<Card style={styles.x} />` on a component     | `<Card sx={styles.x} />` on a ui component (or the app's `Link`): `sx` is its own prop, merged after its styles.         |
| `style?: StyleXStyles` prop when writing one   | `sx?: Sx`, with `WithSx<P>` dropping `className`; resolve with `styleProps([...local, sx], style)` from `src/lib/sx.ts`. |
| `padding: 16`, `gap: 8` (pixels)               | `padding: space['4']`, `gap: space['2']` from `tokens.stylex.ts`. Other lengths from `size`.                             |
| Breakpoints in a shared `defineConsts`         | A local `const MD = '@media (min-width: 48rem)'` in the file that uses it (see `responsive-styles.ts`).                  |
| `stylex.keyframes()` beside the component      | Keyframes in `src/styles/animations.ts`; the component composes its exported styles.                                     |
| A `margin`/`width` prop to tweak a component   | A named variant on the component.                                                                                        |
| `colors.primary` from a hand-rolled token file | The tokens already in `tokens.stylex.ts` (`colors`, `radii`, `space`, `size`, `fontSize`…); `darkTheme` in `themes.ts`.  |

`sx` works in exactly those two places: native elements, and components that take it out and
resolve it. A component from another package (the router's `Link`, a Base UI part, an icon)
ignores it, so give it its look another way, such as a ui part rendering it through `render`.

## Rules both sources agree on

- Conditions (`:hover`, `@media`, `stylex.when.*`) nest inside a property value with a
  `default` key, never at the top level of a namespace. Use `null` for "no style by default".
- Only StyleX values go into `stylex.create`: literals, tokens from `*.stylex.ts` files, and
  arrow functions for runtime values.
- `defineVars` for themed values, `defineConsts` for fixed ones. Both live in a `.stylex.ts` file
  that holds nothing but named exports of them.
- An element styled by StyleX takes no `className` or `style` of its own.
- Prefer a real element to `::before`/`::after`, and JavaScript to `:nth-child`.

## Done when

- `pnpm typecheck` passes and the component's stories render (`pnpm storybook:ui`, or the
  `ui` Vitest project).
- `pnpm check` passes, including `tuesday/sx-on-foreign-component` and
  `tuesday/no-local-styles`.
