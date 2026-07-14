import type { ToZonedDateTimeIssue } from '@thaz/temporal-util/valibot';

import { ZonedDateTime, CalendarDateTime, CalendarDate, Time } from '@internationalized/date';
import { Temporal } from '@js-temporal/polyfill';
import { describe, expect, test } from 'vite-plus/test';

import type { ToZonedDateTimeAction } from '#src/valibot/internationalized-date/actions/to-zoned-date-time-value';
import { toZonedDateTime } from '#src/valibot/internationalized-date/actions/to-zoned-date-time-value';

describe('should return action object', () => {
  test('with undefined message', () => {
    expect(toZonedDateTime()).toStrictEqual({
      kind: 'transformation',
      type: 'to_zoned_date_time',
      reference: toZonedDateTime,
      async: false,
      message: undefined,
      '~run': expect.any(Function),
    } satisfies ToZonedDateTimeAction<unknown, undefined>);
  });

  test('with string message', () => {
    expect(toZonedDateTime('message')).toStrictEqual({
      kind: 'transformation',
      type: 'to_zoned_date_time',
      reference: toZonedDateTime,
      async: false,
      message: 'message',
      '~run': expect.any(Function),
    } satisfies ToZonedDateTimeAction<unknown, string>);
  });

  test('with function message', () => {
    const message = () => 'message';
    expect(toZonedDateTime(message)).toStrictEqual({
      kind: 'transformation',
      type: 'to_zoned_date_time',
      reference: toZonedDateTime,
      async: false,
      message,
      '~run': expect.any(Function),
    } satisfies ToZonedDateTimeAction<unknown, typeof message>);
  });
});

describe('should transform to Temporal.ZonedDateTime', () => {
  const action = toZonedDateTime();

  test('converts a ZonedDateTime with UTC timezone', () => {
    const value = new ZonedDateTime(2024, 1, 1, 'UTC', 0, 0, 0, 0);
    expect(action['~run']({ typed: true, value }, {})).toStrictEqual({
      typed: true,
      value: Temporal.ZonedDateTime.from(value.toString()),
    });
  });

  test('converts a ZonedDateTime with named timezone', () => {
    const value = new ZonedDateTime(2024, 6, 15, 'America/Chicago', -5 * 60 * 60 * 1000, 12, 0, 0);
    expect(action['~run']({ typed: true, value }, {})).toStrictEqual({
      typed: true,
      value: Temporal.ZonedDateTime.from(value.toString()),
    });
  });

  test('passes through an existing Temporal.ZonedDateTime', () => {
    const value = Temporal.ZonedDateTime.from('2024-06-15T12:00:00+00:00[UTC]');
    expect(action['~run']({ typed: true, value }, {})).toStrictEqual({ typed: true, value });
  });
});
describe('should return dataset with issues', () => {
  const action = toZonedDateTime('message');

  const baseIssue: Omit<ToZonedDateTimeIssue<unknown>, 'input' | 'received'> = {
    kind: 'transformation',
    type: 'to_zoned_date_time',
    expected: null,
    message: 'message',
    requirement: undefined,
    path: undefined,
    issues: undefined,
    lang: undefined,
    abortEarly: undefined,
    abortPipeEarly: undefined,
  };

  test('for undefined', () => {
    expect(action['~run']({ typed: true, value: undefined }, {})).toStrictEqual({
      typed: false,
      value: undefined,
      issues: [{ ...baseIssue, input: undefined, received: '"Invalid conversion option"' }],
    });
  });

  test('for null', () => {
    expect(action['~run']({ typed: true, value: null }, {})).toStrictEqual({
      typed: false,
      value: null,
      issues: [{ ...baseIssue, input: null, received: '"Invalid conversion option"' }],
    });
  });

  test('for plain objects', () => {
    const value = {};
    expect(action['~run']({ typed: true, value }, {})).toStrictEqual({
      typed: false,
      value,
      issues: [{ ...baseIssue, input: value, received: '"Invalid conversion option"' }],
    });
  });

  test('for strings', () => {
    const value = '2024-01-01T00:00:00+00:00[UTC]';
    expect(action['~run']({ typed: true, value }, {})).toStrictEqual({
      typed: false,
      value,
      issues: [{ ...baseIssue, input: value, received: '"Invalid conversion option"' }],
    });
  });

  test('for numbers', () => {
    const value = 1_700_000_000_000;
    expect(action['~run']({ typed: true, value }, {})).toStrictEqual({
      typed: false,
      value,
      issues: [{ ...baseIssue, input: value, received: '"Invalid conversion option"' }],
    });
  });

  test('for Temporal.Instant', () => {
    const value = Temporal.Instant.fromEpochMilliseconds(0);
    expect(action['~run']({ typed: true, value }, {})).toStrictEqual({
      typed: false,
      value,
      issues: [{ ...baseIssue, input: value, received: '"Invalid conversion option"' }],
    });
  });

  test('for Temporal.PlainDateTime', () => {
    const value = Temporal.PlainDateTime.from('2024-01-01T10:00:00');
    expect(action['~run']({ typed: true, value }, {})).toStrictEqual({
      typed: false,
      value,
      issues: [{ ...baseIssue, input: value, received: '"Invalid conversion option"' }],
    });
  });

  test('for Temporal.PlainDate', () => {
    const value = Temporal.PlainDate.from('2024-01-01');
    expect(action['~run']({ typed: true, value }, {})).toStrictEqual({
      typed: false,
      value,
      issues: [{ ...baseIssue, input: value, received: '"Invalid conversion option"' }],
    });
  });

  test('for Temporal.PlainTime', () => {
    const value = Temporal.PlainTime.from('10:00:00');
    expect(action['~run']({ typed: true, value }, {})).toStrictEqual({
      typed: false,
      value,
      issues: [{ ...baseIssue, input: value, received: '"Invalid conversion option"' }],
    });
  });

  test('for @internationalized/date CalendarDateTime', () => {
    const value = new CalendarDateTime(2024, 1, 1, 10, 0, 0);
    expect(action['~run']({ typed: true, value }, {})).toStrictEqual({
      typed: false,
      value,
      issues: [{ ...baseIssue, input: value, received: '"Invalid conversion option"' }],
    });
  });

  test('for @internationalized/date CalendarDate', () => {
    const value = new CalendarDate(2024, 1, 1);
    expect(action['~run']({ typed: true, value }, {})).toStrictEqual({
      typed: false,
      value,
      issues: [{ ...baseIssue, input: value, received: '"Invalid conversion option"' }],
    });
  });

  test('for @internationalized/date Time', () => {
    const value = new Time(10, 0, 0);
    expect(action['~run']({ typed: true, value }, {})).toStrictEqual({
      typed: false,
      value,
      issues: [{ ...baseIssue, input: value, received: '"Invalid conversion option"' }],
    });
  });
});
