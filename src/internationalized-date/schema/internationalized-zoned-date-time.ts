import type { BaseIssue, ErrorMessage, BaseSchema, OutputDataset } from 'valibot';
import { ZonedDateTime } from '@internationalized/date';
import { _getStandardProps, _addIssue } from 'valibot';

/**
 * Issue raised when the input is not a {@link ZonedDateTime} instance.
 */
export interface InternationalizedZonedDateTimeIssue extends BaseIssue<unknown> {
  kind: 'schema';
  type: 'internationalized_zoned_date_time';
  expected: '@internationalized/date.ZonedDateTime';
}

/**
 * Schema that accepts only {@link ZonedDateTime} instances.
 */
export interface InternationalizedZonedDateTimeSchema<
  TMessage extends ErrorMessage<InternationalizedZonedDateTimeIssue> | undefined,
> extends BaseSchema<ZonedDateTime, ZonedDateTime, InternationalizedZonedDateTimeIssue> {
  type: 'internationalized_zoned_date_time';
  reference: typeof internationalizedZonedDateTime;
  expects: '@internationalized/date.ZonedDateTime';
  message: TMessage;
}

/**
 * Creates a schema that validates {@link ZonedDateTime} instances. Any other value type
 * produces an {@link InternationalizedZonedDateTimeIssue}.
 *
 * @returns A schema representing {@link ZonedDateTime}.
 */
export function internationalizedZonedDateTime(): InternationalizedZonedDateTimeSchema<undefined>;

/**
 * Creates a schema that validates {@link ZonedDateTime} instances. Any other value type
 * produces an {@link InternationalizedZonedDateTimeIssue}.
 *
 * @param message The error message used when validation fails.
 *
 * @returns A schema representing {@link ZonedDateTime}.
 */
export function internationalizedZonedDateTime<
  const TMessage extends ErrorMessage<InternationalizedZonedDateTimeIssue> | undefined,
>(message: TMessage): InternationalizedZonedDateTimeSchema<TMessage>;

export function internationalizedZonedDateTime(
  message?: ErrorMessage<InternationalizedZonedDateTimeIssue>,
): InternationalizedZonedDateTimeSchema<ErrorMessage<InternationalizedZonedDateTimeIssue> | undefined> {
  return {
    kind: 'schema',
    type: 'internationalized_zoned_date_time',
    reference: internationalizedZonedDateTime,
    expects: '@internationalized/date.ZonedDateTime',
    async: false,
    message,
    get '~standard'() {
      return _getStandardProps(this);
    },
    '~run'(dataset, config) {
      if (dataset.value instanceof ZonedDateTime) {
        // @ts-expect-error We expect this here. As noted in valibot documentation this code is correct but simplifies the types
        dataset.typed = true;
      } else {
        _addIssue(this, 'type', dataset, config);
      }

      // @ts-expect-error We expect this here. As noted in valibot documentation this code is correct but simplifies the types
      // oxlint-disable-next-line typescript/no-unsafe-type-assertion typescript/no-unsafe-return
      return dataset as OutputDataset<ZonedDateTime, InternationalizedZonedDateTimeIssue>;
    },
  };
}
