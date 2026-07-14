import * as t from '@thaz/temporal-util/valibot';

import { Temporal } from '@js-temporal/polyfill';
import * as v from 'valibot';

import type { FormWrongTypeMessage, FormRequiredMessage } from '#src/schema/types';
import { toPlainTime } from '#src/internationalized-date/actions/to-plain-time-value';
import { internationalizedCalendarDateTime } from '#src/internationalized-date/schema/internationalized-calendar-date-time';
import { internationalizedTime } from '#src/internationalized-date/schema/internationalized-time';
import { internationalizedZonedDateTime } from '#src/internationalized-date/schema/internationalized-zoned-date-time';
import { isFormRequiredMessage } from '#src/schema/types';

/**
 * The plain time action for forms
 */
export type PlainTimeAction = v.BaseValidation<Temporal.PlainTime, Temporal.PlainTime, v.BaseIssue<unknown>>;

/**
 * Builds the nullable variant of the plain time schema. Successful output type is `Temporal.PlainTime` | `null`.
 *
 * Accepts/Transforms the following as input: `null` / `undefined` / `Temporal.PlainTime` /
 * `Temporal.ZonedDateTime` (via `.toPlainTime()`) / `Temporal.PlainDateTime` (via `.toPlainTime()`) /
 * `@internationalized/date` `ZonedDateTime` (via string round-trip and `.toPlainTime()`) /
 * `@internationalized/date` `CalendarDateTime` (via string round-trip and `.toPlainTime()`) /
 * `@internationalized/date` `Time` (via string round-trip)
 *
 * @param messages - {@link FormWrongTypeMessage} providing the wrong-type error text.
 * @param actions - Additional valibot actions applied to the `Temporal.PlainTime` value.
 *
 * @returns A valibot validation schema that outputs `Temporal.PlainTime` | `null`.
 */
export function _plainTimeNullable(messages: FormWrongTypeMessage, ...actions: PlainTimeAction[]) {
  return v.union(
    [
      v.null(messages.wrongTypeMessage),
      v.pipe(
        v.undefined(messages.wrongTypeMessage),
        v.transform(() => null),
      ),
      v.pipe(t.plainTime(messages.wrongTypeMessage), ...actions),
      v.pipe(
        t.zonedDateTime(messages.wrongTypeMessage),
        t.toPlainTime(messages.wrongTypeMessage),
        v.pipe(t.plainTime(messages.wrongTypeMessage), ...actions),
      ),
      v.pipe(
        t.plainDateTime(messages.wrongTypeMessage),
        t.toPlainTime(messages.wrongTypeMessage),
        v.pipe(t.plainTime(messages.wrongTypeMessage), ...actions),
      ),
      v.pipe(
        internationalizedZonedDateTime(messages.wrongTypeMessage),
        toPlainTime(messages.wrongTypeMessage),
        v.pipe(t.plainTime(messages.wrongTypeMessage), ...actions),
      ),
      v.pipe(
        internationalizedCalendarDateTime(messages.wrongTypeMessage),
        toPlainTime(messages.wrongTypeMessage),
        v.pipe(t.plainTime(messages.wrongTypeMessage), ...actions),
      ),
      v.pipe(
        internationalizedTime(messages.wrongTypeMessage),
        toPlainTime(messages.wrongTypeMessage),
        v.pipe(t.plainTime(messages.wrongTypeMessage), ...actions),
      ),
    ],
    messages.wrongTypeMessage,
  );
}

/**
 * Builds the required variant of the plain time schema. Successful out type is `Temporal.PlainTime`.
 *
 * Accepts/Transforms the following as input: `null` / `undefined` / `Temporal.PlainTime` /
 * `Temporal.ZonedDateTime` (via `.toPlainTime()`) / `Temporal.PlainDateTime` (via `.toPlainTime()`) /
 * `@internationalized/date` `ZonedDateTime` (via string round-trip and `.toPlainTime()`) /
 * `@internationalized/date` `CalendarDateTime` (via string round-trip and `.toPlainTime()`) /
 * `@internationalized/date` `Time` (via string round-trip)
 *
 * @param messages - {@link FormRequiredMessage} providing both wrong-type and required error text.
 * @param actions - Additional valibot actions applied to the `Temporal.PlainTime` value.
 *
 * @returns A valibot validation schema that outputs `Temporal.PlainTime`.
 */
export function _plainTimeRequired(messages: FormRequiredMessage, ...actions: PlainTimeAction[]) {
  return v.pipe(_plainTimeNullable(messages), v.pipe(t.plainTime(messages.requiredMessage), ...actions));
}

/**
 * Plain time validation schema. Will use the required variant {@link _plainTimeRequired} when users passes
 * in {@link FormRequiredMessage}. Uses the nullable variant {@link _plainTimeNullable} when user otherwise passes
 * in {@link FormWrongTypeMessage}.
 *
 * Accepts/Transforms the following as input: `null` / `undefined` / `Temporal.PlainTime` /
 * `Temporal.ZonedDateTime` (via `.toPlainTime()`) / `Temporal.PlainDateTime` (via `.toPlainTime()`) /
 * `@internationalized/date` `ZonedDateTime` (via string round-trip and `.toPlainTime()`) /
 * `@internationalized/date` `CalendarDateTime` (via string round-trip and `.toPlainTime()`) /
 * `@internationalized/date` `Time` (via string round-trip)
 *
 * @param messages - {@link FormWrongTypeMessage} | {@link FormRequiredMessage} providing the wrong-type error text.
 * @param actions - Additional valibot actions applied to the `Temporal.PlainTime` value.
 *
 * @returns A valibot validation schema that outputs `Temporal.PlainTime` or `Temporal.PlainTime` | `null` based on message type.
 */
export function plainTime<T extends FormWrongTypeMessage | FormRequiredMessage>(
  messages: T,
  ...actions: PlainTimeAction[]
): T extends FormRequiredMessage ? ReturnType<typeof _plainTimeRequired> : ReturnType<typeof _plainTimeNullable>;

export function plainTime(messages: FormWrongTypeMessage | FormRequiredMessage, ...actions: PlainTimeAction[]) {
  if (isFormRequiredMessage(messages)) {
    return _plainTimeRequired(messages, ...actions);
  }

  return _plainTimeNullable(messages, ...actions);
}
