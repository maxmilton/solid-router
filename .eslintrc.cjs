const OFF = 0;
const WARN = 1;
const ERROR = 2;

module.exports = {
  root: true,
  reportUnusedDisableDirectives: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: ['./test/tsconfig.json'],
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
    'plugin:security/recommended',
  ],
  settings: {
    'import/resolver': {
      node: {
        // add .tsx to airbnb-typescript/base
        extensions: ['.js', '.jsx', '.json', '.ts', '.tsx', '.d.ts'],
      },
    },
  },
  rules: {
    '@typescript-eslint/explicit-module-boundary-types': ERROR,
    // used safely in this project
    '@typescript-eslint/no-non-null-assertion': OFF,
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
      files: ['test/**'],
      extends: ['plugin:jest/recommended', 'plugin:jest/style'],
      rules: {
        '@typescript-eslint/unbound-method': 'off', // replaced by jest/unbound-method
        'import/no-extraneous-dependencies': OFF,
        'jest/unbound-method': 'error',
      },
    },
  ],
};
