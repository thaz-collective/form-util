import type { ToPlainTimeIssue } from '@thaz/temporal-util/valibot';

import type { BaseTransformation, ErrorMessage, OutputDataset } from 'valibot';
import { ZonedDateTime, CalendarDateTime, Time } from '@internationalized/date';
import { Temporal } from '@js-temporal/polyfill';
import { _addIssue } from 'valibot';

/**
 * Transformation action that converts a value to a {@link Temporal.PlainTime}.
 */
export interface ToPlainTimeAction<
  TInput,
  TMessage extends ErrorMessage<ToPlainTimeIssue<TInput>> | undefined,
> extends BaseTransformation<TInput, Temporal.PlainTime, ToPlainTimeIssue<TInput>> {
  type: 'to_plain_time';
  reference: typeof toPlainTime;
  message: TMessage;
}

/**
 * Creates a transformation action that converts a value to a {@link Temporal.PlainTime}.
 *
 * Accepted input types and their conversions:
 * - {@link String} — parsed using RFC 9557.
 * - {@link Temporal.ZonedDateTime} — `.toPlainTime()` is called.
 * - {@link Temporal.PlainDateTime} — `.toPlainTime()` is called.
 * - `@internationalized/date` {@link ZonedDateTime} — converted via string round-trip and `.toPlainTime()`.
 * - `@internationalized/date` {@link CalendarDateTime} — converted via string round-trip and `.toPlainTime()`.
 * - `@internationalized/date` {@link Time} — converted via string round-trip.
 * - {@link Temporal.PlainTime} — passed through unchanged.
 *
 * All other input types produce a validation issue.
 *
 * @returns A transformation action where value represents {@link Temporal.PlainTime}.
 */
export function toPlainTime<TInput>(): ToPlainTimeAction<TInput, undefined>;

/**
 * Creates a transformation action that converts a value to a {@link Temporal.PlainTime}.
 *
 * Accepted input types and their conversions:
 * - {@link String} — parsed using RFC 9557.
 * - {@link Temporal.ZonedDateTime} — `.toPlainTime()` is called.
 * - {@link Temporal.PlainDateTime} — `.toPlainTime()` is called.
 * - `@internationalized/date` {@link ZonedDateTime} — converted via string round-trip and `.toPlainTime()`.
 * - `@internationalized/date` {@link CalendarDateTime} — converted via string round-trip and `.toPlainTime()`.
 * - `@internationalized/date` {@link Time} — converted via string round-trip.
 * - {@link Temporal.PlainTime} — passed through unchanged.
 *
 * All other input types produce a validation issue.
 *
 * @param message The error message used when conversion fails.
 *
 * @returns A transformation action where value represents {@link Temporal.PlainTime}.
 */
export function toPlainTime<TInput, const TMessage extends ErrorMessage<ToPlainTimeIssue<TInput>> | undefined>(
  message: TMessage,
): ToPlainTimeAction<TInput, TMessage>;

export function toPlainTime(
  message?: ErrorMessage<ToPlainTimeIssue<unknown>>,
): ToPlainTimeAction<unknown, ErrorMessage<ToPlainTimeIssue<unknown>> | undefined> {
  return {
    kind: 'transformation',
    type: 'to_plain_time',
    reference: toPlainTime,
    async: false,
    message,
    '~run'(dataset, config) {
      const { value } = dataset;

      try {
        if (typeof value === 'string') {
          dataset.value = Temporal.PlainTime.from(value);
        } else if (value instanceof Temporal.ZonedDateTime) {
          dataset.value = value.toPlainTime();
        } else if (value instanceof Temporal.PlainDateTime) {
          dataset.value = value.toPlainTime();
        } else if (value instanceof ZonedDateTime) {
          dataset.value = Temporal.ZonedDateTime.from(value.toString()).toPlainTime();
        } else if (value instanceof CalendarDateTime) {
          dataset.value = Temporal.PlainDateTime.from(value.toString()).toPlainTime();
        } else if (value instanceof Time) {
          dataset.value = Temporal.PlainTime.from(value.toString());
        } else if (!(value instanceof Temporal.PlainTime)) {
          _addIssue(this, 'plainTime', dataset, config, {
            received: '"Invalid conversion option"',
          });
          // @ts-expect-error We expect this here. As noted in valibot documentation this code is correct but simplifies the types
          dataset.typed = false;
        }
      } catch {
        _addIssue(this, 'plainTime', dataset, config);
        // @ts-expect-error We expect this here. As noted in valibot documentation this code is correct but simplifies the types
        dataset.typed = false;
      }

      // oxlint-disable-next-line typescript/no-unsafe-type-assertion
      return dataset as OutputDataset<Temporal.PlainTime, ToPlainTimeIssue<unknown>>;
    },
  };
}
