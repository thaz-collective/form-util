import { ZonedDateTime, CalendarDateTime, CalendarDate, Time } from '@internationalized/date';

import type { TemporalDateTimeValue, InternationalizedDateTimeValue } from './types';

export function temporalToInternationalizedDateTime(value: Temporal.ZonedDateTime): ZonedDateTime;
export function temporalToInternationalizedDateTime(value: Temporal.PlainDateTime): CalendarDateTime;
export function temporalToInternationalizedDateTime(value: Temporal.PlainDate): CalendarDate;
export function temporalToInternationalizedDateTime(value: Temporal.PlainTime): Time;
export function temporalToInternationalizedDateTime(value: TemporalDateTimeValue): InternationalizedDateTimeValue {
  if (value instanceof Temporal.ZonedDateTime) {
    return new ZonedDateTime(
      value.year,
      value.month,
      value.day,
      value.timeZoneId,
      value.offsetNanoseconds / 1_000_000,
      value.hour,
      value.minute,
      value.second,
      value.millisecond,
    );
  }

  if (value instanceof Temporal.PlainDateTime) {
    return new CalendarDateTime(
      value.year,
      value.month,
      value.day,
      value.hour,
      value.minute,
      value.second,
      value.millisecond,
    );
  }

  if (value instanceof Temporal.PlainDate) {
    return new CalendarDate(value.year, value.month, value.day);
  }

  return new Time(value.hour, value.minute, value.second, value.millisecond);
}
