import { nodeProject } from '@repo/config/vitest/node'

/** The generator's tests run in Node; the app has no stories yet. */
export default nodeProject('lorem-click', { include: ['src/**/*.test.ts'] })
