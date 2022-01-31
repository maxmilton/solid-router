/** @type {import('prettier').Config} */
module.exports = {
  arrowParens: 'always',
  endOfLine: 'lf',
  singleQuote: true,
  trailingComma: 'all',
  plugins: [
    './node_modules/prettier-plugin-pkg',
    './node_modules/prettier-plugin-sh',
  ],
  overrides: [
    {
      files: ['*.test.tsx', '*.test.ts'],
      options: {
        printWidth: 100,
      },
    },
  ],
};
