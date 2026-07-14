import type { BaseIssue, BaseTransformation, ErrorMessage, OutputDataset } from 'valibot';
import { ZonedDateTime, parseZonedDateTime } from '@internationalized/date';
import { Temporal } from '@js-temporal/polyfill';
import { _addIssue } from 'valibot';

/**
 * Issue raised when a value cannot be converted to a `@internationalized/date` {@link ZonedDateTime}.
 */
export interface ToInternationalizedZonedDateTimeIssue<TInput> extends BaseIssue<TInput | ZonedDateTime> {
  kind: 'transformation';
  type: 'to_zoned_date_time';
  expected: null;
}

/**
 * Transformation action that converts a value to a `@internationalized/date` {@link ZonedDateTime}.
 */
export interface ToInternationalizedZonedDateTimeAction<
  TInput,
  TMessage extends ErrorMessage<ToInternationalizedZonedDateTimeIssue<TInput>> | undefined,
> extends BaseTransformation<TInput, ZonedDateTime, ToInternationalizedZonedDateTimeIssue<TInput>> {
  type: 'to_zoned_date_time';
  reference: typeof toInternationalizedZonedDateTime;
  message: TMessage;
}

/**
 * Creates a transformation action that converts a value to a `@internationalized/date` {@link ZonedDateTime}.
 *
 * Accepted input types and their conversions:
 * - {@link String} — parsed using RFC 9557.
 * - {@link Temporal.ZonedDateTime} — converted via string round-trip.
 * - `@internationalized/date` {@link ZonedDateTime} — passed through unchanged.
 *
 * All other input types produce a validation issue.
 *
 * @returns A transformation action where value represents `@internationalized/date` {@link ZonedDateTime}.
 */
export function toInternationalizedZonedDateTime<TInput>(): ToInternationalizedZonedDateTimeAction<TInput, undefined>;

/**
 * Creates a transformation action that converts a value to a `@internationalized/date` {@link ZonedDateTime}.
 *
 * Accepted input types and their conversions:
 * - {@link String} — parsed using RFC 9557.
 * - {@link Temporal.ZonedDateTime} — converted via string round-trip.
 * - `@internationalized/date` {@link ZonedDateTime} — passed through unchanged.
 *
 * All other input types produce a validation issue.
 *
 * @param message The error message used when conversion fails.
 *
 * @returns A transformation action where value represents `@internationalized/date` {@link ZonedDateTime}.
 */
export function toInternationalizedZonedDateTime<
  TInput,
  const TMessage extends ErrorMessage<ToInternationalizedZonedDateTimeIssue<TInput>> | undefined,
>(message: TMessage): ToInternationalizedZonedDateTimeAction<TInput, TMessage>;

export function toInternationalizedZonedDateTime(
  message?: ErrorMessage<ToInternationalizedZonedDateTimeIssue<unknown>>,
): ToInternationalizedZonedDateTimeAction<
  unknown,
  ErrorMessage<ToInternationalizedZonedDateTimeIssue<unknown>> | undefined
> {
  return {
    kind: 'transformation',
    type: 'to_zoned_date_time',
    reference: toInternationalizedZonedDateTime,
    async: false,
    message,
    '~run'(dataset, config) {
      try {
        if (typeof dataset.value === 'string') {
          dataset.value = parseZonedDateTime(dataset.value);
        } else if (dataset.value instanceof Temporal.ZonedDateTime) {
          dataset.value = parseZonedDateTime(dataset.value.toString());
        } else if (!(dataset.value instanceof ZonedDateTime)) {
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
      return dataset as OutputDataset<ZonedDateTime, ToInternationalizedZonedDateTimeIssue<unknown>>;
    },
  };
}
