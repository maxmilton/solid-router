import solid from 'vite-plugin-solid';
import { defineConfig } from 'vitest/config';

// NOTE: Tests use jsdom environment, by default but you can add a comment
// at the top of your test file to change it: `// @vitest-environment node`.

export default defineConfig({
  plugins: [solid()],
  test: {
    coverage: {
      reporter: ['text', 'lcov'],
      provider: 'v8',
    },
    deps: {}, // HACK: Magically fixes issues with @solidjs/testing-library
    environment: 'jsdom', // 'happy-dom' doesn't support features we need to test
    include: ['test/unit/**/*.test.{ts,tsx}'],
    setupFiles: ['node_modules/@testing-library/jest-dom/extend-expect'],

    // XXX: If you're having really funky issues in tests, try uncommenting these
    // threads: false,
    // isolate: false,
    // globals: true,
  },
  resolve: {
    conditions: ['development', 'browser'],
  },
});
