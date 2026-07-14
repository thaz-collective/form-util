import * as t from '@thaz/temporal-util/valibot';

import { Temporal } from '@js-temporal/polyfill';
import * as v from 'valibot';

import type { FormWrongTypeMessage, FormRequiredMessage } from '#src/schema/types';
import { toPlainDate } from '#src/internationalized-date/actions/to-plain-date-value';
import { internationalizedCalendarDate } from '#src/internationalized-date/schema/internationalized-calendar-date';
import { internationalizedCalendarDateTime } from '#src/internationalized-date/schema/internationalized-calendar-date-time';
import { internationalizedZonedDateTime } from '#src/internationalized-date/schema/internationalized-zoned-date-time';
import { isFormRequiredMessage } from '#src/schema/types';

/**
 * The plain date action for forms
 */
export type PlainDateAction = v.BaseValidation<Temporal.PlainDate, Temporal.PlainDate, v.BaseIssue<unknown>>;

/**
 * Builds the nullable variant of the plain date schema. Successful output type is `Temporal.PlainDate` | `null`.
 *
 * Accepts/Transforms the following as input: `null` / `undefined` / `Temporal.PlainDate` /
 * `Temporal.ZonedDateTime` (via `.toPlainDate()`) / `Temporal.PlainDateTime` (via `.toPlainDate()`) /
 * `@internationalized/date` `ZonedDateTime` (via string round-trip and `.toPlainDate()`) /
 * `@internationalized/date` `CalendarDateTime` (via string round-trip and `.toPlainDate()`) /
 * `@internationalized/date` `CalendarDate` (via string round-trip)
 *
 * @param messages - {@link FormWrongTypeMessage} providing the wrong-type error text.
 * @param actions - Additional valibot actions applied to the `Temporal.PlainDate` value.
 *
 * @returns A valibot validation schema that outputs `Temporal.PlainDate` | `null`.
 */
export function _plainDateNullable(messages: FormWrongTypeMessage, ...actions: PlainDateAction[]) {
  return v.union(
    [
      v.null(messages.wrongTypeMessage),
      v.pipe(
        v.undefined(messages.wrongTypeMessage),
        v.transform(() => null),
      ),
      v.pipe(t.plainDate(messages.wrongTypeMessage), ...actions),
      v.pipe(
        t.zonedDateTime(messages.wrongTypeMessage),
        t.toPlainDate(messages.wrongTypeMessage),
        v.pipe(t.plainDate(messages.wrongTypeMessage), ...actions),
      ),
      v.pipe(
        t.plainDateTime(messages.wrongTypeMessage),
        t.toPlainDate(messages.wrongTypeMessage),
        v.pipe(t.plainDate(messages.wrongTypeMessage), ...actions),
      ),
      v.pipe(
        internationalizedZonedDateTime(messages.wrongTypeMessage),
        toPlainDate(messages.wrongTypeMessage),
        v.pipe(t.plainDate(messages.wrongTypeMessage), ...actions),
      ),
      v.pipe(
        internationalizedCalendarDateTime(messages.wrongTypeMessage),
        toPlainDate(messages.wrongTypeMessage),
        v.pipe(t.plainDate(messages.wrongTypeMessage), ...actions),
      ),
      v.pipe(
        internationalizedCalendarDate(messages.wrongTypeMessage),
        toPlainDate(messages.wrongTypeMessage),
        v.pipe(t.plainDate(messages.wrongTypeMessage), ...actions),
      ),
    ],
    messages.wrongTypeMessage,
  );
}

/**
 * Builds the required variant of the plain date schema. Successful out type is `Temporal.PlainDate`.
 *
 * Accepts/Transforms the following as input: `null` / `undefined` / `Temporal.PlainDate` /
 * `Temporal.ZonedDateTime` (via `.toPlainDate()`) / `Temporal.PlainDateTime` (via `.toPlainDate()`) /
 * `@internationalized/date` `ZonedDateTime` (via string round-trip and `.toPlainDate()`) /
 * `@internationalized/date` `CalendarDateTime` (via string round-trip and `.toPlainDate()`) /
 * `@internationalized/date` `CalendarDate` (via string round-trip)
 *
 * @param messages - {@link FormRequiredMessage} providing both wrong-type and required error text.
 * @param actions - Additional valibot actions applied to the `Temporal.PlainDate` value.
 *
 * @returns A valibot validation schema that outputs `Temporal.PlainDate`.
 */
export function _plainDateRequired(messages: FormRequiredMessage, ...actions: PlainDateAction[]) {
  return v.pipe(_plainDateNullable(messages), v.pipe(t.plainDate(messages.requiredMessage), ...actions));
}

/**
 * Plain date validation schema. Will use the required variant {@link _plainDateRequired} when users passes
 * in {@link FormRequiredMessage}. Uses the nullable variant {@link _plainDateNullable} when user otherwise passes
 * in {@link FormWrongTypeMessage}.
 *
 * Accepts/Transforms the following as input: `null` / `undefined` / `Temporal.PlainDate` /
 * `Temporal.ZonedDateTime` (via `.toPlainDate()`) / `Temporal.PlainDateTime` (via `.toPlainDate()`) /
 * `@internationalized/date` `ZonedDateTime` (via string round-trip and `.toPlainDate()`) /
 * `@internationalized/date` `CalendarDateTime` (via string round-trip and `.toPlainDate()`) /
 * `@internationalized/date` `CalendarDate` (via string round-trip)
 *
 * @param messages - {@link FormWrongTypeMessage} | {@link FormRequiredMessage} providing the wrong-type error text.
 * @param actions - Additional valibot actions applied to the `Temporal.PlainDate` value.
 *
 * @returns A valibot validation schema that outputs `Temporal.PlainDate` or `Temporal.PlainDate` | `null` based on message type.
 */
export function plainDate<T extends FormWrongTypeMessage | FormRequiredMessage>(
  messages: T,
  ...actions: PlainDateAction[]
): T extends FormRequiredMessage ? ReturnType<typeof _plainDateRequired> : ReturnType<typeof _plainDateNullable>;

export function plainDate(messages: FormWrongTypeMessage | FormRequiredMessage, ...actions: PlainDateAction[]) {
  if (isFormRequiredMessage(messages)) {
    return _plainDateRequired(messages, ...actions);
  }

  return _plainDateNullable(messages, ...actions);
}
