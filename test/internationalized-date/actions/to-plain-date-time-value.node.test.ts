import { describe, expect, test } from 'vite-plus/test';

import type { ToPlainDateTimeIssue } from '@thaz/temporal-util/valibot';

import { ZonedDateTime, CalendarDateTime, CalendarDate, Time } from '@internationalized/date';

import type { ToPlainDateTimeAction } from '#src/internationalized-date/actions/to-plain-date-time-value';
import { toPlainDateTime } from '#src/internationalized-date/actions/to-plain-date-time-value';

describe('should return action object', () => {
  test('with undefined message', () => {
    expect(toPlainDateTime()).toStrictEqual({
      kind: 'transformation',
      type: 'to_plain_date_time',
      reference: toPlainDateTime,
      async: false,
      message: undefined,
      '~run': expect.any(Function),
    } satisfies ToPlainDateTimeAction<unknown, undefined>);
  });

  test('with string message', () => {
    expect(toPlainDateTime('message')).toStrictEqual({
      kind: 'transformation',
      type: 'to_plain_date_time',
      reference: toPlainDateTime,
      async: false,
      message: 'message',
      '~run': expect.any(Function),
    } satisfies ToPlainDateTimeAction<unknown, string>);
  });

  test('with function message', () => {
    const message = () => 'message';
    expect(toPlainDateTime(message)).toStrictEqual({
      kind: 'transformation',
      type: 'to_plain_date_time',
      reference: toPlainDateTime,
      async: false,
      message,
      '~run': expect.any(Function),
    } satisfies ToPlainDateTimeAction<unknown, typeof message>);
  });
});

describe('should transform to Temporal.PlainDateTime', () => {
  const action = toPlainDateTime();

  test('converts a ZonedDateTime with UTC timezone', () => {
    const value = new ZonedDateTime(2024, 1, 15, 'UTC', 0, 10, 30, 0);
    expect(action['~run']({ typed: true, value }, {})).toStrictEqual({
      typed: true,
      value: Temporal.ZonedDateTime.from(value.toString()).toPlainDateTime(),
    });
  });

  test('converts a ZonedDateTime with named timezone', () => {
    const value = new ZonedDateTime(2024, 6, 15, 'America/Chicago', -5 * 60 * 60 * 1000, 12, 0, 0);
    expect(action['~run']({ typed: true, value }, {})).toStrictEqual({
      typed: true,
      value: Temporal.ZonedDateTime.from(value.toString()).toPlainDateTime(),
    });
  });

  test('converts a CalendarDateTime', () => {
    const value = new CalendarDateTime(2024, 6, 15, 10, 30, 0);
    expect(action['~run']({ typed: true, value }, {})).toStrictEqual({
      typed: true,
      value: Temporal.PlainDateTime.from(value.toString()),
    });
  });

  test('passes through an existing Temporal.PlainDateTime', () => {
    const value = Temporal.PlainDateTime.from('2024-06-15T10:30:00');
    expect(action['~run']({ typed: true, value }, {})).toStrictEqual({ typed: true, value });
  });
});

describe('should return dataset with issues', () => {
  const action = toPlainDateTime('message');

  const baseIssue: Omit<ToPlainDateTimeIssue<unknown>, 'input' | 'received'> = {
    kind: 'transformation',
    type: 'to_plain_date_time',
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
    const value = '2024-06-15T10:30:00';
    expect(action['~run']({ typed: true, value }, {})).toStrictEqual({
      typed: false,
      value,
      issues: [{ ...baseIssue, input: value, received: '"Invalid conversion option"' }],
    });
  });

  test('for numbers', () => {
    const value = 0;
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

  test('for a ZonedDateTime with an unrecognized time zone (conversion throws)', () => {
    const value = new ZonedDateTime(2024, 1, 1, 'Not/AZone', 0, 0, 0, 0);
    expect(action['~run']({ typed: true, value }, {})).toStrictEqual({
      typed: false,
      value,
      issues: [{ ...baseIssue, input: value, received: expect.any(String) }],
    });
  });
});
