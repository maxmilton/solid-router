/** @jest-environment jsdom */

import { useURLParams } from '../src';

function setURL(url: string) {
  const oldLocation = window.location;
  const location = new URL(url);
  // @ts-expect-error - replace with mock
  delete window.location;
  // @ts-expect-error - simple mock
  window.location = location;

  return () => {
    window.location = oldLocation;
  };
}

// TODO: Break up tests + more and better tests

test('read works as expected', () => {
  expect.assertions(3);
  const reset1 = setURL('http://localhost/');
  const [read1] = useURLParams();
  expect(read1()).toEqual({});
  reset1();
  const reset2 = setURL(
    'http://localhost/?a=1&b=2&c=3&c=4&d&c=null&c=undefined&c=0&c=false&c=true',
  );
  const [read2] = useURLParams();
  expect(read2()).toEqual({
    a: 1,
    b: 2,
    c: [3, 4, 'null', 'undefined', 0, false, true],
    d: '',
  });
  reset2();
  const reset3 = setURL('http://localhost/?ab_c=123.456&_def=1.00&-x-=-0.1&&&&');
  const [read3] = useURLParams();
  expect(read3()).toEqual({
    ab_c: 123.456,
    _def: 1,
    '-x-': -0.1,
  });
  reset3();
});

test('set works as expected', () => {
  expect.assertions(10);
  const [read, set] = useURLParams();
  expect(window.location.search).toBe('');
  expect(read()).toEqual({});
  set({ a: 1 });
  expect(window.location.search).toBe('?a=1');
  expect(read()).toEqual({ a: 1 });
  set({ ...read(), b: 2 });
  expect(window.location.search).toBe('?a=1&b=2');
  expect(read()).toEqual({ a: 1, b: 2 });
  set({ ...read(), a: undefined });
  expect(window.location.search).toBe('?b=2');
  expect(read()).toEqual({ a: undefined, b: 2 });
  set({});
  expect(window.location.search).toBe('');
  expect(read()).toEqual({});
});
