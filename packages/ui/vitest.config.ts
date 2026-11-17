import { storybookProject } from '@repo/config/vitest/storybook'

/** Every story is a test; see `storybookProject`. */
export default storybookProject('ui', import.meta.dirname)
