import { Action } from "@ngrx/store";

export interface IAction<T> extends Action {
  payload: T;
}
