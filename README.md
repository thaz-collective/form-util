# [@thaz/form-util](https://github.com/thaz-collective/form-util)

Form validation utilities for applications and libraries in the thaz-collective namespace. Provides a set of
[Valibot](https://valibot.dev/) schemas built for standard form input. Allows for a wider range of input types and
then validates towards the preferred output type. Handles type coercion for various types under the hood.

To support this library, we use the [`Temporal`](https://tc39.es/proposal-temporal/docs/) polyfill and existing
utilities (via [`@thaz/temporal-util`](https://github.com/thaz-collective/temporal-util)). These allow us to coerce
date-like types appropriately.

Currently, we also use [`@internationalized/date`](https://react-spectrum.adobe.com/internationalized/date/index.html).
This is for compatibility with React-Aria, the component library of choice in the thaz-collective ecosystem.
This allows us to pass in our desired `Temporal` types and do internal transformations to `@internationalized/date`
until `Temporal` can be used safely in all browsers and is supported by React-Aria.

---

## Installation

```bash
vp add valibot @js-temporal/polyfill @thaz/temporal-util @internationalized/date @thaz/form-util
```

---

## Message contract

Every schema builder in this package is overloaded on the shape of the `messages` argument you pass it:

| Type                   | Shape                                                   | Effect                                                                                          |
| ---------------------- | ------------------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| `FormWrongTypeMessage` | `{ wrongTypeMessage: string }`                          | Builds the **nullable** variant - `undefined`/`null` input is allowed and normalized to `null`. |
| `FormRequiredMessage`  | `{ wrongTypeMessage: string; requiredMessage: string }` | Builds the **required** variant - `undefined`/`null` input fails with `requiredMessage`.        |

`isFormRequiredMessage(messages)` is the type guard each schema builder uses internally to pick a variant (it narrows
to `FormRequiredMessage` when `requiredMessage` is present) - it's exported in case you want the same branching in
your own code.

```ts
import * as v from 'valibot';
import * as f from '@thaz/form-util';

// nullable: succeeds with `null` for blank input
f.string({ wrongTypeMessage: 'Must be a string' });

// required: fails for blank input
f.string({ wrongTypeMessage: 'Must be a string', requiredMessage: 'This field is required' });

// additional validation is available to the final output type on each schema builder
f.string(
  { wrongTypeMessage: 'Must be a string', requiredMessage: 'This field is required' },
  v.minLength(3),
  v.maxLength(20),
);
```

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

| Schema        | Accepts/transforms            | Output   | Notes                                                                        |
| ------------- | ----------------------------- | -------- | ---------------------------------------------------------------------------- |
| `string(...)` | `null`, `undefined`, `string` | `string` | Output is automatically trimmed; blank/whitespace-only input becomes `null`. |
| `number(...)` | `null`, `undefined`, `number` | `number` |                                                                              |

---

## Temporal schemas

Each of these accepts the matching `Temporal` type directly or related `Temporal` types that the output can be derived
from. It can also accept types from `@internationalized/date` although these should likely be internal to
the component and not passed directly to the schema. Supports additional validations provided
by [`@thaz/temporal-util`](https://github.com/thaz-collective/temporal-util).

```ts
import { Temporal } from '@js-temporal/polyfill';
import * as t from '@thaz/temporal-util/valibot';
import * as v from 'valibot';
import * as f from '@thaz/form-util';

const startDateSchema = f.plainDate(
  { wrongTypeMessage: 'Must be a date', requiredMessage: 'Start date is required' },
  t.temporalMinValue(Temporal.PlainDate.from('2024-01-01')),
  t.temporalMaxValue(Temporal.PlainDate.from('2025-01-01')),
);

v.parse(startDateSchema, Temporal.PlainDate.from('2024-06-01'));
```

| Schema               | Accepts/transforms                                                                                                                                                                                               | Output                   |
| -------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------ |
| `zonedDateTime(...)` | `Temporal.ZonedDateTime` / `@internationalized/date` `ZonedDateTime`                                                                                                                                             | `Temporal.ZonedDateTime` |
| `instant(...)`       | `Temporal.ZonedDateTime` / `Temporal.Instant` / `@internationalized/date` `ZonedDateTime`                                                                                                                        | `Temporal.Instant`       |
| `plainDateTime(...)` | `Temporal.ZonedDateTime` / `Temporal.PlainDateTime` / `@internationalized/date` `ZonedDateTime` / `@internationalized/date` `CalendarDateTime`                                                                   | `Temporal.PlainDateTime` |
| `plainDate(...)`     | `Temporal.ZonedDateTime` / `Temporal.PlainDateTime` / `Temporal.PlainDate` / `@internationalized/date` `ZonedDateTime` / `@internationalized/date` `CalendarDateTime` / `@internationalized/date` `CalendarDate` | `Temporal.PlainDate`     |
| `plainTime(...)`     | `Temporal.ZonedDateTime` / `Temporal.PlainDateTime` / `Temporal.PlainTime` / `@internationalized/date` `ZonedDateTime` / `@internationalized/date` `CalendarDateTime` / `@internationalized/date` `Time`         | `Temporal.PlainTime`     |

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

`when` only accepts actions that validate without changing the value's type (`v.GenericPipeAction<TInput, TInput>`).
It cannot be used to select between two transformations.

---

## References

- [Valibot](https://valibot.dev/) - the schema library these schemas and actions extend
- [Temporal proposal](https://tc39.es/proposal-temporal/docs/) - the `Temporal` API these schemas normalize input into
- [`@js-temporal/polyfill`](https://www.npmjs.com/package/@js-temporal/polyfill) - the polyfill this package targets
- [`@thaz/temporal-util`](https://github.com/thaz-collective/temporal-util) - `Temporal` schemas and comparison actions this package builds on
- [`@internationalized/date`](https://react-spectrum.adobe.com/internationalized/date/index.html) - the date/time types accepted alongside `Temporal`
