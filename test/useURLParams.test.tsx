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

// TODO: Break up tests + more tests + better test names

describe('getter', () => {
  test('works as expected', () => {
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
});

describe('setter', () => {
  test('works when passed an object', () => {
    expect.assertions(11);
    const [read, set] = useURLParams();
    expect(read()).toEqual({});
    expect(window.location.search).toBe('');
    set({ a: 1 });
    expect(read()).toEqual({ a: 1 });
    expect(window.location.search).toBe('?a=1');
    set({ ...read(), b: 1 });
    expect(read()).toEqual({ a: 1, b: 1 });
    set({ ...read(), b: 2 });
    expect(read()).toEqual({ a: 1, b: 2 });
    expect(window.location.search).toBe('?a=1&b=2');
    set({ ...read(), a: undefined });
    expect(read()).toEqual({ a: undefined, b: 2 });
    expect(window.location.search).toBe('?b=2');
    set({});
    expect(read()).toEqual({});
    expect(window.location.search).toBe('');
  });

  test('works when passed a function', () => {
    expect.assertions(6);
    const [read, set] = useURLParams<{ a: number; b: number; c: number }>();
    expect(read()).toEqual({});
    set(() => ({ a: 1 }));
    set((prev) => ({ ...prev, b: 1 }));
    expect(read()).toEqual({ a: 1, b: 1 });
    set((prev) => ({ ...prev, b: 2 }));
    set((prev) => ({ ...prev, c: 3 }));
    expect(read()).toEqual({ a: 1, b: 2, c: 3 });
    expect(window.location.search).toBe('?a=1&b=2&c=3');
    set((prev) => ({ ...prev, b: undefined }));
    expect(read()).toEqual({ a: 1, c: 3 });
    expect(window.location.search).toBe('?a=1&c=3');
  });
});
