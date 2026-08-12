import { describe, expect, test } from 'vite-plus/test';

import { Time, parseZonedDateTime, CalendarDate, CalendarDateTime } from '@internationalized/date';

import type {
  InternationalizedTimeIssue,
  InternationalizedTimeSchema,
} from '#src/internationalized-date/schema/internationalized-time';
import { internationalizedTime } from '#src/internationalized-date/schema/internationalized-time';

describe('internationalizedTime', () => {
  describe('should return schema object', () => {
    const baseSchema: Omit<InternationalizedTimeSchema<never>, 'message'> = {
      kind: 'schema',
      type: 'internationalized_time',
      reference: internationalizedTime,
      expects: '@internationalized/date.Time',
      async: false,
      '~standard': {
        version: 1,
        vendor: 'valibot',
        validate: expect.any(Function),
      },
      '~run': expect.any(Function),
    };

    test('with undefined message', () => {
      const schema: InternationalizedTimeSchema<undefined> = { ...baseSchema, message: undefined };
      expect(internationalizedTime()).toStrictEqual(schema);
      expect(internationalizedTime(undefined)).toStrictEqual(schema);
    });

    test('with string message', () => {
      expect(internationalizedTime('message')).toStrictEqual({
        ...baseSchema,
        message: 'message',
      } satisfies InternationalizedTimeSchema<string>);
    });

    test('with function message', () => {
      const message = () => 'message';
      expect(internationalizedTime(message)).toStrictEqual({
        ...baseSchema,
        message,
      } satisfies InternationalizedTimeSchema<typeof message>);
    });
  });

  describe('should return dataset without issues', () => {
    const schema = internationalizedTime();

    test('for a time value', () => {
      const value = new Time(12, 30, 0);
      expect(schema['~run']({ value }, {})).toStrictEqual({ typed: true, value });
    });

    test('for midnight', () => {
      const value = new Time(0, 0, 0);
      expect(schema['~run']({ value }, {})).toStrictEqual({ typed: true, value });
    });
  });

  describe('should return dataset with issues', () => {
    const schema = internationalizedTime('message');
    const baseIssue: Omit<InternationalizedTimeIssue, 'input' | 'received'> = {
      kind: 'schema',
      type: 'internationalized_time',
      expected: '@internationalized/date.Time',
      message: 'message',
      requirement: undefined,
      path: undefined,
      issues: undefined,
      lang: undefined,
      abortEarly: undefined,
      abortPipeEarly: undefined,
    };

    test('for time strings', () => {
      const str = '12:30:00';
      expect(schema['~run']({ value: str }, {})).toStrictEqual({
        typed: false,
        value: str,
        issues: [{ ...baseIssue, input: str, received: `"${str}"` }],
      });
    });

    test('for null', () => {
      expect(schema['~run']({ value: null }, {})).toStrictEqual({
        typed: false,
        value: null,
        issues: [{ ...baseIssue, input: null, received: 'null' }],
      });
    });

    test('for undefined', () => {
      expect(schema['~run']({ value: undefined }, {})).toStrictEqual({
        typed: false,
        value: undefined,
        issues: [{ ...baseIssue, input: undefined, received: 'undefined' }],
      });
    });

    test('for numbers', () => {
      expect(schema['~run']({ value: 0 }, {})).toStrictEqual({
        typed: false,
        value: 0,
        issues: [{ ...baseIssue, input: 0, received: '0' }],
      });
    });

    test('for booleans', () => {
      expect(schema['~run']({ value: true }, {})).toStrictEqual({
        typed: false,
        value: true,
        issues: [{ ...baseIssue, input: true, received: 'true' }],
      });
    });

    test('for objects', () => {
      expect(schema['~run']({ value: {} }, {})).toStrictEqual({
        typed: false,
        value: {},
        issues: [{ ...baseIssue, input: {}, received: 'Object' }],
      });
    });

    test('for CalendarDate', () => {
      const value = new CalendarDate(2024, 1, 1);
      expect(schema['~run']({ value }, {})).toStrictEqual({
        typed: false,
        value,
        issues: [{ ...baseIssue, input: value, received: value.constructor.name }],
      });
    });

    test('for CalendarDateTime', () => {
      const value = new CalendarDateTime(2024, 1, 1, 10, 0, 0);
      expect(schema['~run']({ value }, {})).toStrictEqual({
        typed: false,
        value,
        issues: [{ ...baseIssue, input: value, received: value.constructor.name }],
      });
    });

    test('for ZonedDateTime', () => {
      const value = parseZonedDateTime('2024-01-01T00:00:00+00:00[UTC]');
      expect(schema['~run']({ value }, {})).toStrictEqual({
        typed: false,
        value,
        issues: [{ ...baseIssue, input: value, received: value.constructor.name }],
      });
    });

    test('for Temporal.ZonedDateTime', () => {
      const value = Temporal.ZonedDateTime.from('2024-01-01T00:00:00+00:00[UTC]');
      expect(schema['~run']({ value }, {})).toStrictEqual({
        typed: false,
        value,
        issues: [{ ...baseIssue, input: value, received: 'ZonedDateTime' }],
      });
    });

    test('for Temporal.Instant', () => {
      const value = Temporal.Instant.fromEpochMilliseconds(0);
      expect(schema['~run']({ value }, {})).toStrictEqual({
        typed: false,
        value,
        issues: [{ ...baseIssue, input: value, received: 'Instant' }],
      });
    });

    test('for Temporal.PlainDateTime', () => {
      const value = Temporal.PlainDateTime.from('2024-01-01T10:00:00');
      expect(schema['~run']({ value }, {})).toStrictEqual({
        typed: false,
        value,
        issues: [{ ...baseIssue, input: value, received: 'PlainDateTime' }],
      });
    });

    test('for Temporal.PlainDate', () => {
      const value = Temporal.PlainDate.from('2024-01-01');
      expect(schema['~run']({ value }, {})).toStrictEqual({
        typed: false,
        value,
        issues: [{ ...baseIssue, input: value, received: 'PlainDate' }],
      });
    });

    test('for Temporal.PlainTime', () => {
      const value = Temporal.PlainTime.from('12:00:00');
      expect(schema['~run']({ value }, {})).toStrictEqual({
        typed: false,
        value,
        issues: [{ ...baseIssue, input: value, received: 'PlainTime' }],
      });
    });
  });
});
