import type { Time } from '@internationalized/date';
import type { InferInput, InferIssue, InferOutput } from 'valibot';
import { describe, expectTypeOf, test } from 'vite-plus/test';

import type {
  InternationalizedTimeIssue,
  InternationalizedTimeSchema,
} from '#src/valibot/internationalized-date/schema/internationalized-time';
import { internationalizedTime } from '#src/valibot/internationalized-date/schema/internationalized-time';

describe('internationalizedTime', () => {
  describe('should return schema object', () => {
    test('with undefined message', () => {
      type Schema = InternationalizedTimeSchema<undefined>;
      expectTypeOf(internationalizedTime()).toEqualTypeOf<Schema>();
      expectTypeOf(internationalizedTime(undefined)).toEqualTypeOf<Schema>();
    });

    test('with string message', () => {
      expectTypeOf(internationalizedTime('message')).toEqualTypeOf<InternationalizedTimeSchema<'message'>>();
    });

    test('with function message', () => {
      expectTypeOf(internationalizedTime(() => 'message')).toEqualTypeOf<InternationalizedTimeSchema<() => string>>();
    });
  });

  describe('should infer correct types', () => {
    type Schema = InternationalizedTimeSchema<undefined>;

    test('of input', () => {
      expectTypeOf<InferInput<Schema>>().toEqualTypeOf<Time>();
    });

    test('of output', () => {
      expectTypeOf<InferOutput<Schema>>().toEqualTypeOf<Time>();
    });

    test('of issue', () => {
      expectTypeOf<InferIssue<Schema>>().toEqualTypeOf<InternationalizedTimeIssue>();
    });
  });
});
