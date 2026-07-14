import type { ToPlainDateIssue } from '@thaz/temporal-util/valibot';

import type { BaseTransformation, ErrorMessage, OutputDataset } from 'valibot';
import { ZonedDateTime, CalendarDateTime, CalendarDate } from '@internationalized/date';
import { Temporal } from '@js-temporal/polyfill';
import { _addIssue } from 'valibot';

/**
 * Transformation action that converts a value to a {@link Temporal.PlainDate}.
 */
export interface ToPlainDateAction<
  TInput,
  TMessage extends ErrorMessage<ToPlainDateIssue<TInput>> | undefined,
> extends BaseTransformation<TInput, Temporal.PlainDate, ToPlainDateIssue<TInput>> {
  type: 'to_plain_date';
  reference: typeof toPlainDate;
  message: TMessage;
}

/**
 * Creates a transformation action that converts a value to a {@link Temporal.PlainDate}.
 *
 * Accepted input types and their conversions:
 * - `@internationalized/date` {@link ZonedDateTime}
 * - `@internationalized/date` {@link CalendarDateTime}
 * - `@internationalized/date` {@link CalendarDate}
 * - {@link Temporal.PlainDate} — passed through unchanged.
 *
 * All other input types produce a validation issue.
 *
 * @returns A transformation action where value represents {@link Temporal.PlainDate}.
 */
export function toPlainDate<TInput>(): ToPlainDateAction<TInput, undefined>;

/**
 * Creates a transformation action that converts a value to a {@link Temporal.PlainDate}.
 *
 * Accepted input types and their conversions:
 * - `@internationalized/date` {@link ZonedDateTime}
 * - `@internationalized/date` {@link CalendarDateTime}
 * - `@internationalized/date` {@link CalendarDate}
 * - {@link Temporal.PlainDate} — passed through unchanged.
 *
 * All other input types produce a validation issue.
 *
 * @param message The error message used when conversion fails.
 *
 * @returns A transformation action where value represents {@link Temporal.PlainDate}.
 */
export function toPlainDate<TInput, const TMessage extends ErrorMessage<ToPlainDateIssue<TInput>> | undefined>(
  message: TMessage,
): ToPlainDateAction<TInput, TMessage>;

export function toPlainDate(
  message?: ErrorMessage<ToPlainDateIssue<unknown>>,
): ToPlainDateAction<unknown, ErrorMessage<ToPlainDateIssue<unknown>> | undefined> {
  return {
    kind: 'transformation',
    type: 'to_plain_date',
    reference: toPlainDate,
    async: false,
    message,
    '~run'(dataset, config) {
      const { value } = dataset;

      try {
        if (value instanceof ZonedDateTime) {
          dataset.value = Temporal.ZonedDateTime.from(value.toString()).toPlainDate();
        } else if (value instanceof CalendarDateTime) {
          dataset.value = Temporal.PlainDateTime.from(value.toString()).toPlainDate();
        } else if (value instanceof CalendarDate) {
          dataset.value = Temporal.PlainDate.from(value.toString());
        } else if (!(value instanceof Temporal.PlainDate)) {
          _addIssue(this, 'plainDate', dataset, config, {
            received: '"Invalid conversion option"',
          });
          // @ts-expect-error We expect this here. As noted in valibot documentation this code is correct but simplifies the types
          dataset.typed = false;
        }
      } catch {
        _addIssue(this, 'plainDate', dataset, config);
        // @ts-expect-error We expect this here. As noted in valibot documentation this code is correct but simplifies the types
        dataset.typed = false;
      }

      // oxlint-disable-next-line typescript/no-unsafe-type-assertion
      return dataset as OutputDataset<Temporal.PlainDate, ToPlainDateIssue<unknown>>;
    },
  };
}
