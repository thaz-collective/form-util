import type { BaseIssue, ErrorMessage, BaseSchema, OutputDataset } from 'valibot';
import { Time } from '@internationalized/date';
import { _getStandardProps, _addIssue } from 'valibot';

/**
 * Issue raised when the input is not a {@link Time} instance.
 */
export interface InternationalizedTimeIssue extends BaseIssue<unknown> {
  kind: 'schema';
  type: 'internationalized_time';
  expected: '@internationalized/date.Time';
}

/**
 * Schema that accepts only {@link Time} instances.
 */
export interface InternationalizedTimeSchema<
  TMessage extends ErrorMessage<InternationalizedTimeIssue> | undefined,
> extends BaseSchema<Time, Time, InternationalizedTimeIssue> {
  type: 'internationalized_time';
  reference: typeof internationalizedTime;
  expects: '@internationalized/date.Time';
  message: TMessage;
}

/**
 * Creates a schema that validates {@link Time} instances. Any other value type
 * produces an {@link InternationalizedTimeIssue}.
 *
 * @returns A schema representing {@link Time}.
 */
export function internationalizedTime(): InternationalizedTimeSchema<undefined>;

/**
 * Creates a schema that validates {@link Time} instances. Any other value type
 * produces an {@link InternationalizedTimeIssue}.
 *
 * @param message The error message used when validation fails.
 *
 * @returns A schema representing {@link Time}.
 */
export function internationalizedTime<const TMessage extends ErrorMessage<InternationalizedTimeIssue> | undefined>(
  message: TMessage,
): InternationalizedTimeSchema<TMessage>;

export function internationalizedTime(
  message?: ErrorMessage<InternationalizedTimeIssue>,
): InternationalizedTimeSchema<ErrorMessage<InternationalizedTimeIssue> | undefined> {
  return {
    kind: 'schema',
    type: 'internationalized_time',
    reference: internationalizedTime,
    expects: '@internationalized/date.Time',
    async: false,
    message,
    get '~standard'() {
      return _getStandardProps(this);
    },
    '~run'(dataset, config) {
      if (dataset.value instanceof Time) {
        // @ts-expect-error We expect this here. As noted in valibot documentation this code is correct but simplifies the types
        dataset.typed = true;
      } else {
        _addIssue(this, 'type', dataset, config);
      }

      // @ts-expect-error We expect this here. As noted in valibot documentation this code is correct but simplifies the types
      // oxlint-disable-next-line typescript/no-unsafe-type-assertion typescript/no-unsafe-return
      return dataset as OutputDataset<Time, InternationalizedTimeIssue>;
    },
  };
}
