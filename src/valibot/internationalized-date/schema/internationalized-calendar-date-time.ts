import type { BaseIssue, ErrorMessage, BaseSchema, OutputDataset } from 'valibot';
import { CalendarDateTime } from '@internationalized/date';
import { _getStandardProps, _addIssue } from 'valibot';

/**
 * Issue raised when the input is not a {@link CalendarDateTime} instance.
 */
export interface InternationalizedCalendarDateTimeIssue extends BaseIssue<unknown> {
  kind: 'schema';
  type: 'internationalized_calendar_date_time';
  expected: '@internationalized/date.CalendarDateTime';
}

/**
 * Schema that accepts only {@link CalendarDateTime} instances.
 */
export interface InternationalizedCalendarDateTimeSchema<
  TMessage extends ErrorMessage<InternationalizedCalendarDateTimeIssue> | undefined,
> extends BaseSchema<CalendarDateTime, CalendarDateTime, InternationalizedCalendarDateTimeIssue> {
  type: 'internationalized_calendar_date_time';
  reference: typeof internationalizedCalendarDateTime;
  expects: '@internationalized/date.CalendarDateTime';
  message: TMessage;
}

/**
 * Creates a schema that validates {@link CalendarDateTime} instances. Any other value type
 * produces an {@link InternationalizedCalendarDateTimeIssue}.
 *
 * @returns A schema representing {@link CalendarDateTime}.
 */
export function internationalizedCalendarDateTime(): InternationalizedCalendarDateTimeSchema<undefined>;

/**
 * Creates a schema that validates {@link CalendarDateTime} instances. Any other value type
 * produces an {@link InternationalizedCalendarDateTimeIssue}.
 *
 * @param message The error message used when validation fails.
 *
 * @returns A schema representing {@link CalendarDateTime}.
 */
export function internationalizedCalendarDateTime<
  const TMessage extends ErrorMessage<InternationalizedCalendarDateTimeIssue> | undefined,
>(message: TMessage): InternationalizedCalendarDateTimeSchema<TMessage>;

export function internationalizedCalendarDateTime(
  message?: ErrorMessage<InternationalizedCalendarDateTimeIssue>,
): InternationalizedCalendarDateTimeSchema<ErrorMessage<InternationalizedCalendarDateTimeIssue> | undefined> {
  return {
    kind: 'schema',
    type: 'internationalized_calendar_date_time',
    reference: internationalizedCalendarDateTime,
    expects: '@internationalized/date.CalendarDateTime',
    async: false,
    message,
    get '~standard'() {
      return _getStandardProps(this);
    },
    '~run'(dataset, config) {
      if (dataset.value instanceof CalendarDateTime) {
        // @ts-expect-error We expect this here. As noted in valibot documentation this code is correct but simplifies the types
        dataset.typed = true;
      } else {
        _addIssue(this, 'type', dataset, config);
      }

      // @ts-expect-error We expect this here. As noted in valibot documentation this code is correct but simplifies the types
      // oxlint-disable-next-line typescript/no-unsafe-type-assertion typescript/no-unsafe-return
      return dataset as OutputDataset<CalendarDateTime, InternationalizedCalendarDateTimeIssue>;
    },
  };
}
