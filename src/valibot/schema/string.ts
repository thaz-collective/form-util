import * as v from 'valibot';

import type { FormWrongTypeMessage, FormRequiredMessage } from '#src/valibot/schema/types';
import { isFormRequiredMessage } from '#src/valibot/schema/types';

/**
 * The string action for forms
 */
export type StringAction = v.BaseValidation<string, string, v.BaseIssue<unknown>>;

/**
 * Builds the nullable variant of the string schema. Successful output type is `string` | `null`. Note, this
 * automatically will trim the output string for you.
 *
 * Accepts/Transforms the following as input: `null` / `undefined` / `string`
 *
 * @param messages - {@link FormWrongTypeMessage} providing the wrong-type error text.
 * @param actions - Additional valibot actions applied to the `string` value.
 *
 * @returns A valibot validation schema that outputs `string` | `null`.
 */
export function _stringNullable(messages: FormWrongTypeMessage, ...actions: StringAction[]) {
  return v.union(
    [
      v.null(),
      v.pipe(
        v.undefined(),
        v.transform(() => null),
      ),
      v.pipe(
        v.string(messages.wrongTypeMessage),
        v.trim(),
        v.union([
          v.pipe(
            v.literal(''),
            v.transform(() => null),
          ),
          v.pipe(v.string(messages.wrongTypeMessage), ...actions),
        ]),
      ),
    ],
    messages.wrongTypeMessage,
  );
}

/**
 * Builds the required variant of the string schema. Successful out type is `string`. Note, this
 * automatically will trim the output string for you.
 *
 * Accepts/Transforms the following as input: `null` / `undefined` / `string`
 *
 * @param messages - {@link FormRequiredMessage} providing both wrong-type and required error text.
 * @param actions - Additional valibot actions applied to the `string` value.
 *
 * @returns A valibot validation schema that outputs `string`.
 */
export function _stringRequired(messages: FormRequiredMessage, ...actions: StringAction[]) {
  return v.pipe(_stringNullable(messages), v.pipe(v.string(messages.requiredMessage), ...actions));
}

/**
 * String validation schema. Will use the required variant {@link _stringRequired} when users passes
 * in {@link FormRequiredMessage}. Uses the nullable variant {@link _stringNullable} when user otherwise passes
 * in {@link FormWrongTypeMessage}. Note, this automatically will trim the output string for you.
 *
 * Accepts/Transforms the following as input: `null` / `undefined` / `string`
 *
 * @param messages - {@link FormWrongTypeMessage} | {@link FormRequiredMessage} providing the wrong-type error text.
 * @param actions - Additional valibot actions applied to the `string` value.
 *
 * @returns A valibot validation schema that outputs `string` or `string` | `null` based on message type.
 */
export function string<T extends FormWrongTypeMessage | FormRequiredMessage>(
  messages: T,
  ...actions: StringAction[]
): T extends FormRequiredMessage ? ReturnType<typeof _stringRequired> : ReturnType<typeof _stringNullable>;

export function string(messages: FormWrongTypeMessage | FormRequiredMessage, ...actions: StringAction[]) {
  if (isFormRequiredMessage(messages)) {
    return _stringRequired(messages, ...actions);
  }

  return _stringNullable(messages, ...actions);
}
