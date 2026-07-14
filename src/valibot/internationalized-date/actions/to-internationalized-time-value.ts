import type { BaseIssue, BaseTransformation, ErrorMessage, OutputDataset } from 'valibot';
import {
  Time,
  parseTime,
  parseZonedDateTime,
  ZonedDateTime,
  toTime,
  parseDateTime,
  CalendarDateTime,
} from '@internationalized/date';
import { Temporal } from '@js-temporal/polyfill';
import { _addIssue } from 'valibot';

/**
 * Issue raised when a value cannot be converted to a `@internationalized/date` {@link Time}.
 */
export interface ToInternationalizedTimeIssue<TInput> extends BaseIssue<TInput | Time> {
  kind: 'transformation';
  type: 'to_time';
  expected: null;
}

/**
 * Transformation action that converts a value to a `@internationalized/date` {@link Time}.
 */
export interface ToInternationalizedTimeAction<
  TInput,
  TMessage extends ErrorMessage<ToInternationalizedTimeIssue<TInput>> | undefined,
> extends BaseTransformation<TInput, Time, ToInternationalizedTimeIssue<TInput>> {
  type: 'to_time';
  reference: typeof toInternationalizedTime;
  message: TMessage;
}

/**
 * Creates a transformation action that converts a value to a `@internationalized/date` {@link Time}.
 *
 * Accepted input types and their conversions:
 * - {@link String} — parsed using RFC 9557.
 * - {@link Temporal.ZonedDateTime} — converted via string round-trip and `toTime()`.
 * - {@link Temporal.PlainDateTime} — converted via string round-trip and `toTime()`.
 * - {@link Temporal.PlainTime} — parsed via string round-trip.
 * - `@internationalized/date` {@link ZonedDateTime} — converted via `toTime()`.
 * - `@internationalized/date` {@link CalendarDateTime} — converted via `toTime()`.
 * - `@internationalized/date` {@link Time} — passed through unchanged.
 *
 * All other input types produce a validation issue.
 *
 * @returns A transformation action where value represents `@internationalized/date` {@link Time}.
 */
export function toInternationalizedTime<TInput>(): ToInternationalizedTimeAction<TInput, undefined>;

/**
 * Creates a transformation action that converts a value to a `@internationalized/date` {@link Time}.
 *
 * Accepted input types and their conversions:
 * - {@link String} — parsed using RFC 9557.
 * - {@link Temporal.ZonedDateTime} — converted via string round-trip and `toTime()`.
 * - {@link Temporal.PlainDateTime} — converted via string round-trip and `toTime()`.
 * - {@link Temporal.PlainTime} — parsed via string round-trip.
 * - `@internationalized/date` {@link ZonedDateTime} — converted via `toTime()`.
 * - `@internationalized/date` {@link CalendarDateTime} — converted via `toTime()`.
 * - `@internationalized/date` {@link Time} — passed through unchanged.
 *
 * All other input types produce a validation issue.
 *
 * @param message The error message used when conversion fails.
 *
 * @returns A transformation action where value represents `@internationalized/date` {@link Time}.
 */
export function toInternationalizedTime<
  TInput,
  const TMessage extends ErrorMessage<ToInternationalizedTimeIssue<TInput>> | undefined,
>(message: TMessage): ToInternationalizedTimeAction<TInput, TMessage>;

export function toInternationalizedTime(
  message?: ErrorMessage<ToInternationalizedTimeIssue<unknown>>,
): ToInternationalizedTimeAction<unknown, ErrorMessage<ToInternationalizedTimeIssue<unknown>> | undefined> {
  return {
    kind: 'transformation',
    type: 'to_time',
    reference: toInternationalizedTime,
    async: false,
    message,
    '~run'(dataset, config) {
      const { value } = dataset;

      try {
        if (typeof value === 'string') {
          dataset.value = parseTime(value);
        } else if (value instanceof Temporal.ZonedDateTime) {
          dataset.value = toTime(parseZonedDateTime(value.toString()));
        } else if (value instanceof Temporal.PlainDateTime) {
          dataset.value = toTime(parseDateTime(value.toString()));
        } else if (value instanceof Temporal.PlainTime) {
          dataset.value = parseTime(value.toString());
        } else if (value instanceof ZonedDateTime) {
          dataset.value = toTime(value);
        } else if (value instanceof CalendarDateTime) {
          dataset.value = toTime(value);
        } else if (!(value instanceof Time)) {
          _addIssue(this, 'time', dataset, config, {
            received: '"Invalid conversion option"',
          });
          // @ts-expect-error We expect this here. As noted in valibot documentation this code is correct but simplifies the types
          dataset.typed = false;
        }
      } catch {
        _addIssue(this, 'time', dataset, config);
        // @ts-expect-error We expect this here. As noted in valibot documentation this code is correct but simplifies the types
        dataset.typed = false;
      }

      // oxlint-disable-next-line typescript/no-unsafe-type-assertion
      return dataset as OutputDataset<Time, ToInternationalizedTimeIssue<unknown>>;
    },
  };
}
