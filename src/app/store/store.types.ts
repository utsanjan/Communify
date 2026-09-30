import { Action } from "@ngrx/store";

/**
 * Generic typed action interface used across all NgRx store slices.
 * Enforces a typed payload on top of the standard NgRx Action.
 */
export interface IAction<T> extends Action {
  payload: T;
}
