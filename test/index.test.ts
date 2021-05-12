import { test } from 'uvu';
import * as assert from 'uvu/assert';

test('temp', () => {
  assert.is(1 + 2, 3);
});

test.run();
