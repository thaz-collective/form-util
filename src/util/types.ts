import type { ZonedDateTime, CalendarDateTime, CalendarDate, Time } from '@internationalized/date';

export type TemporalDateTimeValue =
  | Temporal.ZonedDateTime
  | Temporal.PlainDateTime
  | Temporal.PlainDate
  | Temporal.PlainTime;
export type TemporalDateValue = Temporal.ZonedDateTime | Temporal.PlainDateTime | Temporal.PlainDate;
export type TemporalTimeValue = Temporal.ZonedDateTime | Temporal.PlainDateTime | Temporal.PlainTime;

export type MapTemporalToInternationalizedDateTime<T extends TemporalDateTimeValue> = T extends Temporal.ZonedDateTime
  ? ZonedDateTime
  : T extends Temporal.PlainDateTime
    ? CalendarDateTime
    : T extends Temporal.PlainDate
      ? CalendarDate
      : T extends Temporal.PlainTime
        ? Time
        : never;

export type MapTemporalToInternationalizedDate<T extends TemporalDateValue> = T extends Temporal.ZonedDateTime
  ? ZonedDateTime
  : T extends Temporal.PlainDateTime
    ? CalendarDateTime
    : T extends Temporal.PlainDate
      ? CalendarDate
      : never;

export type MapTemporalToInternationalizedTime<T extends TemporalTimeValue> = T extends Temporal.ZonedDateTime
  ? ZonedDateTime
  : T extends Temporal.PlainDateTime
    ? CalendarDateTime
    : T extends Temporal.PlainTime
      ? Time
      : never;

export type InternationalizedDateTimeValue = ZonedDateTime | CalendarDateTime | CalendarDate | Time;
export type InternationalizedDateValue = ZonedDateTime | CalendarDateTime | CalendarDate;
export type InternationalizedTimeValue = ZonedDateTime | CalendarDateTime | Time;

export type MapInternationalizedToTemporalDateTime<T extends InternationalizedDateTimeValue> = T extends ZonedDateTime
  ? Temporal.ZonedDateTime
  : T extends CalendarDateTime
    ? Temporal.PlainDateTime
    : T extends CalendarDate
      ? Temporal.PlainDate
      : T extends Time
        ? Temporal.PlainTime
        : never;

export type MapInternationalizedToTemporalDate<T extends InternationalizedDateValue> = T extends ZonedDateTime
  ? Temporal.ZonedDateTime
  : T extends CalendarDateTime
    ? Temporal.PlainDateTime
    : T extends CalendarDate
      ? Temporal.PlainDate
      : never;

export type MapInternationalizedToTemporalTime<T extends InternationalizedTimeValue> = T extends ZonedDateTime
  ? Temporal.ZonedDateTime
  : T extends CalendarDateTime
    ? Temporal.PlainDateTime
    : T extends Time
      ? Temporal.PlainTime
      : never;
