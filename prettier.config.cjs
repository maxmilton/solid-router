/** @type {import('prettier').Config} */
module.exports = {
  arrowParens: 'always',
  endOfLine: 'lf',
  singleQuote: true,
  trailingComma: 'all',
  pluginSearchDirs: ['.'], // fixes pnpm
  overrides: [
    {
      files: ['*.test.tsx', '*.test.ts'],
      options: {
        printWidth: 100,
      },
    },
  ],
};
