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
    'plugin:@typescript-eslint/eslint-recommended',
    'airbnb-base',
    'airbnb-typescript/base',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
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
    // used safely in this project
    '@typescript-eslint/no-non-null-assertion': OFF,
    'import/prefer-default-export': OFF,
    'no-plusplus': OFF,
    'no-restricted-globals': WARN,
    'unicorn/filename-case': OFF,
    'unicorn/no-abusive-eslint-disable': WARN,
    'unicorn/no-null': OFF,
    'unicorn/prefer-add-event-listener': OFF,
    'unicorn/prefer-dom-node-append': OFF,
    'unicorn/prefer-module': OFF,
    'unicorn/prefer-node-protocol': OFF,
    'unicorn/prefer-query-selector': OFF,
    'unicorn/prevent-abbreviations': OFF,
  },
  overrides: [
    {
      files: ['*.config.ts', 'test/**'],
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
