import { nodeProject } from './src/vitest/node.ts'

/** The Vite plugins config ships carry logic, so they have tests in Node. */
export default nodeProject('config', { include: ['src/**/*.test.ts'] })
