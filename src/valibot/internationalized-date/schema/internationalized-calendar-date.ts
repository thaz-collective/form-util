import type { BaseIssue, ErrorMessage, BaseSchema, OutputDataset } from 'valibot';
import { CalendarDate } from '@internationalized/date';
import { _getStandardProps, _addIssue } from 'valibot';

/**
 * Issue raised when the input is not a {@link CalendarDate} instance.
 */
export interface InternationalizedCalendarDateIssue extends BaseIssue<unknown> {
  kind: 'schema';
  type: 'internationalized_calendar_date';
  expects: '@internationalized/date.CalendarDate';
}

/**
 * Schema that accepts only {@link CalendarDate} instances.
 */
export interface InternationalizedCalendarDateSchema<
  TMessage extends ErrorMessage<InternationalizedCalendarDateIssue> | undefined,
> extends BaseSchema<CalendarDate, CalendarDate, InternationalizedCalendarDateIssue> {
  type: 'internationalized_calendar_date';
  reference: typeof internationalizedCalendarDate;
  expects: '@internationalized/date.CalendarDate';
  message: TMessage;
}

/**
 * Creates a schema that validates {@link CalendarDate} instances. Any other value type
 * produces an {@link InternationalizedCalendarDateIssue}.
 *
 * @returns A schema representing {@link CalendarDate}.
 */
export function internationalizedCalendarDate(): InternationalizedCalendarDateSchema<undefined>;

/**
 * Creates a schema that validates {@link CalendarDate} instances. Any other value type
 * produces an {@link InternationalizedCalendarDateIssue}.
 *
 * @param message The error message used when validation fails.
 *
 * @returns A schema representing {@link CalendarDate}.
 */
export function internationalizedCalendarDate<const TMessage extends ErrorMessage<InternationalizedCalendarDateIssue>>(
  message: TMessage,
): InternationalizedCalendarDateSchema<TMessage>;

export function internationalizedCalendarDate(
  message?: ErrorMessage<InternationalizedCalendarDateIssue>,
): InternationalizedCalendarDateSchema<ErrorMessage<InternationalizedCalendarDateIssue> | undefined> {
  return {
    kind: 'schema',
    type: 'internationalized_calendar_date',
    reference: internationalizedCalendarDate,
    expects: '@internationalized/date.CalendarDate',
    async: false,
    message,
    get '~standard'() {
      return _getStandardProps(this);
    },
    '~run'(dataset, config) {
      if (dataset.value instanceof CalendarDate) {
        // @ts-expect-error We expect this here. As noted in valibot documentation this code is correct but simplifies the types
        dataset.typed = true;
      } else {
        _addIssue(this, 'type', dataset, config);
      }

      // @ts-expect-error We expect this here. As noted in valibot documentation this code is correct but simplifies the types
      // oxlint-disable-next-line typescript/no-unsafe-type-assertion typescript/no-unsafe-return
      return dataset as OutputDataset<CalendarDate, InternationalizedCalendarDateIssue>;
    },
  };
}
