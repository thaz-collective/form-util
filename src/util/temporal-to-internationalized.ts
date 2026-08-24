import { ZonedDateTime, CalendarDateTime, CalendarDate, Time } from '@internationalized/date';

import type {
  TemporalDateTimeValue,
  TemporalDateValue,
  TemporalTimeValue,
  InternationalizedDateTimeValue,
  InternationalizedDateValue,
  InternationalizedTimeValue,
} from './types';

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

export function temporalToInternationalizedDate(value: Temporal.ZonedDateTime): ZonedDateTime;
export function temporalToInternationalizedDate(value: Temporal.PlainDateTime): CalendarDateTime;
export function temporalToInternationalizedDate(value: Temporal.PlainDate): CalendarDate;
export function temporalToInternationalizedDate(value: TemporalDateValue): InternationalizedDateValue {
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

  return new CalendarDate(value.year, value.month, value.day);
}

export function temporalToInternationalizedTime(value: Temporal.ZonedDateTime): ZonedDateTime;
export function temporalToInternationalizedTime(value: Temporal.PlainDateTime): CalendarDateTime;
export function temporalToInternationalizedTime(value: Temporal.PlainTime): Time;
export function temporalToInternationalizedTime(value: TemporalTimeValue): InternationalizedTimeValue {
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

  return new Time(value.hour, value.minute, value.second, value.millisecond);
}
