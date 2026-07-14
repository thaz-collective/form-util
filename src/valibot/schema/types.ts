export interface FormWrongTypeMessage {
  wrongTypeMessage: string;
}

export interface FormRequiredMessage extends FormWrongTypeMessage {
  requiredMessage: string;
}

/**
 * Type guard that narrows `messages` to {@link FormRequiredMessage} when `requiredMessage` is present.
 *
 * @param messages - {@link FormWrongTypeMessage} | {@link FormRequiredMessage} to check.
 * @returns `true` if `messages` includes `requiredMessage`.
 */
export function isFormRequiredMessage(
  messages: FormWrongTypeMessage | FormRequiredMessage,
): messages is FormRequiredMessage {
  return 'requiredMessage' in messages;
}
