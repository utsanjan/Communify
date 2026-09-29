/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/**
 * \@description
 * Interface to set an identifier for effect instances.
 *
 * By default, each Effects class is registered
 * once regardless of how many times the Effect class
 * is loaded. By implementing this interface, you define
 * a unique identifier to register an Effects class instance
 * multiple times.
 *
 * \@usageNotes
 *
 * ### Set an identifier for an Effects class
 *
 * ```ts
 * class EffectWithIdentifier implements OnIdentifyEffects {
 *  constructor(private effectIdentifier: string) {}
 *
 *  ngrxOnIdentifyEffects() {
 *    return this.effectIdentifier;
 *  }
 *
 * ```
 * @record
 */
export function OnIdentifyEffects() { }
if (false) {
    /**
     * \@description
     * String identifier to differentiate effect instances.
     * @return {?}
     */
    OnIdentifyEffects.prototype.ngrxOnIdentifyEffects = function () { };
}
/** @type {?} */
export const onIdentifyEffectsKey = 'ngrxOnIdentifyEffects';
/**
 * \@description
 * Interface to control the lifecycle of effects.
 *
 * By default, effects are merged and subscribed to the store. Implement the OnRunEffects interface to control the lifecycle of the resolved effects.
 *
 * \@usageNotes
 *
 * ### Implement the OnRunEffects interface on an Effects class
 *
 * ```ts
 * export class UserEffects implements OnRunEffects {
 *   constructor(private actions$: Actions) {}
 *
 *   ngrxOnRunEffects(resolvedEffects$: Observable<EffectNotification>) {
 *     return this.actions$.pipe(
 *       ofType('LOGGED_IN'),
 *       exhaustMap(() =>
 *         resolvedEffects$.pipe(
 *           takeUntil(this.actions$.pipe(ofType('LOGGED_OUT')))
 *         )
 *       )
 *     );
 *   }
 * }
 * ```
 * @record
 */
export function OnRunEffects() { }
if (false) {
    /**
     * \@description
     * Method to control the lifecycle of effects.
     * @param {?} resolvedEffects$
     * @return {?}
     */
    OnRunEffects.prototype.ngrxOnRunEffects = function (resolvedEffects$) { };
}
/** @type {?} */
export const onRunEffectsKey = 'ngrxOnRunEffects';
/**
 * \@description
 * Interface to dispatch an action after effect registration.
 *
 * Implement this interface to dispatch a custom action after
 * the effect has been added. You can listen to this action
 * in the rest of the application to execute something after
 * the effect is registered.
 *
 * \@usageNotes
 *
 * ### Set an identifier for an Effects class
 *
 * ```ts
 * class EffectWithInitAction implements OnInitEffects {
 *  ngrxOnInitEffects() {
 *    return { type: '[EffectWithInitAction] Init' };
 *  }
 * ```
 * @record
 */
export function OnInitEffects() { }
if (false) {
    /**
     * \@description
     * Action to be dispatched after the effect is registered.
     * @return {?}
     */
    OnInitEffects.prototype.ngrxOnInitEffects = function () { };
}
/** @type {?} */
export const onInitEffects = 'ngrxOnInitEffects';
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGlmZWN5Y2xlX2hvb2tzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vbW9kdWxlcy9lZmZlY3RzL3NyYy9saWZlY3ljbGVfaG9va3MudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUE0QkEsdUNBTUM7Ozs7Ozs7SUFEQyxvRUFBZ0M7OztBQUdsQyxNQUFNLE9BQU8sb0JBQW9CLEdBQy9CLHVCQUF1Qjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUE2QnpCLGtDQVFDOzs7Ozs7OztJQUhDLDBFQUVrQzs7O0FBR3BDLE1BQU0sT0FBTyxlQUFlLEdBQXVCLGtCQUFrQjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQXNCckUsbUNBTUM7Ozs7Ozs7SUFEQyw0REFBNEI7OztBQUc5QixNQUFNLE9BQU8sYUFBYSxHQUF3QixtQkFBbUIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAncnhqcyc7XG5pbXBvcnQgeyBFZmZlY3ROb3RpZmljYXRpb24gfSBmcm9tICcuJztcbmltcG9ydCB7IEFjdGlvbiB9IGZyb20gJ0BuZ3J4L3N0b3JlJztcblxuLyoqXG4gKiBAZGVzY3JpcHRpb25cbiAqIEludGVyZmFjZSB0byBzZXQgYW4gaWRlbnRpZmllciBmb3IgZWZmZWN0IGluc3RhbmNlcy5cbiAqXG4gKiBCeSBkZWZhdWx0LCBlYWNoIEVmZmVjdHMgY2xhc3MgaXMgcmVnaXN0ZXJlZFxuICogb25jZSByZWdhcmRsZXNzIG9mIGhvdyBtYW55IHRpbWVzIHRoZSBFZmZlY3QgY2xhc3NcbiAqIGlzIGxvYWRlZC4gQnkgaW1wbGVtZW50aW5nIHRoaXMgaW50ZXJmYWNlLCB5b3UgZGVmaW5lXG4gKiBhIHVuaXF1ZSBpZGVudGlmaWVyIHRvIHJlZ2lzdGVyIGFuIEVmZmVjdHMgY2xhc3MgaW5zdGFuY2VcbiAqIG11bHRpcGxlIHRpbWVzLlxuICpcbiAqIEB1c2FnZU5vdGVzXG4gKlxuICogIyMjIFNldCBhbiBpZGVudGlmaWVyIGZvciBhbiBFZmZlY3RzIGNsYXNzXG4gKlxuICogYGBgdHNcbiAqIGNsYXNzIEVmZmVjdFdpdGhJZGVudGlmaWVyIGltcGxlbWVudHMgT25JZGVudGlmeUVmZmVjdHMge1xuICogIGNvbnN0cnVjdG9yKHByaXZhdGUgZWZmZWN0SWRlbnRpZmllcjogc3RyaW5nKSB7fVxuICpcbiAqICBuZ3J4T25JZGVudGlmeUVmZmVjdHMoKSB7XG4gKiAgICByZXR1cm4gdGhpcy5lZmZlY3RJZGVudGlmaWVyO1xuICogIH1cbiAqXG4gKiBgYGBcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBPbklkZW50aWZ5RWZmZWN0cyB7XG4gIC8qKlxuICAgKiBAZGVzY3JpcHRpb25cbiAgICogU3RyaW5nIGlkZW50aWZpZXIgdG8gZGlmZmVyZW50aWF0ZSBlZmZlY3QgaW5zdGFuY2VzLlxuICAgKi9cbiAgbmdyeE9uSWRlbnRpZnlFZmZlY3RzKCk6IHN0cmluZztcbn1cblxuZXhwb3J0IGNvbnN0IG9uSWRlbnRpZnlFZmZlY3RzS2V5OiBrZXlvZiBPbklkZW50aWZ5RWZmZWN0cyA9XG4gICduZ3J4T25JZGVudGlmeUVmZmVjdHMnO1xuXG4vKipcbiAqIEBkZXNjcmlwdGlvblxuICogSW50ZXJmYWNlIHRvIGNvbnRyb2wgdGhlIGxpZmVjeWNsZSBvZiBlZmZlY3RzLlxuICpcbiAqIEJ5IGRlZmF1bHQsIGVmZmVjdHMgYXJlIG1lcmdlZCBhbmQgc3Vic2NyaWJlZCB0byB0aGUgc3RvcmUuIEltcGxlbWVudCB0aGUgT25SdW5FZmZlY3RzIGludGVyZmFjZSB0byBjb250cm9sIHRoZSBsaWZlY3ljbGUgb2YgdGhlIHJlc29sdmVkIGVmZmVjdHMuXG4gKlxuICogQHVzYWdlTm90ZXNcbiAqXG4gKiAjIyMgSW1wbGVtZW50IHRoZSBPblJ1bkVmZmVjdHMgaW50ZXJmYWNlIG9uIGFuIEVmZmVjdHMgY2xhc3NcbiAqXG4gKiBgYGB0c1xuICogZXhwb3J0IGNsYXNzIFVzZXJFZmZlY3RzIGltcGxlbWVudHMgT25SdW5FZmZlY3RzIHtcbiAqICAgY29uc3RydWN0b3IocHJpdmF0ZSBhY3Rpb25zJDogQWN0aW9ucykge31cbiAqXG4gKiAgIG5ncnhPblJ1bkVmZmVjdHMocmVzb2x2ZWRFZmZlY3RzJDogT2JzZXJ2YWJsZTxFZmZlY3ROb3RpZmljYXRpb24+KSB7XG4gKiAgICAgcmV0dXJuIHRoaXMuYWN0aW9ucyQucGlwZShcbiAqICAgICAgIG9mVHlwZSgnTE9HR0VEX0lOJyksXG4gKiAgICAgICBleGhhdXN0TWFwKCgpID0+XG4gKiAgICAgICAgIHJlc29sdmVkRWZmZWN0cyQucGlwZShcbiAqICAgICAgICAgICB0YWtlVW50aWwodGhpcy5hY3Rpb25zJC5waXBlKG9mVHlwZSgnTE9HR0VEX09VVCcpKSlcbiAqICAgICAgICAgKVxuICogICAgICAgKVxuICogICAgICk7XG4gKiAgIH1cbiAqIH1cbiAqIGBgYFxuICovXG5leHBvcnQgaW50ZXJmYWNlIE9uUnVuRWZmZWN0cyB7XG4gIC8qKlxuICAgKiBAZGVzY3JpcHRpb25cbiAgICogTWV0aG9kIHRvIGNvbnRyb2wgdGhlIGxpZmVjeWNsZSBvZiBlZmZlY3RzLlxuICAgKi9cbiAgbmdyeE9uUnVuRWZmZWN0cyhcbiAgICByZXNvbHZlZEVmZmVjdHMkOiBPYnNlcnZhYmxlPEVmZmVjdE5vdGlmaWNhdGlvbj5cbiAgKTogT2JzZXJ2YWJsZTxFZmZlY3ROb3RpZmljYXRpb24+O1xufVxuXG5leHBvcnQgY29uc3Qgb25SdW5FZmZlY3RzS2V5OiBrZXlvZiBPblJ1bkVmZmVjdHMgPSAnbmdyeE9uUnVuRWZmZWN0cyc7XG5cbi8qKlxuICogQGRlc2NyaXB0aW9uXG4gKiBJbnRlcmZhY2UgdG8gZGlzcGF0Y2ggYW4gYWN0aW9uIGFmdGVyIGVmZmVjdCByZWdpc3RyYXRpb24uXG4gKlxuICogSW1wbGVtZW50IHRoaXMgaW50ZXJmYWNlIHRvIGRpc3BhdGNoIGEgY3VzdG9tIGFjdGlvbiBhZnRlclxuICogdGhlIGVmZmVjdCBoYXMgYmVlbiBhZGRlZC4gWW91IGNhbiBsaXN0ZW4gdG8gdGhpcyBhY3Rpb25cbiAqIGluIHRoZSByZXN0IG9mIHRoZSBhcHBsaWNhdGlvbiB0byBleGVjdXRlIHNvbWV0aGluZyBhZnRlclxuICogdGhlIGVmZmVjdCBpcyByZWdpc3RlcmVkLlxuICpcbiAqIEB1c2FnZU5vdGVzXG4gKlxuICogIyMjIFNldCBhbiBpZGVudGlmaWVyIGZvciBhbiBFZmZlY3RzIGNsYXNzXG4gKlxuICogYGBgdHNcbiAqIGNsYXNzIEVmZmVjdFdpdGhJbml0QWN0aW9uIGltcGxlbWVudHMgT25Jbml0RWZmZWN0cyB7XG4gKiAgbmdyeE9uSW5pdEVmZmVjdHMoKSB7XG4gKiAgICByZXR1cm4geyB0eXBlOiAnW0VmZmVjdFdpdGhJbml0QWN0aW9uXSBJbml0JyB9O1xuICogIH1cbiAqIGBgYFxuICovXG5leHBvcnQgaW50ZXJmYWNlIE9uSW5pdEVmZmVjdHMge1xuICAvKipcbiAgICogQGRlc2NyaXB0aW9uXG4gICAqIEFjdGlvbiB0byBiZSBkaXNwYXRjaGVkIGFmdGVyIHRoZSBlZmZlY3QgaXMgcmVnaXN0ZXJlZC5cbiAgICovXG4gIG5ncnhPbkluaXRFZmZlY3RzKCk6IEFjdGlvbjtcbn1cblxuZXhwb3J0IGNvbnN0IG9uSW5pdEVmZmVjdHM6IGtleW9mIE9uSW5pdEVmZmVjdHMgPSAnbmdyeE9uSW5pdEVmZmVjdHMnO1xuIl19