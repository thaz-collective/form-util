import type * as v from 'valibot';

/**
 * Returns `ifAction` when `condition` is `true`, otherwise returns `elseAction`.
 *
 * Useful for conditionally applying a validation in a pipe based on runtime state. Does not allow transformations
 *
 * @param condition - When `true`, `ifAction` is returned; when `false`, `elseAction` is returned.
 * @param ifAction - The action to apply when `condition` is `true`.
 * @param elseAction - The action to apply when `condition` is `false`.
 */
export function when<TInput>(
  condition: boolean,
  ifAction: v.GenericPipeAction<TInput, TInput>,
  elseAction: v.GenericPipeAction<TInput, TInput>,
) {
  if (condition) {
    return ifAction;
  }

  return elseAction;
}
