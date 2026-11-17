# @repo/ui

## 0.1.0

### Minor Changes

- [#1](https://github.com/magicspon/lorem/pull/1) [`d13c162`](https://github.com/magicspon/lorem/commit/d13c1624f5a8d48b5d3b67f44c93e353ddd76559) Thanks [@magicspon](https://github.com/magicspon)! - New `fluidTextStyles(scale)` in `@repo/ui/typography/fluid-text` sizes display text off the type scale: from step 4 at `0` up to a word or two filling the window at `1`.

- [#1](https://github.com/magicspon/lorem/pull/1) [`d13c162`](https://github.com/magicspon/lorem/commit/d13c1624f5a8d48b5d3b67f44c93e353ddd76559) Thanks [@magicspon](https://github.com/magicspon)! - The font is now Geist Mono instead of Inter. Every font token (`sans`, `heading` and `mono`) and the global CSS use it.

- [#1](https://github.com/magicspon/lorem/pull/1) [`8472d5e`](https://github.com/magicspon/lorem/commit/8472d5e6d6de1c4b013f0fcc06d6e104a81f022d) Thanks [@magicspon](https://github.com/magicspon)! - `Stage.Front` now casts a large, soft shadow evenly on every side, from the new `shadows.stage` token.

- [`dcd39f0`](https://github.com/magicspon/lorem/commit/dcd39f0fb501ed537b874d2cf46555f7d211015b) Thanks [@magicspon](https://github.com/magicspon)! - New `LetterGlitch` in `@repo/ui/effects/letter-glitch`: a WebGL 2 field of letters that scramble and glitch, adapted from React Bits. Use `variant="backdrop"` to fix it behind the whole page, and `opacity` to fade it behind content. It follows the system's colour scheme and holds still for reduced motion.

- [`dcd39f0`](https://github.com/magicspon/lorem/commit/dcd39f0fb501ed537b874d2cf46555f7d211015b) Thanks [@magicspon](https://github.com/magicspon)! - New `ScrambledText` in `@repo/ui/effects/scrambled-text`: text whose letters scramble, lift, blur or magnify near the pointer and fade in and decode as they scroll into view, adapted from React Bits with GSAP. It takes its font and colour from around it, and screen readers read the text once, as plain text.

- [`dcd39f0`](https://github.com/magicspon/lorem/commit/dcd39f0fb501ed537b874d2cf46555f7d211015b) Thanks [@magicspon](https://github.com/magicspon)! - New `Stage` in `@repo/ui/layout/stage`: `Stage.Back` fills the window and scrolls on its own, and `Stage.Front` floats a frosted-glass panel in the middle, over it. Set `align="center"` on the back to centre short content, and `cursor="copy"` when clicking it copies.
