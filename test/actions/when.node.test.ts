import * as v from 'valibot';
import { describe, expect, test } from 'vite-plus/test';

import { when } from '#src/actions/when';

describe('should return the matching action', () => {
  test('returns ifAction when condition is true', () => {
    const ifAction = v.minValue(10);
    const elseAction = v.maxValue(5);
    expect(when(true, ifAction, elseAction)).toBe(ifAction);
  });

  test('returns elseAction when condition is false', () => {
    const ifAction = v.minValue(10);
    const elseAction = v.maxValue(5);
    expect(when(false, ifAction, elseAction)).toBe(elseAction);
  });
});

describe('should behave correctly when used in a pipe', () => {
  test('applies ifAction when condition is true', () => {
    const schema = v.pipe(v.number(), when(true, v.minValue(10), v.maxValue(5)));

    expect(v.safeParse(schema, 15)).toMatchObject({ success: true, output: 15 });
    expect(v.safeParse(schema, 1)).toMatchObject({ success: false, output: 1 });
  });

  test('applies elseAction when condition is false', () => {
    const schema = v.pipe(v.number(), when(false, v.minValue(10), v.maxValue(5)));

    expect(v.safeParse(schema, 1)).toMatchObject({ success: true, output: 1 });
    expect(v.safeParse(schema, 15)).toMatchObject({ success: false, output: 15 });
  });
});
