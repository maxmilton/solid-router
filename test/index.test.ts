/** @jest-environment jsdom */
/* eslint-disable no-restricted-syntax */

import * as allExports from '../src/index';

const publicExports = [
  ['routeTo', 'Function'],
  ['Router', 'Function'],
  ['NavLink', 'Function'],
  ['useURLParams', 'Function'],
] as const;

for (const [name, type] of publicExports) {
  test(`exports public "${name}" ${type}`, () => {
    expect.assertions(2);
    expect(allExports).toHaveProperty(name);
    expect(Object.prototype.toString.call(allExports[name])).toBe(`[object ${type}]`);
  });
}

test('does not export any private internals', () => {
  expect.assertions(5);
  const allPublicExportNames = publicExports.map((x) => x[0]);
  expect(allPublicExportNames).toHaveLength(Object.keys(allExports).length);
  // eslint-disable-next-line guard-for-in
  for (const name in allExports) expect(allPublicExportNames).toContain(name);
});

test('has no default export', () => {
  expect.assertions(3);
  // XXX: `allExports.default` is a synthetic default created by TS at test runtime
  // @ts-expect-error - yes default does not exist
  expect(allExports.default).toBeUndefined();
  expect(typeof require('../dist/index.jsx')).toBe('object'); // eslint-disable-line
  expect(require('../dist/index.jsx').default).toBeUndefined(); // eslint-disable-line
});
