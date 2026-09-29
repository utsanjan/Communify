/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { ErrorHandler, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs';
import { dematerialize, exhaustMap, filter, groupBy, map, mergeMap, } from 'rxjs/operators';
import { reportInvalidActions, } from './effect_notification';
import { mergeEffects } from './effects_resolver';
import { onIdentifyEffectsKey, onRunEffectsKey, onInitEffects, } from './lifecycle_hooks';
import { getSourceForInstance } from './utils';
export class EffectSources extends Subject {
    /**
     * @param {?} errorHandler
     * @param {?} store
     */
    constructor(errorHandler, store) {
        super();
        this.errorHandler = errorHandler;
        this.store = store;
    }
    /**
     * @param {?} effectSourceInstance
     * @return {?}
     */
    addEffects(effectSourceInstance) {
        this.next(effectSourceInstance);
        if (onInitEffects in effectSourceInstance &&
            typeof effectSourceInstance[onInitEffects] === 'function') {
            this.store.dispatch(effectSourceInstance[onInitEffects]());
        }
    }
    /**
     * \@internal
     * @return {?}
     */
    toActions() {
        return this.pipe(groupBy(getSourceForInstance), mergeMap((/**
         * @param {?} source$
         * @return {?}
         */
        source$ => source$.pipe(groupBy(effectsInstance)))), mergeMap((/**
         * @param {?} source$
         * @return {?}
         */
        source$ => source$.pipe(exhaustMap(resolveEffectSource(this.errorHandler)), map((/**
         * @param {?} output
         * @return {?}
         */
        output => {
            reportInvalidActions(output, this.errorHandler);
            return output.notification;
        })), filter((/**
         * @param {?} notification
         * @return {?}
         */
        (notification) => notification.kind === 'N')), dematerialize()))));
    }
}
EffectSources.decorators = [
    { type: Injectable }
];
/** @nocollapse */
EffectSources.ctorParameters = () => [
    { type: ErrorHandler },
    { type: Store }
];
if (false) {
    /**
     * @type {?}
     * @private
     */
    EffectSources.prototype.errorHandler;
    /**
     * @type {?}
     * @private
     */
    EffectSources.prototype.store;
}
/**
 * @param {?} sourceInstance
 * @return {?}
 */
function effectsInstance(sourceInstance) {
    if (onIdentifyEffectsKey in sourceInstance &&
        typeof sourceInstance[onIdentifyEffectsKey] === 'function') {
        return sourceInstance[onIdentifyEffectsKey]();
    }
    return '';
}
/**
 * @param {?} errorHandler
 * @return {?}
 */
function resolveEffectSource(errorHandler) {
    return (/**
     * @param {?} sourceInstance
     * @return {?}
     */
    sourceInstance => {
        /** @type {?} */
        const mergedEffects$ = mergeEffects(sourceInstance, errorHandler);
        if (isOnRunEffects(sourceInstance)) {
            return sourceInstance.ngrxOnRunEffects(mergedEffects$);
        }
        return mergedEffects$;
    });
}
/**
 * @param {?} sourceInstance
 * @return {?}
 */
function isOnRunEffects(sourceInstance) {
    /** @type {?} */
    const source = getSourceForInstance(sourceInstance);
    return (onRunEffectsKey in source && typeof source[onRunEffectsKey] === 'function');
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZWZmZWN0X3NvdXJjZXMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9tb2R1bGVzL2VmZmVjdHMvc3JjL2VmZmVjdF9zb3VyY2VzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7QUFBQSxPQUFPLEVBQUUsWUFBWSxFQUFFLFVBQVUsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUN6RCxPQUFPLEVBQVUsS0FBSyxFQUFFLE1BQU0sYUFBYSxDQUFDO0FBQzVDLE9BQU8sRUFBNEIsT0FBTyxFQUFFLE1BQU0sTUFBTSxDQUFDO0FBQ3pELE9BQU8sRUFDTCxhQUFhLEVBQ2IsVUFBVSxFQUNWLE1BQU0sRUFDTixPQUFPLEVBQ1AsR0FBRyxFQUNILFFBQVEsR0FDVCxNQUFNLGdCQUFnQixDQUFDO0FBRXhCLE9BQU8sRUFDTCxvQkFBb0IsR0FFckIsTUFBTSx1QkFBdUIsQ0FBQztBQUMvQixPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0sb0JBQW9CLENBQUM7QUFDbEQsT0FBTyxFQUNMLG9CQUFvQixFQUNwQixlQUFlLEVBRWYsYUFBYSxHQUNkLE1BQU0sbUJBQW1CLENBQUM7QUFDM0IsT0FBTyxFQUFFLG9CQUFvQixFQUFFLE1BQU0sU0FBUyxDQUFDO0FBRy9DLE1BQU0sT0FBTyxhQUFjLFNBQVEsT0FBWTs7Ozs7SUFDN0MsWUFBb0IsWUFBMEIsRUFBVSxLQUFpQjtRQUN2RSxLQUFLLEVBQUUsQ0FBQztRQURVLGlCQUFZLEdBQVosWUFBWSxDQUFjO1FBQVUsVUFBSyxHQUFMLEtBQUssQ0FBWTtJQUV6RSxDQUFDOzs7OztJQUVELFVBQVUsQ0FBQyxvQkFBeUI7UUFDbEMsSUFBSSxDQUFDLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDO1FBRWhDLElBQ0UsYUFBYSxJQUFJLG9CQUFvQjtZQUNyQyxPQUFPLG9CQUFvQixDQUFDLGFBQWEsQ0FBQyxLQUFLLFVBQVUsRUFDekQ7WUFDQSxJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxvQkFBb0IsQ0FBQyxhQUFhLENBQUMsRUFBRSxDQUFDLENBQUM7U0FDNUQ7SUFDSCxDQUFDOzs7OztJQUtELFNBQVM7UUFDUCxPQUFPLElBQUksQ0FBQyxJQUFJLENBQ2QsT0FBTyxDQUFDLG9CQUFvQixDQUFDLEVBQzdCLFFBQVE7Ozs7UUFBQyxPQUFPLENBQUMsRUFBRSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLGVBQWUsQ0FBQyxDQUFDLEVBQUMsRUFDM0QsUUFBUTs7OztRQUFDLE9BQU8sQ0FBQyxFQUFFLENBQ2pCLE9BQU8sQ0FBQyxJQUFJLENBQ1YsVUFBVSxDQUFDLG1CQUFtQixDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQyxFQUNsRCxHQUFHOzs7O1FBQUMsTUFBTSxDQUFDLEVBQUU7WUFDWCxvQkFBb0IsQ0FBQyxNQUFNLEVBQUUsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDO1lBQ2hELE9BQU8sTUFBTSxDQUFDLFlBQVksQ0FBQztRQUM3QixDQUFDLEVBQUMsRUFDRixNQUFNOzs7O1FBQ0osQ0FBQyxZQUFZLEVBQXdDLEVBQUUsQ0FDckQsWUFBWSxDQUFDLElBQUksS0FBSyxHQUFHLEVBQzVCLEVBQ0QsYUFBYSxFQUFFLENBQ2hCLEVBQ0YsQ0FDRixDQUFDO0lBQ0osQ0FBQzs7O1lBdkNGLFVBQVU7Ozs7WUF6QkYsWUFBWTtZQUNKLEtBQUs7Ozs7Ozs7SUEwQlIscUNBQWtDOzs7OztJQUFFLDhCQUF5Qjs7Ozs7O0FBd0MzRSxTQUFTLGVBQWUsQ0FBQyxjQUFtQjtJQUMxQyxJQUNFLG9CQUFvQixJQUFJLGNBQWM7UUFDdEMsT0FBTyxjQUFjLENBQUMsb0JBQW9CLENBQUMsS0FBSyxVQUFVLEVBQzFEO1FBQ0EsT0FBTyxjQUFjLENBQUMsb0JBQW9CLENBQUMsRUFBRSxDQUFDO0tBQy9DO0lBRUQsT0FBTyxFQUFFLENBQUM7QUFDWixDQUFDOzs7OztBQUVELFNBQVMsbUJBQW1CLENBQzFCLFlBQTBCO0lBRTFCOzs7O0lBQU8sY0FBYyxDQUFDLEVBQUU7O2NBQ2hCLGNBQWMsR0FBRyxZQUFZLENBQUMsY0FBYyxFQUFFLFlBQVksQ0FBQztRQUVqRSxJQUFJLGNBQWMsQ0FBQyxjQUFjLENBQUMsRUFBRTtZQUNsQyxPQUFPLGNBQWMsQ0FBQyxnQkFBZ0IsQ0FBQyxjQUFjLENBQUMsQ0FBQztTQUN4RDtRQUVELE9BQU8sY0FBYyxDQUFDO0lBQ3hCLENBQUMsRUFBQztBQUNKLENBQUM7Ozs7O0FBRUQsU0FBUyxjQUFjLENBQ3JCLGNBQXFDOztVQUUvQixNQUFNLEdBQUcsb0JBQW9CLENBQUMsY0FBYyxDQUFDO0lBRW5ELE9BQU8sQ0FDTCxlQUFlLElBQUksTUFBTSxJQUFJLE9BQU8sTUFBTSxDQUFDLGVBQWUsQ0FBQyxLQUFLLFVBQVUsQ0FDM0UsQ0FBQztBQUNKLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBFcnJvckhhbmRsZXIsIEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IEFjdGlvbiwgU3RvcmUgfSBmcm9tICdAbmdyeC9zdG9yZSc7XG5pbXBvcnQgeyBOb3RpZmljYXRpb24sIE9ic2VydmFibGUsIFN1YmplY3QgfSBmcm9tICdyeGpzJztcbmltcG9ydCB7XG4gIGRlbWF0ZXJpYWxpemUsXG4gIGV4aGF1c3RNYXAsXG4gIGZpbHRlcixcbiAgZ3JvdXBCeSxcbiAgbWFwLFxuICBtZXJnZU1hcCxcbn0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuXG5pbXBvcnQge1xuICByZXBvcnRJbnZhbGlkQWN0aW9ucyxcbiAgRWZmZWN0Tm90aWZpY2F0aW9uLFxufSBmcm9tICcuL2VmZmVjdF9ub3RpZmljYXRpb24nO1xuaW1wb3J0IHsgbWVyZ2VFZmZlY3RzIH0gZnJvbSAnLi9lZmZlY3RzX3Jlc29sdmVyJztcbmltcG9ydCB7XG4gIG9uSWRlbnRpZnlFZmZlY3RzS2V5LFxuICBvblJ1bkVmZmVjdHNLZXksXG4gIE9uUnVuRWZmZWN0cyxcbiAgb25Jbml0RWZmZWN0cyxcbn0gZnJvbSAnLi9saWZlY3ljbGVfaG9va3MnO1xuaW1wb3J0IHsgZ2V0U291cmNlRm9ySW5zdGFuY2UgfSBmcm9tICcuL3V0aWxzJztcblxuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIEVmZmVjdFNvdXJjZXMgZXh0ZW5kcyBTdWJqZWN0PGFueT4ge1xuICBjb25zdHJ1Y3Rvcihwcml2YXRlIGVycm9ySGFuZGxlcjogRXJyb3JIYW5kbGVyLCBwcml2YXRlIHN0b3JlOiBTdG9yZTxhbnk+KSB7XG4gICAgc3VwZXIoKTtcbiAgfVxuXG4gIGFkZEVmZmVjdHMoZWZmZWN0U291cmNlSW5zdGFuY2U6IGFueSk6IHZvaWQge1xuICAgIHRoaXMubmV4dChlZmZlY3RTb3VyY2VJbnN0YW5jZSk7XG5cbiAgICBpZiAoXG4gICAgICBvbkluaXRFZmZlY3RzIGluIGVmZmVjdFNvdXJjZUluc3RhbmNlICYmXG4gICAgICB0eXBlb2YgZWZmZWN0U291cmNlSW5zdGFuY2Vbb25Jbml0RWZmZWN0c10gPT09ICdmdW5jdGlvbidcbiAgICApIHtcbiAgICAgIHRoaXMuc3RvcmUuZGlzcGF0Y2goZWZmZWN0U291cmNlSW5zdGFuY2Vbb25Jbml0RWZmZWN0c10oKSk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEBpbnRlcm5hbFxuICAgKi9cbiAgdG9BY3Rpb25zKCk6IE9ic2VydmFibGU8QWN0aW9uPiB7XG4gICAgcmV0dXJuIHRoaXMucGlwZShcbiAgICAgIGdyb3VwQnkoZ2V0U291cmNlRm9ySW5zdGFuY2UpLFxuICAgICAgbWVyZ2VNYXAoc291cmNlJCA9PiBzb3VyY2UkLnBpcGUoZ3JvdXBCeShlZmZlY3RzSW5zdGFuY2UpKSksXG4gICAgICBtZXJnZU1hcChzb3VyY2UkID0+XG4gICAgICAgIHNvdXJjZSQucGlwZShcbiAgICAgICAgICBleGhhdXN0TWFwKHJlc29sdmVFZmZlY3RTb3VyY2UodGhpcy5lcnJvckhhbmRsZXIpKSxcbiAgICAgICAgICBtYXAob3V0cHV0ID0+IHtcbiAgICAgICAgICAgIHJlcG9ydEludmFsaWRBY3Rpb25zKG91dHB1dCwgdGhpcy5lcnJvckhhbmRsZXIpO1xuICAgICAgICAgICAgcmV0dXJuIG91dHB1dC5ub3RpZmljYXRpb247XG4gICAgICAgICAgfSksXG4gICAgICAgICAgZmlsdGVyKFxuICAgICAgICAgICAgKG5vdGlmaWNhdGlvbik6IG5vdGlmaWNhdGlvbiBpcyBOb3RpZmljYXRpb248QWN0aW9uPiA9PlxuICAgICAgICAgICAgICBub3RpZmljYXRpb24ua2luZCA9PT0gJ04nXG4gICAgICAgICAgKSxcbiAgICAgICAgICBkZW1hdGVyaWFsaXplKClcbiAgICAgICAgKVxuICAgICAgKVxuICAgICk7XG4gIH1cbn1cblxuZnVuY3Rpb24gZWZmZWN0c0luc3RhbmNlKHNvdXJjZUluc3RhbmNlOiBhbnkpIHtcbiAgaWYgKFxuICAgIG9uSWRlbnRpZnlFZmZlY3RzS2V5IGluIHNvdXJjZUluc3RhbmNlICYmXG4gICAgdHlwZW9mIHNvdXJjZUluc3RhbmNlW29uSWRlbnRpZnlFZmZlY3RzS2V5XSA9PT0gJ2Z1bmN0aW9uJ1xuICApIHtcbiAgICByZXR1cm4gc291cmNlSW5zdGFuY2Vbb25JZGVudGlmeUVmZmVjdHNLZXldKCk7XG4gIH1cblxuICByZXR1cm4gJyc7XG59XG5cbmZ1bmN0aW9uIHJlc29sdmVFZmZlY3RTb3VyY2UoXG4gIGVycm9ySGFuZGxlcjogRXJyb3JIYW5kbGVyXG4pOiAoc291cmNlSW5zdGFuY2U6IGFueSkgPT4gT2JzZXJ2YWJsZTxFZmZlY3ROb3RpZmljYXRpb24+IHtcbiAgcmV0dXJuIHNvdXJjZUluc3RhbmNlID0+IHtcbiAgICBjb25zdCBtZXJnZWRFZmZlY3RzJCA9IG1lcmdlRWZmZWN0cyhzb3VyY2VJbnN0YW5jZSwgZXJyb3JIYW5kbGVyKTtcblxuICAgIGlmIChpc09uUnVuRWZmZWN0cyhzb3VyY2VJbnN0YW5jZSkpIHtcbiAgICAgIHJldHVybiBzb3VyY2VJbnN0YW5jZS5uZ3J4T25SdW5FZmZlY3RzKG1lcmdlZEVmZmVjdHMkKTtcbiAgICB9XG5cbiAgICByZXR1cm4gbWVyZ2VkRWZmZWN0cyQ7XG4gIH07XG59XG5cbmZ1bmN0aW9uIGlzT25SdW5FZmZlY3RzKFxuICBzb3VyY2VJbnN0YW5jZTogUGFydGlhbDxPblJ1bkVmZmVjdHM+XG4pOiBzb3VyY2VJbnN0YW5jZSBpcyBPblJ1bkVmZmVjdHMge1xuICBjb25zdCBzb3VyY2UgPSBnZXRTb3VyY2VGb3JJbnN0YW5jZShzb3VyY2VJbnN0YW5jZSk7XG5cbiAgcmV0dXJuIChcbiAgICBvblJ1bkVmZmVjdHNLZXkgaW4gc291cmNlICYmIHR5cGVvZiBzb3VyY2Vbb25SdW5FZmZlY3RzS2V5XSA9PT0gJ2Z1bmN0aW9uJ1xuICApO1xufVxuIl19