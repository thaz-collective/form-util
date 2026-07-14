import * as t from '@thaz/temporal-util/valibot';

import { Temporal } from '@js-temporal/polyfill';
import * as v from 'valibot';

import type { FormWrongTypeMessage, FormRequiredMessage } from '#src/schema/types';
import { toPlainDateTime } from '#src/internationalized-date/actions/to-plain-date-time-value';
import { internationalizedCalendarDateTime } from '#src/internationalized-date/schema/internationalized-calendar-date-time';
import { internationalizedZonedDateTime } from '#src/internationalized-date/schema/internationalized-zoned-date-time';
import { isFormRequiredMessage } from '#src/schema/types';

/**
 * The plain date time action for forms
 */
export type PlainDateTimeAction = v.BaseValidation<
  Temporal.PlainDateTime,
  Temporal.PlainDateTime,
  v.BaseIssue<unknown>
>;

/**
 * Builds the nullable variant of the plain date time schema. Successful output type is `Temporal.PlainDateTime` | `null`.
 *
 * Accepts/Transforms the following as input: `null` / `undefined` / `Temporal.PlainDateTime` /
 * `Temporal.ZonedDateTime` (via `.toPlainDateTime()`) / `@internationalized/date` `ZonedDateTime`
 * (via string round-trip and `.toPlainDateTime()`) / `@internationalized/date` `CalendarDateTime`
 * (via string round-trip)
 *
 * @param messages - {@link FormWrongTypeMessage} providing the wrong-type error text.
 * @param actions - Additional valibot actions applied to the `Temporal.PlainDateTime` value.
 *
 * @returns A valibot validation schema that outputs `Temporal.PlainDateTime` | `null`.
 */
export function _plainDateTimeNullable(messages: FormWrongTypeMessage, ...actions: PlainDateTimeAction[]) {
  return v.union(
    [
      v.null(messages.wrongTypeMessage),
      v.pipe(
        v.undefined(messages.wrongTypeMessage),
        v.transform(() => null),
      ),
      v.pipe(t.plainDateTime(messages.wrongTypeMessage), ...actions),
      v.pipe(
        t.zonedDateTime(messages.wrongTypeMessage),
        t.toPlainDateTime(messages.wrongTypeMessage),
        v.pipe(t.plainDateTime(messages.wrongTypeMessage), ...actions),
      ),
      v.pipe(
        internationalizedZonedDateTime(messages.wrongTypeMessage),
        toPlainDateTime(messages.wrongTypeMessage),
        v.pipe(t.plainDateTime(messages.wrongTypeMessage), ...actions),
      ),
      v.pipe(
        internationalizedCalendarDateTime(messages.wrongTypeMessage),
        toPlainDateTime(messages.wrongTypeMessage),
        v.pipe(t.plainDateTime(messages.wrongTypeMessage), ...actions),
      ),
    ],
    messages.wrongTypeMessage,
  );
}

/**
 * Builds the required variant of the plain date time schema. Successful out type is `Temporal.PlainDateTime`.
 *
 * Accepts/Transforms the following as input: `null` / `undefined` / `Temporal.PlainDateTime` /
 * `Temporal.ZonedDateTime` (via `.toPlainDateTime()`) / `@internationalized/date` `ZonedDateTime`
 * (via string round-trip and `.toPlainDateTime()`) / `@internationalized/date` `CalendarDateTime`
 * (via string round-trip)
 *
 * @param messages - {@link FormRequiredMessage} providing both wrong-type and required error text.
 * @param actions - Additional valibot actions applied to the `Temporal.PlainDateTime` value.
 *
 * @returns A valibot validation schema that outputs `Temporal.PlainDateTime`.
 */
export function _plainDateTimeRequired(messages: FormRequiredMessage, ...actions: PlainDateTimeAction[]) {
  return v.pipe(_plainDateTimeNullable(messages), v.pipe(t.plainDateTime(messages.requiredMessage), ...actions));
}

/**
 * Plain date time validation schema. Will use the required variant {@link _plainDateTimeRequired} when users passes
 * in {@link FormRequiredMessage}. Uses the nullable variant {@link _plainDateTimeNullable} when user otherwise passes
 * in {@link FormWrongTypeMessage}.
 *
 * Accepts/Transforms the following as input: `null` / `undefined` / `Temporal.PlainDateTime` /
 * `Temporal.ZonedDateTime` (via `.toPlainDateTime()`) / `@internationalized/date` `ZonedDateTime`
 * (via string round-trip and `.toPlainDateTime()`) / `@internationalized/date` `CalendarDateTime`
 * (via string round-trip)
 *
 * @param messages - {@link FormWrongTypeMessage} | {@link FormRequiredMessage} providing the wrong-type error text.
 * @param actions - Additional valibot actions applied to the `Temporal.PlainDateTime` value.
 *
 * @returns A valibot validation schema that outputs `Temporal.PlainDateTime` or `Temporal.PlainDateTime` | `null` based on message type.
 */
export function plainDateTime<T extends FormWrongTypeMessage | FormRequiredMessage>(
  messages: T,
  ...actions: PlainDateTimeAction[]
): T extends FormRequiredMessage
  ? ReturnType<typeof _plainDateTimeRequired>
  : ReturnType<typeof _plainDateTimeNullable>;

export function plainDateTime(messages: FormWrongTypeMessage | FormRequiredMessage, ...actions: PlainDateTimeAction[]) {
  if (isFormRequiredMessage(messages)) {
    return _plainDateTimeRequired(messages, ...actions);
  }

  return _plainDateTimeNullable(messages, ...actions);
}
