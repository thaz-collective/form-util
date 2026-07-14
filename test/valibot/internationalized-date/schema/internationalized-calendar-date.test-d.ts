import type { CalendarDate } from '@internationalized/date';
import type { InferInput, InferIssue, InferOutput } from 'valibot';
import { describe, expectTypeOf, test } from 'vite-plus/test';

import type {
  InternationalizedCalendarDateIssue,
  InternationalizedCalendarDateSchema,
} from '#src/valibot/internationalized-date/schema/internationalized-calendar-date';
import { internationalizedCalendarDate } from '#src/valibot/internationalized-date/schema/internationalized-calendar-date';

describe('internationalizedCalendarDate', () => {
  describe('should return schema object', () => {
    test('with undefined message', () => {
      type Schema = InternationalizedCalendarDateSchema<undefined>;
      expectTypeOf(internationalizedCalendarDate()).toEqualTypeOf<Schema>();
      expectTypeOf(internationalizedCalendarDate(undefined)).toEqualTypeOf<Schema>();
    });

    test('with string message', () => {
      expectTypeOf(internationalizedCalendarDate('message')).toEqualTypeOf<
        InternationalizedCalendarDateSchema<'message'>
      >();
    });

    test('with function message', () => {
      expectTypeOf(internationalizedCalendarDate(() => 'message')).toEqualTypeOf<
        InternationalizedCalendarDateSchema<() => string>
      >();
    });
  });

  describe('should infer correct types', () => {
    type Schema = InternationalizedCalendarDateSchema<undefined>;

    test('of input', () => {
      expectTypeOf<InferInput<Schema>>().toEqualTypeOf<CalendarDate>();
    });

    test('of output', () => {
      expectTypeOf<InferOutput<Schema>>().toEqualTypeOf<CalendarDate>();
    });

    test('of issue', () => {
      expectTypeOf<InferIssue<Schema>>().toEqualTypeOf<InternationalizedCalendarDateIssue>();
    });
  });
});
