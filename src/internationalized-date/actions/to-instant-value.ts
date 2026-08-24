import type { ToInstantIssue } from '@thaz/temporal-util/valibot';

import type { BaseTransformation, ErrorMessage, OutputDataset } from 'valibot';
import { ZonedDateTime } from '@internationalized/date';
import { _addIssue } from 'valibot';

import { internationalizedToTemporalDateTime } from '#src/util/internationalized-to-temporal';

/**
 * Transformation action that converts a value to a {@link Temporal.Instant}.
 */
export interface ToInstantAction<
  TInput,
  TMessage extends ErrorMessage<ToInstantIssue<TInput>> | undefined,
> extends BaseTransformation<TInput, Temporal.Instant, ToInstantIssue<TInput>> {
  type: 'to_instant';
  reference: typeof toInstant;
  message: TMessage;
}

/**
 * Creates a transformation action that converts a value to a {@link Temporal.Instant}.
 *
 * Accepted input types and their conversions:
 * - `@internationalized/date` {@link ZonedDateTime}
 * - {@link Temporal.Instant} — passed through unchanged.
 *
 * All other input types produce a validation issue.
 *
 * @returns A transformation action where value represents {@link Temporal.Instant}.
 */
export function toInstant<TInput>(): ToInstantAction<TInput, undefined>;

/**
 * Creates a transformation action that converts a value to a {@link Temporal.Instant}.
 *
 * Accepted input types and their conversions:
 * - `@internationalized/date` {@link ZonedDateTime}
 * - {@link Temporal.Instant} — passed through unchanged.
 *
 * All other input types produce a validation issue.
 *
 * @param message The error message used when conversion fails.
 *
 * @returns A transformation action where value represents {@link Temporal.Instant}.
 */
export function toInstant<TInput, const TMessage extends ErrorMessage<ToInstantIssue<TInput>> | undefined>(
  message: TMessage,
): ToInstantAction<TInput, TMessage>;

export function toInstant(
  message?: ErrorMessage<ToInstantIssue<unknown>>,
): ToInstantAction<unknown, ErrorMessage<ToInstantIssue<unknown>> | undefined> {
  return {
    kind: 'transformation',
    type: 'to_instant',
    reference: toInstant,
    async: false,
    message,
    '~run'(dataset, config) {
      const { value } = dataset;

      try {
        if (value instanceof ZonedDateTime) {
          dataset.value = internationalizedToTemporalDateTime(value).toInstant();
        } else if (!(value instanceof Temporal.Instant)) {
          _addIssue(this, 'instant', dataset, config, {
            received: '"Invalid conversion option"',
          });
          // @ts-expect-error We expect this here. As noted in valibot documentation this code is correct but simplifies the types
          dataset.typed = false;
        }
      } catch {
        _addIssue(this, 'instant', dataset, config);
        // @ts-expect-error We expect this here. As noted in valibot documentation this code is correct but simplifies the types
        dataset.typed = false;
      }

      // oxlint-disable-next-line typescript/no-unsafe-type-assertion
      return dataset as OutputDataset<Temporal.Instant, ToInstantIssue<unknown>>;
    },
  };
}
