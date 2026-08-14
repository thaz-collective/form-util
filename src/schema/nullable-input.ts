import * as v from 'valibot';

export function nullableInput<TSchema extends v.GenericSchema>(schema: TSchema) {
  return v.pipe(v.union([v.undefined(), v.null(), schema]), schema);
}
