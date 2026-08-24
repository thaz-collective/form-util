import { describe, expect, test } from 'vite-plus/test';

import { ZonedDateTime, CalendarDateTime, CalendarDate, Time } from '@internationalized/date';

import { temporalToInternationalizedDateTime } from '#src/util/temporal-to-internationalized';

describe('temporalToInternationalizedDateTime', () => {
  test('converts a Temporal.ZonedDateTime to a ZonedDateTime', () => {
    const value = Temporal.ZonedDateTime.from('2024-06-15T12:30:45.5-05:00[America/Chicago]');
    const result = temporalToInternationalizedDateTime(value);

    expect(result).toBeInstanceOf(ZonedDateTime);
    expect(result.toString()).toBe(
      new ZonedDateTime(
        2024,
        6,
        15,
        'America/Chicago',
        value.offsetNanoseconds / 1_000_000,
        12,
        30,
        45,
        500,
      ).toString(),
    );
  });

  test('converts a Temporal.PlainDateTime to a CalendarDateTime', () => {
    const value = Temporal.PlainDateTime.from('2024-01-01T10:15:30.25');
    const result = temporalToInternationalizedDateTime(value);

    expect(result).toBeInstanceOf(CalendarDateTime);
    expect(result.toString()).toBe(new CalendarDateTime(2024, 1, 1, 10, 15, 30, 250).toString());
  });

  test('converts a Temporal.PlainDate to a CalendarDate', () => {
    const value = Temporal.PlainDate.from('2024-01-01');
    const result = temporalToInternationalizedDateTime(value);

    expect(result).toBeInstanceOf(CalendarDate);
    expect(result.toString()).toBe(new CalendarDate(2024, 1, 1).toString());
  });

  test('converts a Temporal.PlainTime to a Time', () => {
    const value = Temporal.PlainTime.from('10:15:30.25');
    const result = temporalToInternationalizedDateTime(value);

    expect(result).toBeInstanceOf(Time);
    expect(result.toString()).toBe(new Time(10, 15, 30, 250).toString());
  });
});
