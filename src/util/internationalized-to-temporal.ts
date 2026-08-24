import { ZonedDateTime, CalendarDateTime, CalendarDate, Time } from '@internationalized/date';

import type { TemporalDateTimeValue, InternationalizedDateTimeValue } from './types';

export function internationalizedToTemporalDateTime(value: ZonedDateTime): Temporal.ZonedDateTime;
export function internationalizedToTemporalDateTime(value: CalendarDateTime): Temporal.PlainDateTime;
export function internationalizedToTemporalDateTime(value: CalendarDate): Temporal.PlainDate;
export function internationalizedToTemporalDateTime(value: Time): Temporal.PlainTime;
export function internationalizedToTemporalDateTime(value: InternationalizedDateTimeValue): TemporalDateTimeValue {
  if (value instanceof ZonedDateTime) {
    return Temporal.ZonedDateTime.from({
      year: value.year,
      month: value.month,
      day: value.day,
      hour: value.hour,
      minute: value.minute,
      second: value.second,
      millisecond: value.millisecond,
      timeZone: value.timeZone,
    });
  }

  if (value instanceof CalendarDateTime) {
    return Temporal.PlainDateTime.from({
      year: value.year,
      month: value.month,
      day: value.day,
      hour: value.hour,
      minute: value.minute,
      second: value.second,
      millisecond: value.millisecond,
    });
  }

  if (value instanceof CalendarDate) {
    return Temporal.PlainDate.from({
      year: value.year,
      month: value.month,
      day: value.day,
    });
  }

  return Temporal.PlainTime.from({
    hour: value.hour,
    minute: value.minute,
    second: value.second,
    millisecond: value.millisecond,
  });
}
