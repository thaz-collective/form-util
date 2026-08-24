import { describe, expect, test } from 'vite-plus/test';

import * as v from 'valibot';

import { nullableInput } from '#src/schema/nullable-input';

describe('nullableInput', () => {
  describe('when the wrapped schema does not itself accept null/undefined', () => {
    const schema = nullableInput(v.string());

    test('rejects null', () => {
      expect(v.safeParse(schema, null)).toMatchObject({ success: false, output: null });
    });

    test('rejects undefined', () => {
      expect(v.safeParse(schema, undefined)).toMatchObject({ success: false, output: undefined });
    });

    test('passes a valid value through', () => {
      expect(v.safeParse(schema, 'hello')).toMatchObject({ success: true, output: 'hello' });
    });

    test('rejects a value that fails the wrapped schema', () => {
      expect(v.safeParse(schema, 5)).toMatchObject({ success: false, output: 5 });
    });
  });

  describe('when the wrapped schema itself accepts and transforms null/undefined', () => {
    const schema = nullableInput(
      v.union([
        v.null(),
        v.pipe(
          v.undefined(),
          v.transform(() => null),
        ),
        v.pipe(v.number(), v.minValue(10)),
      ]),
    );

    test('passes null through', () => {
      expect(v.safeParse(schema, null)).toMatchObject({ success: true, output: null });
    });

    test('transforms undefined to null', () => {
      expect(v.safeParse(schema, undefined)).toMatchObject({ success: true, output: null });
    });

    test('passes a valid value through', () => {
      expect(v.safeParse(schema, 15)).toMatchObject({ success: true, output: 15 });
    });

    test('rejects a value that fails the wrapped schema', () => {
      expect(v.safeParse(schema, 5)).toMatchObject({ success: false, output: 5 });
    });
  });
});
