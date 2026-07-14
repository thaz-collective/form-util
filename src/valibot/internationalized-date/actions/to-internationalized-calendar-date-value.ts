import type { BaseIssue, BaseTransformation, ErrorMessage, OutputDataset } from 'valibot';
import {
  CalendarDate,
  parseDate,
  parseZonedDateTime,
  ZonedDateTime,
  toCalendarDate,
  parseDateTime,
  CalendarDateTime,
} from '@internationalized/date';
import { Temporal } from '@js-temporal/polyfill';
import { _addIssue } from 'valibot';

/**
 * Issue raised when a value cannot be converted to a `@internationalized/date` {@link CalendarDate}.
 */
export interface ToInternationalizedCalendarDateIssue<TInput> extends BaseIssue<TInput | CalendarDate> {
  kind: 'transformation';
  type: 'to_calendar_date';
  expected: null;
}

/**
 * Transformation action that converts a value to a `@internationalized/date` {@link CalendarDate}.
 */
export interface ToInternationalizedCalendarDateAction<
  TInput,
  TMessage extends ErrorMessage<ToInternationalizedCalendarDateIssue<TInput>> | undefined,
> extends BaseTransformation<TInput, CalendarDate, ToInternationalizedCalendarDateIssue<TInput>> {
  type: 'to_calendar_date';
  reference: typeof toInternationalizedCalendarDate;
  message: TMessage;
}

/**
 * Creates a transformation action that converts a value to a `@internationalized/date` {@link CalendarDate}.
 *
 * Accepted input types and their conversions:
 * - {@link String} — parsed using RFC 9557.
 * - {@link Temporal.ZonedDateTime} — converted via string round-trip and `toCalendarDate()`.
 * - {@link Temporal.PlainDateTime} — converted via string round-trip and `toCalendarDate()`.
 * - {@link Temporal.PlainDate} — parsed via string round-trip.
 * - `@internationalized/date` {@link ZonedDateTime} — converted via `toCalendarDate()`.
 * - `@internationalized/date` {@link CalendarDateTime} — converted via `toCalendarDate()`.
 * - `@internationalized/date` {@link CalendarDate} — passed through unchanged.
 *
 * All other input types produce a validation issue.
 *
 * @returns A transformation action where value represents `@internationalized/date` {@link CalendarDate}.
 */
export function toInternationalizedCalendarDate<TInput>(): ToInternationalizedCalendarDateAction<TInput, undefined>;

/**
 * Creates a transformation action that converts a value to a `@internationalized/date` {@link CalendarDate}.
 *
 * Accepted input types and their conversions:
 * - {@link String} — parsed using RFC 9557.
 * - {@link Temporal.ZonedDateTime} — converted via string round-trip and `toCalendarDate()`.
 * - {@link Temporal.PlainDateTime} — converted via string round-trip and `toCalendarDate()`.
 * - {@link Temporal.PlainDate} — parsed via string round-trip.
 * - `@internationalized/date` {@link ZonedDateTime} — converted via `toCalendarDate()`.
 * - `@internationalized/date` {@link CalendarDateTime} — converted via `toCalendarDate()`.
 * - `@internationalized/date` {@link CalendarDate} — passed through unchanged.
 *
 * All other input types produce a validation issue.
 *
 * @param message The error message used when conversion fails.
 *
 * @returns A transformation action where value represents `@internationalized/date` {@link CalendarDate}.
 */
export function toInternationalizedCalendarDate<
  TInput,
  const TMessage extends ErrorMessage<ToInternationalizedCalendarDateIssue<TInput>> | undefined,
>(message: TMessage): ToInternationalizedCalendarDateAction<TInput, TMessage>;

export function toInternationalizedCalendarDate(
  message?: ErrorMessage<ToInternationalizedCalendarDateIssue<unknown>>,
): ToInternationalizedCalendarDateAction<
  unknown,
  ErrorMessage<ToInternationalizedCalendarDateIssue<unknown>> | undefined
> {
  return {
    kind: 'transformation',
    type: 'to_calendar_date',
    reference: toInternationalizedCalendarDate,
    async: false,
    message,
    '~run'(dataset, config) {
      const { value } = dataset;

      try {
        if (typeof value === 'string') {
          dataset.value = parseDate(value);
        } else if (value instanceof Temporal.ZonedDateTime) {
          dataset.value = toCalendarDate(parseZonedDateTime(value.toString()));
        } else if (value instanceof Temporal.PlainDateTime) {
          dataset.value = toCalendarDate(parseDateTime(value.toString()));
        } else if (value instanceof Temporal.PlainDate) {
          dataset.value = parseDate(value.toString());
        } else if (value instanceof ZonedDateTime) {
          dataset.value = toCalendarDate(value);
        } else if (value instanceof CalendarDateTime) {
          dataset.value = toCalendarDate(value);
        } else if (!(value instanceof CalendarDate)) {
          _addIssue(this, 'calendarDate', dataset, config, {
            received: '"Invalid conversion option"',
          });
          // @ts-expect-error We expect this here. As noted in valibot documentation this code is correct but simplifies the types
          dataset.typed = false;
        }
      } catch {
        _addIssue(this, 'calendarDate', dataset, config);
        // @ts-expect-error We expect this here. As noted in valibot documentation this code is correct but simplifies the types
        dataset.typed = false;
      }

      // oxlint-disable-next-line typescript/no-unsafe-type-assertion
      return dataset as OutputDataset<CalendarDate, ToInternationalizedCalendarDateIssue<unknown>>;
    },
  };
}
