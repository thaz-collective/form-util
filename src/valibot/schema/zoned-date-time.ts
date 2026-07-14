import * as t from '@thaz/temporal-util/valibot';

import { Temporal } from '@js-temporal/polyfill';
import * as v from 'valibot';

import type { FormWrongTypeMessage, FormRequiredMessage } from '#src/valibot/schema/types';
import { toZonedDateTime } from '#src/valibot/internationalized-date/actions/to-zoned-date-time-value';
import { internationalizedZonedDateTime } from '#src/valibot/internationalized-date/schema/internationalized-zoned-date-time';
import { isFormRequiredMessage } from '#src/valibot/schema/types';

/**
 * The zoned date time action for forms
 */
export type ZonedDateTimeAction = v.BaseValidation<
  Temporal.ZonedDateTime,
  Temporal.ZonedDateTime,
  v.BaseIssue<unknown>
>;

/**
 * Builds the nullable variant of the zoned date time schema. Successful output type is `Temporal.ZonedDateTime` | `null`.
 *
 * Accepts/Transforms the following as input: `null` / `undefined` / `Temporal.ZonedDateTime` /
 * `@internationalized/date` `ZonedDateTime` (via string round-trip)
 *
 * @param messages - {@link FormWrongTypeMessage} providing the wrong-type error text.
 * @param actions - Additional valibot actions applied to the `Temporal.ZonedDateTime` value.
 *
 * @returns A valibot validation schema that outputs `Temporal.ZonedDateTime` | `null`.
 */
export function _zonedDateTimeNullable(messages: FormWrongTypeMessage, ...actions: ZonedDateTimeAction[]) {
  return v.union(
    [
      v.null(messages.wrongTypeMessage),
      v.pipe(
        v.undefined(messages.wrongTypeMessage),
        v.transform(() => null),
      ),
      v.pipe(t.zonedDateTime(messages.wrongTypeMessage), ...actions),
      v.pipe(
        internationalizedZonedDateTime(messages.wrongTypeMessage),
        toZonedDateTime(messages.wrongTypeMessage),
        v.pipe(t.zonedDateTime(messages.wrongTypeMessage), ...actions),
      ),
    ],
    messages.wrongTypeMessage,
  );
}

/**
 * Builds the required variant of the zoned date time schema. Successful out type is `Temporal.ZonedDateTime`.
 *
 * Accepts/Transforms the following as input: `null` / `undefined` / `Temporal.ZonedDateTime` /
 * `@internationalized/date` `ZonedDateTime` (via string round-trip)
 *
 * @param messages - {@link FormRequiredMessage} providing both wrong-type and required error text.
 * @param actions - Additional valibot actions applied to the `Temporal.ZonedDateTime` value.
 *
 * @returns A valibot validation schema that outputs `Temporal.ZonedDateTime`.
 */
export function _zonedDateTimeRequired(messages: FormRequiredMessage, ...actions: ZonedDateTimeAction[]) {
  return v.pipe(_zonedDateTimeNullable(messages), v.pipe(t.zonedDateTime(messages.requiredMessage), ...actions));
}

/**
 * Zoned date time validation schema. Will use the required variant {@link _zonedDateTimeRequired} when users passes
 * in {@link FormRequiredMessage}. Uses the nullable variant {@link _zonedDateTimeNullable} when user otherwise passes
 * in {@link FormWrongTypeMessage}.
 *
 * Accepts/Transforms the following as input: `null` / `undefined` / `Temporal.ZonedDateTime` /
 * `@internationalized/date` `ZonedDateTime` (via string round-trip)
 *
 * @param messages - {@link FormWrongTypeMessage} | {@link FormRequiredMessage} providing the wrong-type error text.
 * @param actions - Additional valibot actions applied to the `Temporal.ZonedDateTime` value.
 *
 * @returns A valibot validation schema that outputs `Temporal.ZonedDateTime` or `Temporal.ZonedDateTime` | `null` based on message type.
 */
export function zonedDateTime<T extends FormWrongTypeMessage | FormRequiredMessage>(
  messages: T,
  ...actions: ZonedDateTimeAction[]
): T extends FormRequiredMessage
  ? ReturnType<typeof _zonedDateTimeRequired>
  : ReturnType<typeof _zonedDateTimeNullable>;

export function zonedDateTime(messages: FormWrongTypeMessage | FormRequiredMessage, ...actions: ZonedDateTimeAction[]) {
  if (isFormRequiredMessage(messages)) {
    return _zonedDateTimeRequired(messages, ...actions);
  }

  return _zonedDateTimeNullable(messages, ...actions);
}
