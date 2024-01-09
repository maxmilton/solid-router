'use strict'; // eslint-disable-line

const OFF = 0;
const WARN = 1;
const ERROR = 2;

/** @type {import('eslint/lib/shared/types').ConfigData & { parserOptions: import('@typescript-eslint/types').ParserOptions }} */
module.exports = {
  root: true,
  reportUnusedDisableDirectives: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: ['tsconfig.json', 'tsconfig.node.json'],
    tsconfigRootDir: __dirname,
  },
  extends: [
    'eslint:recommended',
    'airbnb-base',
    'airbnb-typescript/base',
    'plugin:@typescript-eslint/strict-type-checked',
    'plugin:@typescript-eslint/stylistic-type-checked',
    'plugin:unicorn/recommended',
    'prettier',
  ],
  plugins: ['prettier'],
  settings: {
    'import/resolver': {
      node: {
        // add .tsx to airbnb-typescript/base
        extensions: ['.mjs', '.js', '.jsx', '.json', '.ts', '.tsx', '.d.ts'],
      },
    },
  },
  rules: {
    '@typescript-eslint/explicit-module-boundary-types': ERROR,
    '@typescript-eslint/no-confusing-void-expression': WARN,
    '@typescript-eslint/no-non-null-assertion': WARN,
    'import/order': OFF, // broken with prettier
    'import/prefer-default-export': OFF,
    'no-plusplus': OFF,
    'no-restricted-globals': WARN,
    'unicorn/filename-case': OFF,
    'unicorn/no-abusive-eslint-disable': WARN,
    'unicorn/no-null': OFF,
    'unicorn/prefer-module': OFF,
    'unicorn/prefer-node-protocol': OFF,
    'unicorn/prevent-abbreviations': OFF,

    // browser support is too low
    '@typescript-eslint/prefer-optional-chain': OFF,
    // worse performance
    '@typescript-eslint/prefer-string-starts-ends-with': OFF,
  },
  overrides: [
    {
      files: [
        '*.spec.ts',
        '*.test.tsx',
        '*.test.ts',
        'build.ts',
        '*.config.ts',
        '*.d.ts',
      ],
      rules: {
        'import/no-extraneous-dependencies': OFF,
      },
    },
    {
      files: ['*.test.tsx', '*.test.ts'],
      extends: ['plugin:vitest/all'],
      rules: {
        'vitest/max-expects': OFF,
        'vitest/no-hooks': OFF,
        'vitest/require-top-level-describe': OFF,
      },
    },
  ],
};
