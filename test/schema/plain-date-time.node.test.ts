import * as t from '@thaz/temporal-util/valibot';

import { ZonedDateTime, parseZonedDateTime, toCalendarDateTime, toCalendarDate, toTime } from '@internationalized/date';
import { Temporal } from '@js-temporal/polyfill';
import * as v from 'valibot';
import { describe, expect, test } from 'vite-plus/test';

import { plainDateTime } from '#src/schema/plain-date-time';

const wrongTypeMessages = { wrongTypeMessage: 'Wrong type' };
const requiredMessages = { wrongTypeMessage: 'Wrong type', requiredMessage: 'Required' };

const aZonedDateTime = Temporal.ZonedDateTime.from('2024-06-15T10:30:00+00:00[UTC]');
const aPlainDateTime = aZonedDateTime.toPlainDateTime();

const aInternationalizeZonedDateTime = parseZonedDateTime(aZonedDateTime.toString());
const aInternationalizeCalendarDateTime = toCalendarDateTime(aInternationalizeZonedDateTime);
const aInternationalizeCalendarDate = toCalendarDate(aInternationalizeZonedDateTime);
const aInternationalizeTime = toTime(aInternationalizeZonedDateTime);

describe('nullable variant', () => {
  const schema = plainDateTime(wrongTypeMessages);

  describe('should return dataset without issues', () => {
    test('passes null through', () => {
      expect(v.safeParse(schema, null)).toMatchObject({ success: true, output: null });
    });

    test('coerces undefined to null', () => {
      expect(v.safeParse(schema, undefined)).toMatchObject({ success: true, output: null });
    });

    test('passes an existing Temporal.PlainDateTime as-is', () => {
      expect(v.safeParse(schema, aPlainDateTime)).toMatchObject({ success: true, output: aPlainDateTime });
    });

    test('converts a Temporal.ZonedDateTime', () => {
      expect(v.safeParse(schema, aZonedDateTime)).toMatchObject({ success: true, output: aPlainDateTime });
    });

    test('converts an @internationalized/date ZonedDateTime', () => {
      expect(v.safeParse(schema, aInternationalizeZonedDateTime)).toMatchObject({
        success: true,
        output: aPlainDateTime,
      });
    });

    test('converts an @internationalized/date CalendarDateTime', () => {
      expect(v.safeParse(schema, aInternationalizeCalendarDateTime)).toMatchObject({
        success: true,
        output: aPlainDateTime,
      });
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

    test('rejects numbers', () => {
      expect(v.safeParse(schema, 5)).toMatchObject({
        success: false,
        output: 5,
        issues: [
          {
            kind: 'schema',
            message: 'Wrong type',
          },
        ],
      });
    });

    test('rejects an unrecognized ZonedDateTime time zone (conversion throws)', () => {
      const value = new ZonedDateTime(2024, 1, 1, 'Not/AZone', 0, 0, 0, 0);
      expect(v.safeParse(schema, value)).toMatchObject({
        success: false,
        output: value,
        issues: [
          {
            kind: 'schema',
            message: 'Wrong type',
          },
        ],
      });
    });

    test('rejects @internationalized/date - CalendarDate', () => {
      expect(v.safeParse(schema, aInternationalizeCalendarDate)).toMatchObject({
        success: false,
        output: aInternationalizeCalendarDate,
        issues: [
          {
            kind: 'schema',
            message: 'Wrong type',
          },
        ],
      });
    });

    test('rejects @internationalized/date - Time', () => {
      expect(v.safeParse(schema, aInternationalizeTime)).toMatchObject({
        success: false,
        output: aInternationalizeTime,
        issues: [
          {
            kind: 'schema',
            message: 'Wrong type',
          },
        ],
      });
    });

    test('rejects other Temporal types - Instant', () => {
      const value = aZonedDateTime.toInstant();
      expect(v.safeParse(schema, value)).toMatchObject({
        success: false,
        output: value,
        issues: [
          {
            kind: 'schema',
            message: 'Wrong type',
          },
        ],
      });
    });

    test('rejects other Temporal types - PlainDate', () => {
      const value = Temporal.PlainDate.from(aZonedDateTime.toString());
      expect(v.safeParse(schema, value)).toMatchObject({
        success: false,
        output: value,
        issues: [
          {
            kind: 'schema',
            message: 'Wrong type',
          },
        ],
      });
    });

    test('rejects other Temporal types - PlainTime', () => {
      const value = Temporal.PlainTime.from(aZonedDateTime.toString());
      expect(v.safeParse(schema, value)).toMatchObject({
        success: false,
        output: value,
        issues: [
          {
            kind: 'schema',
            message: 'Wrong type',
          },
        ],
      });
    });
  });

  test('passes extra plainDateTime actions', () => {
    const min = Temporal.PlainDateTime.from('2025-01-01T00:00:00');
    const schemaWithAction = plainDateTime(wrongTypeMessages, t.temporalMinValue(min));
    const early = Temporal.PlainDateTime.from('2024-01-01T00:00:00');
    const late = Temporal.PlainDateTime.from('2026-01-01T00:00:00');
    expect(v.safeParse(schemaWithAction, early)).toMatchObject({ success: false, output: early });
    expect(v.safeParse(schemaWithAction, late)).toMatchObject({ success: true, output: late });
  });
});

describe('required variant', () => {
  const schema = plainDateTime(requiredMessages);

  describe('should return dataset without issues', () => {
    test('passes an existing Temporal.PlainDateTime as-is', () => {
      expect(v.safeParse(schema, aPlainDateTime)).toMatchObject({ success: true, output: aPlainDateTime });
    });

    test('converts a Temporal.ZonedDateTime', () => {
      expect(v.safeParse(schema, aZonedDateTime)).toMatchObject({ success: true, output: aPlainDateTime });
    });

    test('converts an @internationalized/date ZonedDateTime', () => {
      expect(v.safeParse(schema, aInternationalizeZonedDateTime)).toMatchObject({
        success: true,
        output: aPlainDateTime,
      });
    });

    test('converts an @internationalized/date CalendarDateTime', () => {
      expect(v.safeParse(schema, aInternationalizeCalendarDateTime)).toMatchObject({
        success: true,
        output: aPlainDateTime,
      });
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

    test('rejects numbers', () => {
      expect(v.safeParse(schema, 5)).toMatchObject({
        success: false,
        output: 5,
        issues: [
          {
            kind: 'schema',
            message: 'Wrong type',
          },
        ],
      });
    });

    test('rejects an unrecognized ZonedDateTime time zone (conversion throws)', () => {
      const value = new ZonedDateTime(2024, 1, 1, 'Not/AZone', 0, 0, 0, 0);
      expect(v.safeParse(schema, value)).toMatchObject({
        success: false,
        output: value,
        issues: [
          {
            kind: 'schema',
            message: 'Wrong type',
          },
        ],
      });
    });

    test('rejects @internationalized/date - CalendarDate', () => {
      expect(v.safeParse(schema, aInternationalizeCalendarDate)).toMatchObject({
        success: false,
        output: aInternationalizeCalendarDate,
        issues: [
          {
            kind: 'schema',
            message: 'Wrong type',
          },
        ],
      });
    });

    test('rejects @internationalized/date - Time', () => {
      expect(v.safeParse(schema, aInternationalizeTime)).toMatchObject({
        success: false,
        output: aInternationalizeTime,
        issues: [
          {
            kind: 'schema',
            message: 'Wrong type',
          },
        ],
      });
    });

    test('rejects other Temporal types - Instant', () => {
      const value = aZonedDateTime.toInstant();
      expect(v.safeParse(schema, value)).toMatchObject({
        success: false,
        output: value,
        issues: [
          {
            kind: 'schema',
            message: 'Wrong type',
          },
        ],
      });
    });

    test('rejects other Temporal types - PlainDate', () => {
      const value = Temporal.PlainDate.from(aZonedDateTime.toString());
      expect(v.safeParse(schema, value)).toMatchObject({
        success: false,
        output: value,
        issues: [
          {
            kind: 'schema',
            message: 'Wrong type',
          },
        ],
      });
    });

    test('rejects other Temporal types - PlainTime', () => {
      const value = Temporal.PlainTime.from(aZonedDateTime.toString());
      expect(v.safeParse(schema, value)).toMatchObject({
        success: false,
        output: value,
        issues: [
          {
            kind: 'schema',
            message: 'Wrong type',
          },
        ],
      });
    });
  });

  test('passes extra plainDateTime actions', () => {
    const min = Temporal.PlainDateTime.from('2025-01-01T00:00:00');
    const schemaWithAction = plainDateTime(requiredMessages, t.temporalMinValue(min));
    const early = Temporal.PlainDateTime.from('2024-01-01T00:00:00');
    const late = Temporal.PlainDateTime.from('2026-01-01T00:00:00');
    expect(v.safeParse(schemaWithAction, early)).toMatchObject({ success: false, output: early });
    expect(v.safeParse(schemaWithAction, late)).toMatchObject({ success: true, output: late });
  });
});
