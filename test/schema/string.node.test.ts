import { describe, expect, test } from 'vite-plus/test';

import * as v from 'valibot';

import { string } from '#src/schema/string';

const wrongTypeMessages = { wrongTypeMessage: 'Wrong type' };
const requiredMessages = { wrongTypeMessage: 'Wrong type', requiredMessage: 'Required' };

describe('nullable variant', () => {
  const schema = string(wrongTypeMessages);

  describe('should return dataset without issues', () => {
    test('passes null through', () => {
      expect(v.safeParse(schema, null)).toMatchObject({ success: true, output: null });
    });

    test('coerces undefined to null', () => {
      expect(v.safeParse(schema, undefined)).toMatchObject({ success: true, output: null });
    });

    test('coerces empty string to null', () => {
      expect(v.safeParse(schema, '')).toMatchObject({ success: true, output: null });
    });

    test('coerces whitespace-only string to null', () => {
      expect(v.safeParse(schema, '   ')).toMatchObject({ success: true, output: null });
      expect(v.safeParse(schema, '\t\n')).toMatchObject({ success: true, output: null });
    });

    test('trims and passes non-blank string', () => {
      expect(v.safeParse(schema, '  hello  ')).toMatchObject({ success: true, output: 'hello' });
    });

    test('passes valid string as-is', () => {
      expect(v.safeParse(schema, 'hello')).toMatchObject({ success: true, output: 'hello' });
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

    test('rejects numbers', () => {
      expect(v.safeParse(schema, 42)).toMatchObject({
        success: false,
        output: 42,
        issues: [
          {
            kind: 'schema',
            message: 'Wrong type',
          },
        ],
      });
    });
  });

  test('passes extra string actions', () => {
    const schemaWithAction = string(wrongTypeMessages, v.minLength(3, 'too short'));
    expect(v.safeParse(schemaWithAction, 'hi')).toMatchObject({ success: false, output: 'hi' });
    expect(v.safeParse(schemaWithAction, 'hey')).toMatchObject({ success: true, output: 'hey' });
  });
});

describe('required variant', () => {
  const schema = string(requiredMessages);

  describe('should return dataset without issues', () => {
    test('trims and passes non-blank string', () => {
      expect(v.safeParse(schema, '  hello  ')).toMatchObject({ success: true, output: 'hello' });
    });

    test('passes valid string as-is', () => {
      expect(v.safeParse(schema, 'hello')).toMatchObject({ success: true, output: 'hello' });
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

    test('rejects empty string', () => {
      expect(v.safeParse(schema, '')).toMatchObject({
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

    test('rejects whitespace-only string', () => {
      expect(v.safeParse(schema, '   ')).toMatchObject({
        success: false,
        output: null,
        issues: [
          {
            kind: 'schema',
            message: 'Required',
          },
        ],
      });
      expect(v.safeParse(schema, '\t\n')).toMatchObject({
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

    test('rejects numbers', () => {
      expect(v.safeParse(schema, 42)).toMatchObject({
        success: false,
        output: 42,
        issues: [
          {
            kind: 'schema',
            message: 'Wrong type',
          },
        ],
      });
    });
  });

  test('passes extra string actions', () => {
    const schemaWithAction = string(requiredMessages, v.minLength(3, 'too short'));
    expect(v.safeParse(schemaWithAction, 'hi')).toMatchObject({ success: false, output: 'hi' });
    expect(v.safeParse(schemaWithAction, 'hey')).toMatchObject({ success: true, output: 'hey' });
  });
});
