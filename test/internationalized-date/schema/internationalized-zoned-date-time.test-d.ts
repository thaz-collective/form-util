import { describe, expectTypeOf, test } from 'vite-plus/test';

import type { ZonedDateTime } from '@internationalized/date';
import type { InferInput, InferIssue, InferOutput } from 'valibot';

import type {
  InternationalizedZonedDateTimeIssue,
  InternationalizedZonedDateTimeSchema,
} from '#src/internationalized-date/schema/internationalized-zoned-date-time';
import { internationalizedZonedDateTime } from '#src/internationalized-date/schema/internationalized-zoned-date-time';

describe('internationalizedZonedDateTime', () => {
  describe('should return schema object', () => {
    test('with undefined message', () => {
      type Schema = InternationalizedZonedDateTimeSchema<undefined>;
      expectTypeOf(internationalizedZonedDateTime()).toEqualTypeOf<Schema>();
      expectTypeOf(internationalizedZonedDateTime(undefined)).toEqualTypeOf<Schema>();
    });

    test('with string message', () => {
      expectTypeOf(internationalizedZonedDateTime('message')).toEqualTypeOf<
        InternationalizedZonedDateTimeSchema<'message'>
      >();
    });

    test('with function message', () => {
      expectTypeOf(internationalizedZonedDateTime(() => 'message')).toEqualTypeOf<
        InternationalizedZonedDateTimeSchema<() => string>
      >();
    });
  });

  describe('should infer correct types', () => {
    type Schema = InternationalizedZonedDateTimeSchema<undefined>;

    test('of input', () => {
      expectTypeOf<InferInput<Schema>>().toEqualTypeOf<ZonedDateTime>();
    });

    test('of output', () => {
      expectTypeOf<InferOutput<Schema>>().toEqualTypeOf<ZonedDateTime>();
    });

    test('of issue', () => {
      expectTypeOf<InferIssue<Schema>>().toEqualTypeOf<InternationalizedZonedDateTimeIssue>();
    });
  });
});
