import { Features, type TransformOptions } from 'lightningcss'

/**
 * Options for the Lightning CSS pass the StyleX plugin runs on the CSS it
 * collects, as its `lightningcssOptions`.
 *
 * With no browserslist config the pass targets browsers older than
 * `light-dark()` and rewrites each one into a pair of `--lightningcss-light`
 * and `--lightningcss-dark` fallbacks. Those only work where it also rewrites
 * `color-scheme`, which it never sees here: it is in `globals.css` and in
 * the themes. Every colour token is a `light-dark()`, so the rewrite left two
 * colours in each one, an invalid value. Every browser we support has
 * `light-dark()`, so it is left as written.
 */
export const stylexLightningcss = {
  exclude: Features.LightDark,
} satisfies Partial<TransformOptions<never>>
