# lorem-click

## 0.1.0

### Minor Changes

- [#1](https://github.com/magicspon/lorem/pull/1) [`d13c162`](https://github.com/magicspon/lorem/commit/d13c1624f5a8d48b5d3b67f44c93e353ddd76559) Thanks [@magicspon](https://github.com/magicspon)! - The text now grows and shrinks smoothly with how much you ask for, and starts much larger: the default ten words show at about twice their old size.

- [#1](https://github.com/magicspon/lorem/pull/1) [`ed886b1`](https://github.com/magicspon/lorem/commit/ed886b105f9d261fda6d014406e26b57f914c1b4) Thanks [@magicspon](https://github.com/magicspon)! - The site now has a `/humans.txt` that credits the people and tools behind it, and each page links to it.

- [`d0ab691`](https://github.com/magicspon/lorem/commit/d0ab691f993da89110b2ac20650fc16d7ddc8021) Thanks [@magicspon](https://github.com/magicspon)! - A new app, lorem.click, makes placeholder text to copy: pick how many words, sentences or paragraphs and the text updates as you choose. Every page is a link, such as `/?count=3&kind=paragraphs`.

- [`dcd39f0`](https://github.com/magicspon/lorem/commit/dcd39f0fb501ed537b874d2cf46555f7d211015b) Thanks [@magicspon](https://github.com/magicspon)! - The kinds list no longer offers a single sentence, a single paragraph, lines or a block of text. The page now opens on 10 words, and an old link that asks for a removed kind opens that instead.

- [`dcd39f0`](https://github.com/magicspon/lorem/commit/dcd39f0fb501ed537b874d2cf46555f7d211015b) Thanks [@magicspon](https://github.com/magicspon)! - The form is now one line on a frosted panel in the middle of the page, with icon buttons to copy and to make new text. On a phone the name is left off so the controls fit. The text sits centred behind it. Click anywhere outside the form to copy the text.

- [`dcd39f0`](https://github.com/magicspon/lorem/commit/dcd39f0fb501ed537b874d2cf46555f7d211015b) Thanks [@magicspon](https://github.com/magicspon)! - The page now has a faded backdrop of glitching letters, which react to your cursor and clicks.

- [`dcd39f0`](https://github.com/magicspon/lorem/commit/dcd39f0fb501ed537b874d2cf46555f7d211015b) Thanks [@magicspon](https://github.com/magicspon)! - The app now works offline and can be installed. The text is made in your browser, so New text no longer waits for the network.

- [`dcd39f0`](https://github.com/magicspon/lorem/commit/dcd39f0fb501ed537b874d2cf46555f7d211015b) Thanks [@magicspon](https://github.com/magicspon)! - The generated text now decodes from scrambled characters as it appears, scrambles near your cursor, and sends a scramble wave out from where you click to copy.

- [`dcd39f0`](https://github.com/magicspon/lorem/commit/dcd39f0fb501ed537b874d2cf46555f7d211015b) Thanks [@magicspon](https://github.com/magicspon)! - The text's size now follows what you ask for: a few words show large, and many paragraphs show smaller.

### Patch Changes

- [`dcd39f0`](https://github.com/magicspon/lorem/commit/dcd39f0fb501ed537b874d2cf46555f7d211015b) Thanks [@magicspon](https://github.com/magicspon)! - `pnpm dev:portless` serves the app at its own `https://*.lorem-click.localhost` address for each checkout, so several copies can run at once.

- [#1](https://github.com/magicspon/lorem/pull/1) [`c98eaa1`](https://github.com/magicspon/lorem/commit/c98eaa11877d3f0d6bd6d33c2327061ff07d184c) Thanks [@magicspon](https://github.com/magicspon)! - Production now deploys only when a release bumps the app's version, so each deploy matches a changelog entry. Pull request previews still deploy as before.
- Updated dependencies [[`d13c162`](https://github.com/magicspon/lorem/commit/d13c1624f5a8d48b5d3b67f44c93e353ddd76559), [`d13c162`](https://github.com/magicspon/lorem/commit/d13c1624f5a8d48b5d3b67f44c93e353ddd76559), [`8472d5e`](https://github.com/magicspon/lorem/commit/8472d5e6d6de1c4b013f0fcc06d6e104a81f022d), [`dcd39f0`](https://github.com/magicspon/lorem/commit/dcd39f0fb501ed537b874d2cf46555f7d211015b), [`dcd39f0`](https://github.com/magicspon/lorem/commit/dcd39f0fb501ed537b874d2cf46555f7d211015b), [`dcd39f0`](https://github.com/magicspon/lorem/commit/dcd39f0fb501ed537b874d2cf46555f7d211015b)]:
  - @repo/ui@0.1.0
