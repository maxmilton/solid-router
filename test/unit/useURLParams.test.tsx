import { describe, expect, it } from 'vitest';
import { useURLParams } from '../../src/index';
import { setURL } from './utils';

// TODO: Break up tests + more tests + better test names

describe('getter', () => {
  it('works as expected', () => {
    expect.assertions(3);
    const reset1 = setURL('http://localhost/');
    const [read1] = useURLParams();
    expect(read1()).toStrictEqual({});
    reset1();
    const reset2 = setURL(
      'http://localhost/?a=1&b=2&c=3&c=4&d&c=null&c=undefined&c=0&c=false&c=true',
    );
    const [read2] = useURLParams();
    expect(read2()).toStrictEqual({
      a: 1,
      b: 2,
      c: [3, 4, 'null', 'undefined', 0, false, true],
      d: '',
    });
    reset2();
    const reset3 = setURL('http://localhost/?ab_c=123.456&_def=1.00&-x-=-0.1&&&&');
    const [read3] = useURLParams();
    expect(read3()).toStrictEqual({
      ab_c: 123.456,
      _def: 1,
      '-x-': -0.1,
    });
    reset3();
  });
});

describe('setter', () => {
  it('works when passed an object', () => {
    expect.assertions(11);
    const [read, set] = useURLParams();
    expect(read()).toStrictEqual({});
    expect(window.location.search).toBe('');
    set({ a: 1 });
    expect(read()).toStrictEqual({ a: 1 });
    expect(window.location.search).toBe('?a=1');
    set({ ...read(), b: 1 });
    expect(read()).toStrictEqual({ a: 1, b: 1 });
    set({ ...read(), b: 2 });
    expect(read()).toStrictEqual({ a: 1, b: 2 });
    expect(window.location.search).toBe('?a=1&b=2');
    set({ ...read(), a: undefined });
    expect(read()).toStrictEqual({ a: undefined, b: 2 });
    expect(window.location.search).toBe('?b=2');
    set({});
    expect(read()).toStrictEqual({});
    expect(window.location.search).toBe('');
  });

  it('works when passed a function', () => {
    expect.assertions(6);
    const [read, set] = useURLParams<{ a: number; b: number; c: number }>();
    expect(read()).toStrictEqual({});
    set(() => ({ a: 1 }));
    set((prev) => ({ ...prev, b: 1 }));
    expect(read()).toStrictEqual({ a: 1, b: 1 });
    set((prev) => ({ ...prev, b: 2 }));
    set((prev) => ({ ...prev, c: 3 }));
    expect(read()).toStrictEqual({ a: 1, b: 2, c: 3 });
    expect(window.location.search).toBe('?a=1&b=2&c=3');
    set((prev) => ({ ...prev, b: undefined }));
    expect(read()).toStrictEqual({ a: 1, b: undefined, c: 3 });
    expect(window.location.search).toBe('?a=1&c=3');
  });
});
