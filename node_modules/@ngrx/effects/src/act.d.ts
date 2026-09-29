import { Action } from '@ngrx/store';
import { Observable, OperatorFunction } from 'rxjs';
/** Represents config with named paratemeters for act */
export interface ActConfig<Input, OutputAction extends Action, ErrorAction extends Action, CompleteAction extends Action, UnsubscribeAction extends Action> {
    project: (input: Input, index: number) => Observable<OutputAction>;
    error: (error: any, input: Input) => ErrorAction;
    complete?: (count: number, input: Input) => CompleteAction;
    operator?: <Input, OutputAction>(project: (input: Input, index: number) => Observable<OutputAction>) => OperatorFunction<Input, OutputAction>;
    unsubscribe?: (count: number, input: Input) => UnsubscribeAction;
}
/**
 * Wraps project fn with error handling making it safe to use in Effects.
 * Takes either config with named properties that represent different possible
 * callbacks or project/error callbacks that are required.
 */
export declare function act<Input, OutputAction extends Action, ErrorAction extends Action>(project: (input: Input, index: number) => Observable<OutputAction>, error: (error: any, input: Input) => ErrorAction): (source: Observable<Input>) => Observable<OutputAction | ErrorAction>;
export declare function act<Input, OutputAction extends Action, ErrorAction extends Action, CompleteAction extends Action = never, UnsubscribeAction extends Action = never>(config: ActConfig<Input, OutputAction, ErrorAction, CompleteAction, UnsubscribeAction>): (source: Observable<Input>) => Observable<OutputAction | ErrorAction | CompleteAction | UnsubscribeAction>;
