import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['packages/**/*.test.ts', 'packages/**/*.test.tsx', 'apps/**/*.test.ts', 'apps/**/*.test.tsx', '__tests__/**/*.test.ts'],
    pool: 'forks',
    environmentMatchGlobs: [
      ['packages/**/*.test.tsx', 'jsdom'],
      ['apps/**/*.test.tsx', 'jsdom'],
    ],
  },
});
