import { parseZonedDateTime, CalendarDate, CalendarDateTime, Time } from '@internationalized/date';
import { Temporal } from '@js-temporal/polyfill';
import { describe, expect, test } from 'vite-plus/test';

import type {
  InternationalizedZonedDateTimeIssue,
  InternationalizedZonedDateTimeSchema,
} from '#src/valibot/internationalized-date/schema/internationalized-zoned-date-time';
import { internationalizedZonedDateTime } from '#src/valibot/internationalized-date/schema/internationalized-zoned-date-time';

describe('internationalizedZonedDateTime', () => {
  describe('should return schema object', () => {
    const baseSchema: Omit<InternationalizedZonedDateTimeSchema<never>, 'message'> = {
      kind: 'schema',
      type: 'internationalized_zoned_date_time',
      reference: internationalizedZonedDateTime,
      expects: '@internationalized/date.ZonedDateTime',
      async: false,
      '~standard': {
        version: 1,
        vendor: 'valibot',
        validate: expect.any(Function),
      },
      '~run': expect.any(Function),
    };

    test('with undefined message', () => {
      const schema: InternationalizedZonedDateTimeSchema<undefined> = { ...baseSchema, message: undefined };
      expect(internationalizedZonedDateTime()).toStrictEqual(schema);
      expect(internationalizedZonedDateTime(undefined)).toStrictEqual(schema);
    });

    test('with string message', () => {
      expect(internationalizedZonedDateTime('message')).toStrictEqual({
        ...baseSchema,
        message: 'message',
      } satisfies InternationalizedZonedDateTimeSchema<string>);
    });

    test('with function message', () => {
      const message = () => 'message';
      expect(internationalizedZonedDateTime(message)).toStrictEqual({
        ...baseSchema,
        message,
      } satisfies InternationalizedZonedDateTimeSchema<typeof message>);
    });
  });

  describe('should return dataset without issues', () => {
    const schema = internationalizedZonedDateTime();

    test('for UTC zoned date-time', () => {
      const value = parseZonedDateTime('2024-01-01T00:00:00+00:00[UTC]');
      expect(schema['~run']({ value }, {})).toStrictEqual({ typed: true, value });
    });

    test('for named timezone', () => {
      const value = parseZonedDateTime('2024-06-15T12:30:00-05:00[America/Chicago]');
      expect(schema['~run']({ value }, {})).toStrictEqual({ typed: true, value });
    });

    test('for positive offset timezone', () => {
      const value = parseZonedDateTime('2024-01-01T09:00:00+09:00[Asia/Tokyo]');
      expect(schema['~run']({ value }, {})).toStrictEqual({ typed: true, value });
    });
  });

  describe('should return dataset with issues', () => {
    const schema = internationalizedZonedDateTime('message');
    const baseIssue: Omit<InternationalizedZonedDateTimeIssue, 'input' | 'received'> = {
      kind: 'schema',
      type: 'internationalized_zoned_date_time',
      expected: '@internationalized/date.ZonedDateTime',
      message: 'message',
      requirement: undefined,
      path: undefined,
      issues: undefined,
      lang: undefined,
      abortEarly: undefined,
      abortPipeEarly: undefined,
    };

    test('for zoned date-time strings', () => {
      const str = '2024-01-01T00:00:00+00:00[UTC]';
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

    test('for Time', () => {
      const value = new Time(12, 0, 0);
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
