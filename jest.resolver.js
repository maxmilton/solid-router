/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable no-nested-ternary */

/* !BROKEN!* @type {import('jest-resolve/build/defaultResolver')} */
// Use defaultResolver to leverage its cache, error handling, etc.
// @ts-expect-error - bad jest-resolve types
module.exports = (request, options) => options.defaultResolver(request, {
  ...options,
  // @ts-expect-error - bad jest-resolve types
  packageFilter(pkg) {
    return pkg.name.includes('solid-js')
      ? {
        ...pkg,
        main:
              typeof pkg.browser === 'object'
                ? pkg.browser[Object.keys(pkg.browser)[0]]
                : typeof pkg.browser === 'string'
                  ? pkg.browser
                  : pkg.main,
      }
      : pkg;
  },
});
