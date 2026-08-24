import { describe, expect, test } from 'vite-plus/test';

import { ZonedDateTime, CalendarDateTime, CalendarDate, Time } from '@internationalized/date';

import { internationalizedToTemporalDateTime } from '#src/util/internationalized-to-temporal';

describe('internationalizedToTemporalDateTime', () => {
  test('converts a ZonedDateTime to a Temporal.ZonedDateTime', () => {
    const value = new ZonedDateTime(2024, 6, 15, 'America/Chicago', -5 * 60 * 60 * 1000, 12, 30, 45, 500);
    const result = internationalizedToTemporalDateTime(value);

    expect(result).toBeInstanceOf(Temporal.ZonedDateTime);
    expect(result.equals(Temporal.ZonedDateTime.from('2024-06-15T12:30:45.5-05:00[America/Chicago]'))).toBeTruthy();
  });

  test('converts a CalendarDateTime to a Temporal.PlainDateTime', () => {
    const value = new CalendarDateTime(2024, 1, 1, 10, 15, 30, 250);
    const result = internationalizedToTemporalDateTime(value);

    expect(result).toBeInstanceOf(Temporal.PlainDateTime);
    expect(result.equals(Temporal.PlainDateTime.from('2024-01-01T10:15:30.25'))).toBeTruthy();
  });

  test('converts a CalendarDate to a Temporal.PlainDate', () => {
    const value = new CalendarDate(2024, 1, 1);
    const result = internationalizedToTemporalDateTime(value);

    expect(result).toBeInstanceOf(Temporal.PlainDate);
    expect(result.equals(Temporal.PlainDate.from('2024-01-01'))).toBeTruthy();
  });

  test('converts a Time to a Temporal.PlainTime', () => {
    const value = new Time(10, 15, 30, 250);
    const result = internationalizedToTemporalDateTime(value);

    expect(result).toBeInstanceOf(Temporal.PlainTime);
    expect(result.equals(Temporal.PlainTime.from('10:15:30.25'))).toBeTruthy();
  });
});
