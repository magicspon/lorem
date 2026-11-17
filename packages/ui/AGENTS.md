# @repo/ui

Styles follow the `stylex` skill.

## Components

- One folder per component in `src/<group>/<name>/`: `<name>.tsx`, `<name>.stories.tsx` and an
  `index.ts` barrel, exported as `@repo/ui/<group>/<name>`. Add each folder to `exports` in
  `package.json`.
- A component with several parts is a **namespace**:
  `import * as Card from '@repo/ui/layout/card'`, then `Card.Root`, `Card.Header`,
  `Card.RootProps`. Parts keep their prefixed names (`CardHeader`) in their own file; the barrel
  maps each to its short name (`CardHeader as Header`, the component `as Root`, its props
  `as RootProps`). Inside ui, import the barrel (`#/layout/card/index.ts`). A one-part component
  (`Button`, `Text`) stays a named export.
- Every part takes `sx` (merged after its own styles) and no `className`; `WithSx` in
  `src/lib/sx.ts` drops it. To give a non-ui element a component's look, pass its exported styles
  (`sx={buttonStyles()}`) or render the component with `render`.
- A link that looks like a button is a link with `sx={buttonStyles(…)}`. Avoid
  `<Button render={<Link />}>`, which gives a link button behaviour.
- Combine looks into a few named variants rather than width or gap props.
- The layout primitives (`Box`, `Flex`, `Stack`, `Grid`, `Container`, `Section`, `List`) in
  `src/layout/` take tokens only. `display`, `direction`, `gap` and `columns` take a value per
  breakpoint (`direction={{ initial: 'column', md: 'row' }}`) through `responsive-styles.ts`.
  A part that renders a plain `div` or `ul` laying out children is built on one, keeping its own
  `data-slot`.
- Text is `Text` and `Heading` from `typography/`, on the type scale (`fontSize` 1 to 9); a
  heading's `level` sets the element and `size` its look.
