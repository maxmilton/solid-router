import solid from 'vite-plugin-solid';
import { defineConfig } from 'vitest/config';

// NOTE: Tests use jsdom environment, by default but you can add a comment
// at the top of a test file to change it: `// @vitest-environment node`.

export default defineConfig({
  plugins: [solid()],
  test: {
    coverage: {
      reporter: process.env.CI ? ['text', 'lcov'] : ['text'],
      provider: 'v8',
    },
    environment: 'jsdom', // 'happy-dom' doesn't support features we need to test
    include: ['test/unit/**/*.test.{ts,tsx}'],
    setupFiles: ['node_modules/@testing-library/jest-dom/vitest'],
  },
  resolve: {
    conditions: ['development', 'browser'],
  },
});
