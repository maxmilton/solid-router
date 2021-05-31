/** @jest-environment jsdom */

import * as allExports from '../src/index';

const publicExports = [
  ['routeTo', 'function'],
  ['Router', 'function'],
  ['NavLink', 'function'],
] as const;

publicExports.forEach(([name, type]) => {
  test(`exports public "${name}" ${type}`, () => {
    expect.assertions(2);
    expect(name in allExports).toStrictEqual(true);
    expect(typeof allExports[name]).toBe(type);
  });
});

test('does not export any private internals', () => {
  expect.assertions(2);
  const allPublicExportNames = [
    ...publicExports.map((x) => x[0]),
    'default', // synthetic default created by TS at test runtime
  ];
  const remainingExports = Object.keys(allExports);
  expect(remainingExports.length >= publicExports.length).toStrictEqual(true);
  allPublicExportNames.forEach((name) => {
    remainingExports.splice(remainingExports.indexOf(name), 1);
  });
  expect(remainingExports).toHaveLength(0);
});

test('has no default export', () => {
  expect.assertions(3);
  // XXX: `allExports.default` is a synthetic default created by TS at test runtime
  // @ts-expect-error - created by TS at runtime
  expect(allExports.default).toBeUndefined(); // eslint-disable-line
  expect(typeof require('../dist/index')).toBe('object'); // eslint-disable-line
  expect(require('../dist/index').default).toBeUndefined(); // eslint-disable-line
});
