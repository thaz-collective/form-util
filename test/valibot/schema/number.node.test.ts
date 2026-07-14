import * as v from 'valibot';
import { describe, expect, test } from 'vite-plus/test';

import { number } from '#src/valibot/schema/number';

const wrongTypeMessages = { wrongTypeMessage: 'Wrong type' };
const requiredMessages = { wrongTypeMessage: 'Wrong type', requiredMessage: 'Required' };

describe('nullable variant', () => {
  const schema = number(wrongTypeMessages);

  describe('should return dataset without issues', () => {
    test('passes null through', () => {
      expect(v.safeParse(schema, null)).toMatchObject({ success: true, output: null });
    });

    test('coerces undefined to null', () => {
      expect(v.safeParse(schema, undefined)).toMatchObject({ success: true, output: null });
    });

    test('passes zero through', () => {
      expect(v.safeParse(schema, 0)).toMatchObject({ success: true, output: 0 });
    });

    test('passes valid number as-is', () => {
      expect(v.safeParse(schema, 5)).toMatchObject({ success: true, output: 5 });
    });

    test('passes valid negative number as-is', () => {
      expect(v.safeParse(schema, -5)).toMatchObject({ success: true, output: -5 });
    });
  });

  describe('should return dataset with issues', () => {
    test('rejects objects', () => {
      expect(v.safeParse(schema, {})).toMatchObject({
        success: false,
        output: {},
        issues: [
          {
            kind: 'schema',
            message: 'Wrong type',
          },
        ],
      });
    });

    test('rejects booleans - true', () => {
      expect(v.safeParse(schema, true)).toMatchObject({
        success: false,
        output: true,
        issues: [
          {
            kind: 'schema',
            message: 'Wrong type',
          },
        ],
      });
    });

    test('rejects booleans - false', () => {
      expect(v.safeParse(schema, false)).toMatchObject({
        success: false,
        output: false,
        issues: [
          {
            kind: 'schema',
            message: 'Wrong type',
          },
        ],
      });
    });

    test('rejects strings', () => {
      expect(v.safeParse(schema, 'abc')).toMatchObject({
        success: false,
        output: 'abc',
        issues: [
          {
            kind: 'schema',
            message: 'Wrong type',
          },
        ],
      });
    });

    test('rejects non-finite numbers', () => {
      expect(v.safeParse(schema, Number.NaN)).toMatchObject({
        success: false,
        output: Number.NaN,
        issues: [
          {
            kind: 'schema',
            message: 'Wrong type',
          },
        ],
      });
    });
  });

  test('passes extra number actions', () => {
    const schemaWithAction = number(wrongTypeMessages, v.minValue(10, 'too small'));
    expect(v.safeParse(schemaWithAction, 5)).toMatchObject({ success: false, output: 5 });
    expect(v.safeParse(schemaWithAction, 15)).toMatchObject({ success: true, output: 15 });
  });
});

describe('required variant', () => {
  const schema = number(requiredMessages);

  describe('should return dataset without issues', () => {
    test('passes zero through', () => {
      expect(v.safeParse(schema, 0)).toMatchObject({ success: true, output: 0 });
    });

    test('passes valid number as-is', () => {
      expect(v.safeParse(schema, 5)).toMatchObject({ success: true, output: 5 });
    });

    test('passes valid negative number as-is', () => {
      expect(v.safeParse(schema, -5)).toMatchObject({ success: true, output: -5 });
    });
  });

  describe('should return dataset with issues', () => {
    test('rejects null', () => {
      expect(v.safeParse(schema, null)).toMatchObject({
        success: false,
        output: null,
        issues: [
          {
            kind: 'schema',
            message: 'Required',
          },
        ],
      });
    });

    test('rejects undefined', () => {
      expect(v.safeParse(schema, undefined)).toMatchObject({
        success: false,
        output: null,
        issues: [
          {
            kind: 'schema',
            message: 'Required',
          },
        ],
      });
    });

    test('rejects objects', () => {
      expect(v.safeParse(schema, {})).toMatchObject({
        success: false,
        output: {},
        issues: [
          {
            kind: 'schema',
            message: 'Wrong type',
          },
        ],
      });
    });

    test('rejects booleans - true', () => {
      expect(v.safeParse(schema, true)).toMatchObject({
        success: false,
        output: true,
        issues: [
          {
            kind: 'schema',
            message: 'Wrong type',
          },
        ],
      });
    });

    test('rejects booleans - false', () => {
      expect(v.safeParse(schema, false)).toMatchObject({
        success: false,
        output: false,
        issues: [
          {
            kind: 'schema',
            message: 'Wrong type',
          },
        ],
      });
    });

    test('rejects strings', () => {
      expect(v.safeParse(schema, 'abc')).toMatchObject({
        success: false,
        output: 'abc',
        issues: [
          {
            kind: 'schema',
            message: 'Wrong type',
          },
        ],
      });
    });

    test('rejects non-finite numbers', () => {
      expect(v.safeParse(schema, Number.NaN)).toMatchObject({
        success: false,
        output: Number.NaN,
        issues: [
          {
            kind: 'schema',
            message: 'Wrong type',
          },
        ],
      });
    });
  });

  test('passes extra number actions', () => {
    const schemaWithAction = number(requiredMessages, v.minValue(10, 'too small'));
    expect(v.safeParse(schemaWithAction, 5)).toMatchObject({ success: false, output: 5 });
    expect(v.safeParse(schemaWithAction, 15)).toMatchObject({ success: true, output: 15 });
  });
});
