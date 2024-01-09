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
    environment: 'jsdom', // 'happy-dom' doesn't support features we need to test
    include: ['test/unit/**/*.test.{ts,tsx}'],
    setupFiles: ['node_modules/@testing-library/jest-dom/vitest'],

    server: {
      // HACK: Fixes issues with @solidjs/testing-library
      deps: {
        // Solid needs to be inline to work around a resolution issue in vitest
        // with node v20+; https://github.com/solidjs/solid-testing-library/issues/38
        inline: [/solid-js/],
      },
    },

    // XXX: If you're having funky issues in tests, try uncommenting these
    // threads: false,
    // isolate: false,
    // globals: true,
  },
  resolve: {
    conditions: ['development', 'browser'],
  },
});
