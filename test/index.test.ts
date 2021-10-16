/** @jest-environment jsdom */
/* eslint-disable no-restricted-syntax */

import * as allExports from '../src/index';

const publicExports = [
  ['routeTo', 'function'],
  ['Router', 'function'],
  ['NavLink', 'function'],
] as const;

for (const [name, type] of publicExports) {
  test(`exports public "${name}" ${type}`, () => {
    expect.assertions(2);
    expect(name in allExports).toBe(true);
    expect(typeof allExports[name]).toBe(type);
  });
}

test('does not export any private internals', () => {
  expect.assertions(2);
  const allPublicExportNames = [
    ...publicExports.map((x) => x[0]),
    'default', // synthetic default created by TS at test runtime
  ];
  const remainingExports = Object.keys(allExports);
  expect(remainingExports.length >= publicExports.length).toBe(true);
  for (const name of allPublicExportNames) {
    remainingExports.splice(remainingExports.indexOf(name), 1);
  }
  expect(remainingExports).toHaveLength(0);
});

test('has no default export', () => {
  expect.assertions(3);
  // XXX: `allExports.default` is a synthetic default created by TS at test runtime
  // @ts-expect-error - yes default does not exist
  expect(allExports.default).toBeUndefined();
  expect(typeof require('../dist/index.jsx')).toBe('object'); // eslint-disable-line
  expect(require('../dist/index.jsx').default).toBeUndefined(); // eslint-disable-line
});
