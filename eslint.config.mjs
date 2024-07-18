import { fixupPluginRules } from '@eslint/compat';
import { FlatCompat } from '@eslint/eslintrc';
import eslint from '@eslint/js';
import unicorn from 'eslint-plugin-unicorn';
import vitest from 'eslint-plugin-vitest';
// eslint-disable-next-line import/no-unresolved
import tseslint from 'typescript-eslint';

const compat = new FlatCompat({
  baseDirectory: import.meta.dirname,
});

const OFF = 0;
const WARN = 1;
const ERROR = 2;

export default tseslint.config(
  eslint.configs.recommended,
  ...compat.extends('airbnb-base').map((config) => ({
    ...config,
    plugins: {}, // delete
  })),
  ...compat.extends('airbnb-typescript/base'),
  ...tseslint.configs.strictTypeChecked,
  ...tseslint.configs.stylisticTypeChecked,
  // @ts-expect-error - no types
  // eslint-disable-next-line
  unicorn.configs['flat/recommended'],
  {
    linterOptions: {
      reportUnusedDisableDirectives: WARN,
    },
    languageOptions: {
      parserOptions: {
        project: ['tsconfig.json', 'tsconfig.node.json'],
        tsconfigRootDir: import.meta.dirname,
      },
    },
    plugins: {
      import: fixupPluginRules(
        compat.plugins('eslint-plugin-import')[0].plugins?.import ?? {},
      ),
    },
    settings: {
      'import/resolver': {
        node: {
          // add .tsx to airbnb-typescript/base
          // https://github.com/iamturns/eslint-config-airbnb-typescript/blob/master/lib/shared.js#L20-L22
          extensions: ['.mjs', '.js', '.jsx', '.json', '.ts', '.tsx', '.d.ts'],
        },
      },
    },
    rules: {
      '@typescript-eslint/explicit-module-boundary-types': ERROR,
      '@typescript-eslint/no-confusing-void-expression': WARN,
      '@typescript-eslint/no-non-null-assertion': WARN,
      'import/prefer-default-export': OFF,
      'no-restricted-globals': WARN,
      'no-restricted-syntax': OFF,
      'no-void': OFF,
      'unicorn/filename-case': OFF,
      'unicorn/import-style': WARN,
      'unicorn/no-abusive-eslint-disable': WARN,
      'unicorn/no-null': OFF,
      'unicorn/prefer-node-protocol': OFF, // we support node v12+
      'unicorn/prefer-module': WARN,
      'unicorn/prefer-top-level-await': WARN,
      'unicorn/prevent-abbreviations': OFF,

      /* Covered by biome formatter */
      '@typescript-eslint/indent': OFF,
      'function-paren-newline': OFF,
      'implicit-arrow-linebreak': OFF,
      'max-len': OFF,
      'object-curly-newline': OFF,
      'operator-linebreak': OFF,
      'unicorn/no-nested-ternary': OFF,

      /* Performance and byte savings */
      // browser support is too low
      '@typescript-eslint/prefer-optional-chain': OFF,
      // alternatives offer byte savings and better performance
      '@typescript-eslint/prefer-string-starts-ends-with': OFF,
      // byte savings
      'no-plusplus': OFF,
      // worse performance and poor browser support
      'unicorn/prefer-string-replace-all': OFF,
      // byte savings (minification doesn't currently automatically remove)
      'unicorn/switch-case-braces': [ERROR, 'avoid'],
    },
  },
  {
    files: [
      '*.config.mjs',
      '*.config.ts',
      '*.d.ts',
      '**/*.spec.tsx',
      '**/*.spec.ts',
      '**/*.test.tsx',
      '**/*.test.ts',
      'build.ts',
      'test/**',
    ],
    rules: {
      'import/no-extraneous-dependencies': OFF,
    },
  },
  {
    files: ['test/fixtures/**'],
    rules: {
      'import/no-relative-packages': OFF,
    },
  },
  {
    files: ['test/unit/**/*.test.tsx', 'test/unit/**/*.test.ts'],
    plugins: {
      vitest,
    },
    rules: {
      ...vitest.configs.all.rules,
      'vitest/max-expects': OFF,
      'vitest/no-hooks': OFF,
      'vitest/require-top-level-describe': OFF,
    },
  },
  {
    ignores: ['**/*.bak', '**/dist/**', 'coverage/**'],
  },
);
