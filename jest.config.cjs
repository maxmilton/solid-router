/** @type {import('@jest/types').Config.InitialOptions} */
module.exports = {
  collectCoverageFrom: ['src/**/*.{ts,tsx}'],
  coverageProvider: 'v8',
  coverageReporters: ['text', 'lcovonly'],
  resolver: require.resolve('./jest-resolver.cjs'),
  testRegex: '(/__tests__/.*|\\.test)\\.tsx?$',
  transformIgnorePatterns: ['node_modules/(?!solid-js.*|.*(?<=.[tj]sx))$'],
  verbose: true,
};
