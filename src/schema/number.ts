import * as v from 'valibot';

import type { FormWrongTypeMessage, FormRequiredMessage } from '#src/schema/types';
import { isFormRequiredMessage } from '#src/schema/types';

/**
 * The number action for forms
 */
export type NumberAction = v.BaseValidation<number, number, v.BaseIssue<unknown>>;

/**
 * Builds the nullable variant of the number schema. Successful output type is `number` | `null`.
 *
 * Accepts/Transforms the following as input: `null` / `undefined` / `number`
 *
 * @param messages - {@link FormWrongTypeMessage} providing the wrong-type error text.
 * @param actions - Additional valibot actions applied to the `number` value.
 *
 * @returns A valibot validation schema that outputs `number` | `null`.
 */
export function _numberNullable(messages: FormWrongTypeMessage, ...actions: NumberAction[]) {
  return v.union(
    [
      v.null(messages.wrongTypeMessage),
      v.pipe(
        v.undefined(messages.wrongTypeMessage),
        v.transform(() => null),
      ),
      v.pipe(v.number(messages.wrongTypeMessage), v.finite(messages.wrongTypeMessage), ...actions),
    ],
    messages.wrongTypeMessage,
  );
}

/**
 * Builds the required variant of the number schema. Successful out type is `number`.
 *
 * Accepts/Transforms the following as input: `null` / `undefined` / `number`
 *
 * @param messages - {@link FormRequiredMessage} providing both wrong-type and required error text.
 * @param actions - Additional valibot actions applied to the `number` value.
 *
 * @returns A valibot validation schema that outputs `number`.
 */
export function _numberRequired(messages: FormRequiredMessage, ...actions: NumberAction[]) {
  return v.pipe(_numberNullable(messages), v.pipe(v.number(messages.requiredMessage), ...actions));
}

/**
 * Number validation schema. Will use the required variant {@link _numberRequired} when users passes
 * in {@link FormRequiredMessage}. Uses the nullable variant {@link _numberNullable} when user otherwise passes
 * in {@link FormWrongTypeMessage}.
 *
 * Accepts/Transforms the following as input: `null` / `undefined` / `number`
 *
 * @param messages - {@link FormWrongTypeMessage} | {@link FormRequiredMessage} providing the wrong-type error text.
 * @param actions - Additional valibot actions applied to the `number` value.
 *
 * @returns A valibot validation schema that outputs `number` or `number` | `null` based on message type.
 */
export function number<T extends FormWrongTypeMessage | FormRequiredMessage>(
  messages: T,
  ...actions: NumberAction[]
): T extends FormRequiredMessage ? ReturnType<typeof _numberRequired> : ReturnType<typeof _numberNullable>;

export function number(messages: FormWrongTypeMessage | FormRequiredMessage, ...actions: NumberAction[]) {
  if (isFormRequiredMessage(messages)) {
    return _numberRequired(messages, ...actions);
  }

  return _numberNullable(messages, ...actions);
}
