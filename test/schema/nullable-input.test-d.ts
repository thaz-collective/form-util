import { describe, expectTypeOf, test } from 'vite-plus/test';

import type { InferInput, InferOutput } from 'valibot';
import * as v from 'valibot';

import { nullableInput } from '#src/schema/nullable-input';

describe('nullableInput', () => {
  test('infers input as the wrapped schema input unioned with null and undefined', () => {
    const schema = nullableInput(v.string());

    expectTypeOf<InferInput<typeof schema>>().toEqualTypeOf<string | null | undefined>();
  });

  test('infers output as the wrapped schema output', () => {
    const schema = nullableInput(v.string());

    expectTypeOf<InferOutput<typeof schema>>().toEqualTypeOf<string>();
  });

  test('preserves a transformed wrapped schema output type', () => {
    const schema = nullableInput(
      v.pipe(
        v.number(),
        v.transform((value) => value.toString()),
      ),
    );

    expectTypeOf<InferInput<typeof schema>>().toEqualTypeOf<number | null | undefined>();
    expectTypeOf<InferOutput<typeof schema>>().toEqualTypeOf<string>();
  });

  test('infers types when the wrapped schema itself accepts and transforms null/undefined', () => {
    const schema = nullableInput(
      v.union([
        v.null(),
        v.pipe(
          v.undefined(),
          v.transform(() => null),
        ),
        v.pipe(v.number(), v.minValue(10)),
      ]),
    );

    expectTypeOf<InferInput<typeof schema>>().toEqualTypeOf<number | null | undefined>();
    expectTypeOf<InferOutput<typeof schema>>().toEqualTypeOf<number | null>();
  });
});
