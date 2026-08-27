import * as v from 'valibot';

import type { FormWrongTypeMessage, FormRequiredMessage } from '#src/schema/types';
import { isFormRequiredMessage } from '#src/schema/types';

/**
 * The boolean action for forms
 */
export type BooleanAction = v.BaseValidation<boolean, boolean, v.BaseIssue<unknown>>;

/**
 * Builds the nullable variant of the boolean schema. Successful output type is `boolean` | `null`.
 *
 * Accepts/Transforms the following as input: `null` / `undefined` / `boolean`
 *
 * @param messages - {@link FormWrongTypeMessage} providing the wrong-type error text.
 * @param actions - Additional valibot actions applied to the `boolean` value.
 *
 * @returns A valibot validation schema that outputs `boolean` | `null`.
 */
export function _booleanNullable(messages: FormWrongTypeMessage, ...actions: BooleanAction[]) {
  return v.union(
    [
      v.null(messages.wrongTypeMessage),
      v.pipe(
        v.undefined(messages.wrongTypeMessage),
        v.transform(() => null),
      ),
      v.pipe(v.boolean(messages.wrongTypeMessage), ...actions),
      v.pipe(
        v.string(messages.wrongTypeMessage),
        v.transform((input) => input.toLowerCase()),
        v.picklist(['y', 'yes', 'true', '1', 'on', 'n', 'no', 'false', '0', 'off'], messages.wrongTypeMessage),
        v.transform((input) => ['y', 'yes', 'true', '1', 'on'].includes(input)),
      ),
    ],
    messages.wrongTypeMessage,
  );
}

/**
 * Builds the required variant of the boolean schema. Successful out type is `boolean`.
 *
 * Accepts/Transforms the following as input: `null` / `undefined` / `boolean`
 *
 * @param messages - {@link FormRequiredMessage} providing both wrong-type and required error text.
 * @param actions - Additional valibot actions applied to the `boolean` value.
 *
 * @returns A valibot validation schema that outputs `boolean`.
 */
export function _booleanRequired(messages: FormRequiredMessage, ...actions: BooleanAction[]) {
  return v.pipe(_booleanNullable(messages), v.pipe(v.boolean(messages.requiredMessage), ...actions));
}

/**
 * Boolean validation schema. Will use the required variant {@link _booleanRequired} when users passes
 * in {@link FormRequiredMessage}. Uses the nullable variant {@link _booleanNullable} when user otherwise passes
 * in {@link FormWrongTypeMessage}.
 *
 * Accepts/Transforms the following as input: `null` / `undefined` / `boolean`
 *
 * @param messages - {@link FormWrongTypeMessage} | {@link FormRequiredMessage} providing the wrong-type error text.
 * @param actions - Additional valibot actions applied to the `boolean` value.
 *
 * @returns A valibot validation schema that outputs `boolean` or `boolean` | `null` based on message type.
 */
export function boolean<T extends FormWrongTypeMessage | FormRequiredMessage>(
  messages: T,
  ...actions: BooleanAction[]
): T extends FormRequiredMessage ? ReturnType<typeof _booleanRequired> : ReturnType<typeof _booleanNullable>;

export function boolean(messages: FormWrongTypeMessage | FormRequiredMessage, ...actions: BooleanAction[]) {
  if (isFormRequiredMessage(messages)) {
    return _booleanRequired(messages, ...actions);
  }

  return _booleanNullable(messages, ...actions);
}
