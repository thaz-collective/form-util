import type { CalendarDateTime } from '@internationalized/date';
import type { InferInput, InferIssue, InferOutput } from 'valibot';
import { describe, expectTypeOf, test } from 'vite-plus/test';

import type {
  InternationalizedCalendarDateTimeIssue,
  InternationalizedCalendarDateTimeSchema,
} from '#src/internationalized-date/schema/internationalized-calendar-date-time';
import { internationalizedCalendarDateTime } from '#src/internationalized-date/schema/internationalized-calendar-date-time';

describe('internationalizedCalendarDateTime', () => {
  describe('should return schema object', () => {
    test('with undefined message', () => {
      type Schema = InternationalizedCalendarDateTimeSchema<undefined>;
      expectTypeOf(internationalizedCalendarDateTime()).toEqualTypeOf<Schema>();
      expectTypeOf(internationalizedCalendarDateTime(undefined)).toEqualTypeOf<Schema>();
    });

    test('with string message', () => {
      expectTypeOf(internationalizedCalendarDateTime('message')).toEqualTypeOf<
        InternationalizedCalendarDateTimeSchema<'message'>
      >();
    });

    test('with function message', () => {
      expectTypeOf(internationalizedCalendarDateTime(() => 'message')).toEqualTypeOf<
        InternationalizedCalendarDateTimeSchema<() => string>
      >();
    });
  });

  describe('should infer correct types', () => {
    type Schema = InternationalizedCalendarDateTimeSchema<undefined>;

    test('of input', () => {
      expectTypeOf<InferInput<Schema>>().toEqualTypeOf<CalendarDateTime>();
    });

    test('of output', () => {
      expectTypeOf<InferOutput<Schema>>().toEqualTypeOf<CalendarDateTime>();
    });

    test('of issue', () => {
      expectTypeOf<InferIssue<Schema>>().toEqualTypeOf<InternationalizedCalendarDateTimeIssue>();
    });
  });
});
