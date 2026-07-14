import type { BaseIssue, BaseTransformation, ErrorMessage, OutputDataset } from 'valibot';
import {
  CalendarDateTime,
  parseDateTime,
  parseZonedDateTime,
  ZonedDateTime,
  toCalendarDateTime,
} from '@internationalized/date';
import { Temporal } from '@js-temporal/polyfill';
import { _addIssue } from 'valibot';

/**
 * Issue raised when a value cannot be converted to a `@internationalized/date` {@link CalendarDateTime}.
 */
export interface ToInternationalizedCalendarDateTimeIssue<TInput> extends BaseIssue<TInput | CalendarDateTime> {
  kind: 'transformation';
  type: 'to_calendar_date_time';
  expected: null;
}

/**
 * Transformation action that converts a value to a `@internationalized/date` {@link CalendarDateTime}.
 */
export interface ToInternationalizedCalendarDateTimeAction<
  TInput,
  TMessage extends ErrorMessage<ToInternationalizedCalendarDateTimeIssue<TInput>> | undefined,
> extends BaseTransformation<TInput, CalendarDateTime, ToInternationalizedCalendarDateTimeIssue<TInput>> {
  type: 'to_calendar_date_time';
  reference: typeof toInternationalizedCalendarDateTime;
  message: TMessage;
}

/**
 * Creates a transformation action that converts a value to a `@internationalized/date` {@link CalendarDateTime}.
 *
 * Accepted input types and their conversions:
 * - {@link String} — parsed using RFC 9557.
 * - {@link Temporal.ZonedDateTime} — converted via string round-trip.
 * - {@link Temporal.PlainDateTime} — parsed via string round-trip.
 * - `@internationalized/date` {@link ZonedDateTime} — converted via `toCalendarDateTime()`.
 * - `@internationalized/date` {@link CalendarDateTime} — passed through unchanged.
 *
 * All other input types produce a validation issue.
 *
 * @returns A transformation action where value represents `@internationalized/date` {@link CalendarDateTime}.
 */
export function toInternationalizedCalendarDateTime<TInput>(): ToInternationalizedCalendarDateTimeAction<
  TInput,
  undefined
>;

/**
 * Creates a transformation action that converts a value to a `@internationalized/date` {@link CalendarDateTime}.
 *
 * Accepted input types and their conversions:
 * - {@link String} — parsed using RFC 9557.
 * - {@link Temporal.ZonedDateTime} — converted via string round-trip.
 * - {@link Temporal.PlainDateTime} — parsed via string round-trip.
 * - `@internationalized/date` {@link ZonedDateTime} — converted via `toCalendarDateTime()`.
 * - `@internationalized/date` {@link CalendarDateTime} — passed through unchanged.
 *
 * All other input types produce a validation issue.
 *
 * @param message The error message used when conversion fails.
 *
 * @returns A transformation action where value represents `@internationalized/date` {@link CalendarDateTime}.
 */
export function toInternationalizedCalendarDateTime<
  TInput,
  const TMessage extends ErrorMessage<ToInternationalizedCalendarDateTimeIssue<TInput>> | undefined,
>(message: TMessage): ToInternationalizedCalendarDateTimeAction<TInput, TMessage>;

export function toInternationalizedCalendarDateTime(
  message?: ErrorMessage<ToInternationalizedCalendarDateTimeIssue<unknown>>,
): ToInternationalizedCalendarDateTimeAction<
  unknown,
  ErrorMessage<ToInternationalizedCalendarDateTimeIssue<unknown>> | undefined
> {
  return {
    kind: 'transformation',
    type: 'to_calendar_date_time',
    reference: toInternationalizedCalendarDateTime,
    async: false,
    message,
    '~run'(dataset, config) {
      const { value } = dataset;

      try {
        if (typeof value === 'string') {
          dataset.value = parseDateTime(value);
        } else if (value instanceof Temporal.ZonedDateTime) {
          dataset.value = toCalendarDateTime(parseZonedDateTime(value.toString()));
        } else if (value instanceof Temporal.PlainDateTime) {
          dataset.value = parseDateTime(value.toString());
        } else if (value instanceof ZonedDateTime) {
          dataset.value = toCalendarDateTime(value);
        } else if (!(value instanceof CalendarDateTime)) {
          _addIssue(this, 'calendarDateTime', dataset, config, {
            received: '"Invalid conversion option"',
          });
          // @ts-expect-error We expect this here. As noted in valibot documentation this code is correct but simplifies the types
          dataset.typed = false;
        }
      } catch {
        _addIssue(this, 'calendarDateTime', dataset, config);
        // @ts-expect-error We expect this here. As noted in valibot documentation this code is correct but simplifies the types
        dataset.typed = false;
      }

      // oxlint-disable-next-line typescript/no-unsafe-type-assertion
      return dataset as OutputDataset<CalendarDateTime, ToInternationalizedCalendarDateTimeIssue<unknown>>;
    },
  };
}
