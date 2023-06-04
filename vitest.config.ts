import solid from 'vite-plugin-solid';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [solid()],
  test: {
    deps: {
      registerNodeLoader: true,
      inline: [/solid-js/],
    },
    environment: 'jsdom',
    globals: true,
    include: ['test/unit/**/*.test.{ts,tsx}'],
    setupFiles: ['node_modules/@testing-library/jest-dom/extend-expect'],
    transformMode: { web: [/\.[jt]sx?$/] },
  },
  resolve: {
    conditions: ['development', 'browser'],
  },
});
