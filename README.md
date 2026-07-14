# [@thaz/form-util](https://github.com/thaz-collective/form-util)

Form validation utilities for applications and libraries in the thaz-collective namespace. Provides a set of
[Valibot](https://valibot.dev/) schemas built for form input: they coerce raw, string, and
[`@internationalized/date`](https://react-spectrum.adobe.com/internationalized/date/index.html) values into
[`Temporal`](https://tc39.es/proposal-temporal/docs/) values (via [`@thaz/temporal-util`](https://github.com/thaz-collective/temporal-util)),
normalize blank/`undefined` input to `null`, and let a single call site opt into "required" behavior with its own
error message.

---

## Installation

```bash
vp add @thaz/form-util @internationalized/date @js-temporal/polyfill @thaz/temporal-util valibot
```

---

## Message contract

Every schema builder in this package is overloaded on the shape of the `messages` argument you pass it:

| Type                   | Shape                                                   | Effect                                                                                         |
| ---------------------- | ------------------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| `FormWrongTypeMessage` | `{ wrongTypeMessage: string }`                          | Builds the **nullable** variant - blank/`undefined`/`null` input succeeds as `null`.           |
| `FormRequiredMessage`  | `{ wrongTypeMessage: string; requiredMessage: string }` | Builds the **required** variant - blank/`undefined`/`null` input fails with `requiredMessage`. |

`isFormRequiredMessage(messages)` is the type guard each schema builder uses internally to pick a variant (it narrows
to `FormRequiredMessage` when `requiredMessage` is present) - it's exported in case you want the same branching in
your own code.

```ts
import * as f from '@thaz/form-util';

// nullable: succeeds with `null` for blank input
f.string({ wrongTypeMessage: 'Must be a string' });

// required: fails for blank input
f.string({ wrongTypeMessage: 'Must be a string', requiredMessage: 'This field is required' });
```

Each builder also accepts any number of trailing Valibot actions (e.g. `v.minLength(3)`, `t.temporalMinValue(...)`),
applied after the value has been coerced to its final type.

---

## Primitive schemas

```ts
import * as v from 'valibot';
import * as f from '@thaz/form-util';

const nameSchema = f.string(
  { wrongTypeMessage: 'Must be a string', requiredMessage: 'Name is required' },
  v.minLength(1),
);
const ageSchema = f.number({ wrongTypeMessage: 'Must be a number' }, v.minValue(0));

v.parse(nameSchema, '  Ada  '); // -> "Ada" (trimmed)
v.parse(ageSchema, undefined); // -> null
```

| Schema        | Output             | Accepts/transforms                                                             |
| ------------- | ------------------ | ------------------------------------------------------------------------------ |
| `string(...)` | `string` or `null` | `null`, `undefined`, `string` - trimmed; blank/whitespace-only becomes `null`. |
| `number(...)` | `number` or `null` | `null`, `undefined`, `number` - `NaN`/`Infinity` rejected via `v.finite()`.    |

---

## Temporal schemas

Each of these accepts the matching `Temporal` type directly, related `Temporal` types it can be derived from, and the
equivalent `@internationalized/date` type (useful for date picker components built on that library) - all converted
through [`@thaz/temporal-util`](https://github.com/thaz-collective/temporal-util) so the same comparison/clamp actions
from that package work as trailing actions here.

```ts
import { Temporal } from '@js-temporal/polyfill';
import * as t from '@thaz/temporal-util/valibot';
import * as v from 'valibot';
import * as f from '@thaz/form-util';

const startDateSchema = f.plainDate(
  { wrongTypeMessage: 'Must be a date', requiredMessage: 'Start date is required' },
  t.temporalMinValue(Temporal.PlainDate.from('2024-01-01')),
);

v.parse(startDateSchema, Temporal.PlainDate.from('2024-06-01')); // Temporal.PlainDate
```

| Schema               | Output                             | Accepts/transforms                                                                                                                                                           |
| -------------------- | ---------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `zonedDateTime(...)` | `Temporal.ZonedDateTime` or `null` | `Temporal.ZonedDateTime` / `@internationalized/date` `ZonedDateTime` (via string round-trip)                                                                                 |
| `instant(...)`       | `Temporal.Instant` or `null`       | `Temporal.Instant` / `Temporal.ZonedDateTime` / `@internationalized/date` `ZonedDateTime`                                                                                    |
| `plainDateTime(...)` | `Temporal.PlainDateTime` or `null` | `Temporal.PlainDateTime` / `Temporal.ZonedDateTime` (`.toPlainDateTime()`) / `@internationalized/date` `ZonedDateTime`, `CalendarDateTime`                                   |
| `plainDate(...)`     | `Temporal.PlainDate` or `null`     | `Temporal.PlainDate` / `Temporal.ZonedDateTime`, `Temporal.PlainDateTime` (`.toPlainDate()`) / `@internationalized/date` `ZonedDateTime`, `CalendarDateTime`, `CalendarDate` |
| `plainTime(...)`     | `Temporal.PlainTime` or `null`     | `Temporal.PlainTime` / `Temporal.ZonedDateTime`, `Temporal.PlainDateTime` (`.toPlainTime()`) / `@internationalized/date` `ZonedDateTime`, `CalendarDateTime`, `Time`         |

All five also accept `null` and `undefined` as input (mapped to `null` in the nullable variant, or rejected with
`requiredMessage` in the required variant).

---

## `when`

Selects between two non-transforming pipe actions based on a runtime condition, for validations that only apply
under certain form state (e.g. a field that's only required when a sibling checkbox is checked).

```ts
import * as v from 'valibot';
import * as f from '@thaz/form-util';

function buildQuantitySchema(hasMinimumOrder: boolean) {
  return v.pipe(v.number(), f.when(hasMinimumOrder, v.minValue(10), v.minValue(1)));
}

v.parse(buildQuantitySchema(true), 5); // throws - below the minimum order quantity
v.parse(buildQuantitySchema(false), 5); // 5
```

`when` only accepts actions that validate without changing the value's type (`v.GenericPipeAction<TInput, TInput>`) -
it can't be used to select between two transformations.

---

## References

- [Temporal proposal](https://tc39.es/proposal-temporal/docs/) - the `Temporal` API these schemas normalize input into
- [`@js-temporal/polyfill`](https://www.npmjs.com/package/@js-temporal/polyfill) - the polyfill this package targets
- [`@internationalized/date`](https://react-spectrum.adobe.com/internationalized/date/index.html) - the date/time types accepted alongside `Temporal`
- [`@thaz/temporal-util`](https://github.com/thaz-collective/temporal-util) - `Temporal` schemas and comparison actions this package builds on
- [Valibot](https://valibot.dev/) - the schema library these schemas and actions extend
