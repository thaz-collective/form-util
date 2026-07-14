import * as t from '@thaz/temporal-util/valibot';

import { Temporal } from '@js-temporal/polyfill';
import * as v from 'valibot';

import type { FormWrongTypeMessage, FormRequiredMessage } from '#src/valibot/schema/types';
import { toInstant } from '#src/valibot/internationalized-date/actions/to-instant-value';
import { internationalizedZonedDateTime } from '#src/valibot/internationalized-date/schema/internationalized-zoned-date-time';
import { isFormRequiredMessage } from '#src/valibot/schema/types';

/**
 * The instant action for forms
 */
export type InstantAction = v.BaseValidation<Temporal.Instant, Temporal.Instant, v.BaseIssue<unknown>>;

/**
 * Builds the nullable variant of the instant schema. Successful output type is `Temporal.Instant` | `null`.
 *
 * Accepts/Transforms the following as input: `null` / `undefined` / `Temporal.Instant` /
 * `Temporal.ZonedDateTime` / `@internationalized/date` `ZonedDateTime`
 *
 * @param messages - {@link FormWrongTypeMessage} providing the wrong-type error text.
 * @param actions - Additional valibot actions applied to the `Temporal.Instant` value.
 *
 * @returns A valibot validation schema that outputs `Temporal.Instant` | `null`.
 */
export function _instantNullable(messages: FormWrongTypeMessage, ...actions: InstantAction[]) {
  return v.union(
    [
      v.null(messages.wrongTypeMessage),
      v.pipe(
        v.undefined(messages.wrongTypeMessage),
        v.transform(() => null),
      ),
      v.pipe(t.instant(messages.wrongTypeMessage), ...actions),
      v.pipe(
        t.zonedDateTime(messages.wrongTypeMessage),
        t.toInstant(messages.wrongTypeMessage),
        v.pipe(t.instant(messages.wrongTypeMessage), ...actions),
      ),
      v.pipe(
        internationalizedZonedDateTime(messages.wrongTypeMessage),
        toInstant(messages.wrongTypeMessage),
        v.pipe(t.instant(messages.wrongTypeMessage), ...actions),
      ),
    ],
    messages.wrongTypeMessage,
  );
}

/**
 * Builds the required variant of the instant schema. Successful out type is `Temporal.Instant`.
 *
 * Accepts/Transforms the following as input: `null` / `undefined` / `Temporal.Instant` /
 * `Temporal.ZonedDateTime` / `@internationalized/date` `ZonedDateTime`
 *
 * @param messages - {@link FormRequiredMessage} providing both wrong-type and required error text.
 * @param actions - Additional valibot actions applied to the `Temporal.Instant` value.
 *
 * @returns A valibot validation schema that outputs `Temporal.Instant`.
 */
export function _instantRequired(messages: FormRequiredMessage, ...actions: InstantAction[]) {
  return v.pipe(_instantNullable(messages), v.pipe(t.instant(messages.requiredMessage), ...actions));
}

/**
 * Instant validation schema. Will use the required variant {@link _instantRequired} when users passes
 * in {@link FormRequiredMessage}. Uses the nullable variant {@link _instantNullable} when user otherwise passes
 * in {@link FormWrongTypeMessage}.
 *
 * Accepts/Transforms the following as input: `null` / `undefined` / `Temporal.Instant` /
 * `Temporal.ZonedDateTime` / `@internationalized/date` `ZonedDateTime`
 *
 * @param messages - {@link FormWrongTypeMessage} | {@link FormRequiredMessage} providing the wrong-type error text.
 * @param actions - Additional valibot actions applied to the `Temporal.Instant` value.
 *
 * @returns A valibot validation schema that outputs `Temporal.Instant` or `Temporal.Instant` | `null` based on message type.
 */
export function instant<T extends FormWrongTypeMessage | FormRequiredMessage>(
  messages: T,
  ...actions: InstantAction[]
): T extends FormRequiredMessage ? ReturnType<typeof _instantRequired> : ReturnType<typeof _instantNullable>;

export function instant(messages: FormWrongTypeMessage | FormRequiredMessage, ...actions: InstantAction[]) {
  if (isFormRequiredMessage(messages)) {
    return _instantRequired(messages, ...actions);
  }

  return _instantNullable(messages, ...actions);
}
