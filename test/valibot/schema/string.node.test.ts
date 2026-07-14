import * as v from 'valibot';
import { describe, expect, test } from 'vite-plus/test';

import { string } from '#src/valibot/schema/string';

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
      const result = v.safeParse(schema, {});
      expect(result.success).toBeFalsy();
    });

    test('rejects booleans - true', () => {
      const result = v.safeParse(schema, true);
      expect(result.success).toBeFalsy();
    });

    test('rejects booleans - false', () => {
      const result = v.safeParse(schema, false);
      expect(result.success).toBeFalsy();
    });

    test('rejects numbers', () => {
      const result = v.safeParse(schema, 42);
      expect(result.success).toBeFalsy();
    });
  });

  test('passes extra string actions', () => {
    const schemaWithAction = string(wrongTypeMessages, v.minLength(3, 'too short'));
    expect(v.safeParse(schemaWithAction, 'hi').success).toBeFalsy();
    expect(v.safeParse(schemaWithAction, 'hey').success).toBeTruthy();
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
      expect(v.safeParse(schema, null)).toMatchObject({ success: false, output: null });
    });

    test('rejects undefined', () => {
      expect(v.safeParse(schema, undefined)).toMatchObject({ success: false, output: null });
    });

    test('rejects empty string', () => {
      expect(v.safeParse(schema, '')).toMatchObject({ success: false, output: null });
    });

    test('rejects whitespace-only string', () => {
      expect(v.safeParse(schema, '   ')).toMatchObject({ success: false, output: null });
      expect(v.safeParse(schema, '\t\n')).toMatchObject({ success: false, output: null });
    });

    test('rejects objects', () => {
      const result = v.safeParse(schema, {});
      expect(result.success).toBeFalsy();
    });

    test('rejects booleans - true', () => {
      const result = v.safeParse(schema, true);
      expect(result.success).toBeFalsy();
    });

    test('rejects booleans - false', () => {
      const result = v.safeParse(schema, false);
      expect(result.success).toBeFalsy();
    });

    test('rejects numbers', () => {
      const result = v.safeParse(schema, 42);
      expect(result.success).toBeFalsy();
    });
  });

  test('passes extra string actions', () => {
    const schemaWithAction = string(requiredMessages, v.minLength(3, 'too short'));
    expect(v.safeParse(schemaWithAction, 'hi').success).toBeFalsy();
    expect(v.safeParse(schemaWithAction, 'hey').success).toBeTruthy();
  });
});
