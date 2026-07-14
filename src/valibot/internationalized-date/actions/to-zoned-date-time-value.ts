import type { ToZonedDateTimeIssue } from '@thaz/temporal-util/valibot';

import type { BaseTransformation, ErrorMessage, OutputDataset } from 'valibot';
import { ZonedDateTime } from '@internationalized/date';
import { Temporal } from '@js-temporal/polyfill';
import { _addIssue } from 'valibot';

/**
 * Transformation action that converts a value to a {@link Temporal.ZonedDateTime}.
 */
export interface ToZonedDateTimeAction<
  TInput,
  TMessage extends ErrorMessage<ToZonedDateTimeIssue<TInput>> | undefined,
> extends BaseTransformation<TInput, Temporal.ZonedDateTime, ToZonedDateTimeIssue<TInput>> {
  type: 'to_zoned_date_time';
  reference: typeof toZonedDateTime;
  message: TMessage;
}

/**
 * Creates a transformation action that converts a value to a {@link Temporal.ZonedDateTime}.
 *
 * Accepted input types and their conversions:
 * - {@link String} — parsed using RFC 9557.
 * - `@internationalized/date` {@link ZonedDateTime} — converted via string round-trip.
 * - {@link Temporal.ZonedDateTime} — passed through unchanged.
 *
 * All other input types produce a validation issue.
 *
 * @returns A transformation action where value represents {@link Temporal.ZonedDateTime}.
 */
export function toZonedDateTime<TInput>(): ToZonedDateTimeAction<TInput, undefined>;

/**
 * Creates a transformation action that converts a value to a {@link Temporal.ZonedDateTime}.
 *
 * Accepted input types and their conversions:
 * - {@link String} — parsed using RFC 9557.
 * - `@internationalized/date` {@link ZonedDateTime} — converted via string round-trip.
 * - {@link Temporal.ZonedDateTime} — passed through unchanged.
 *
 * All other input types produce a validation issue.
 *
 * @param message The error message used when conversion fails.
 *
 * @returns A transformation action where value represents {@link Temporal.ZonedDateTime}.
 */
export function toZonedDateTime<TInput, const TMessage extends ErrorMessage<ToZonedDateTimeIssue<TInput>> | undefined>(
  message: TMessage,
): ToZonedDateTimeAction<TInput, TMessage>;

export function toZonedDateTime(
  message?: ErrorMessage<ToZonedDateTimeIssue<unknown>>,
): ToZonedDateTimeAction<unknown, ErrorMessage<ToZonedDateTimeIssue<unknown>> | undefined> {
  return {
    kind: 'transformation',
    type: 'to_zoned_date_time',
    reference: toZonedDateTime,
    async: false,
    message,
    '~run'(dataset, config) {
      const { value } = dataset;

      try {
        if (typeof value === 'string') {
          dataset.value = Temporal.ZonedDateTime.from(value);
        } else if (value instanceof ZonedDateTime) {
          dataset.value = Temporal.ZonedDateTime.from(value.toString());
        } else if (!(value instanceof Temporal.ZonedDateTime)) {
          _addIssue(this, 'zonedDateTime', dataset, config, {
            received: '"Invalid conversion option"',
          });
          // @ts-expect-error We expect this here. As noted in valibot documentation this code is correct but simplifies the types
          dataset.typed = false;
        }
      } catch {
        _addIssue(this, 'zonedDateTime', dataset, config);
        // @ts-expect-error We expect this here. As noted in valibot documentation this code is correct but simplifies the types
        dataset.typed = false;
      }

      // oxlint-disable-next-line typescript/no-unsafe-type-assertion
      return dataset as OutputDataset<Temporal.ZonedDateTime, ToZonedDateTimeIssue<unknown>>;
    },
  };
}
