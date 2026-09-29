/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { merge } from 'rxjs';
import { ignoreElements, map, materialize, catchError } from 'rxjs/operators';
import { getSourceMetadata } from './effects_metadata';
import { getSourceForInstance } from './utils';
/**
 * @param {?} sourceInstance
 * @param {?=} errorHandler
 * @return {?}
 */
export function mergeEffects(sourceInstance, errorHandler) {
    /** @type {?} */
    const sourceName = getSourceForInstance(sourceInstance).constructor.name;
    /** @type {?} */
    const observables$ = getSourceMetadata(sourceInstance).map((/**
     * @param {?} __0
     * @return {?}
     */
    ({ propertyName, dispatch, resubscribeOnError, }) => {
        /** @type {?} */
        const observable$ = typeof sourceInstance[propertyName] === 'function'
            ? sourceInstance[propertyName]()
            : sourceInstance[propertyName];
        /** @type {?} */
        const resubscribable$ = resubscribeOnError
            ? resubscribeInCaseOfError(observable$, errorHandler)
            : observable$;
        if (dispatch === false) {
            return resubscribable$.pipe(ignoreElements());
        }
        /** @type {?} */
        const materialized$ = resubscribable$.pipe(materialize());
        return materialized$.pipe(map((/**
         * @param {?} notification
         * @return {?}
         */
        (notification) => ({
            effect: sourceInstance[propertyName],
            notification,
            propertyName,
            sourceName,
            sourceInstance,
        }))));
    }));
    return merge(...observables$);
}
/**
 * @template T
 * @param {?} observable$
 * @param {?=} errorHandler
 * @return {?}
 */
function resubscribeInCaseOfError(observable$, errorHandler) {
    return observable$.pipe(catchError((/**
     * @param {?} error
     * @return {?}
     */
    error => {
        if (errorHandler)
            errorHandler.handleError(error);
        // Return observable that produces this particular effect
        return resubscribeInCaseOfError(observable$, errorHandler);
    })));
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZWZmZWN0c19yZXNvbHZlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL21vZHVsZXMvZWZmZWN0cy9zcmMvZWZmZWN0c19yZXNvbHZlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0FBQ0EsT0FBTyxFQUFFLEtBQUssRUFBNEIsTUFBTSxNQUFNLENBQUM7QUFDdkQsT0FBTyxFQUFFLGNBQWMsRUFBRSxHQUFHLEVBQUUsV0FBVyxFQUFFLFVBQVUsRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBRzlFLE9BQU8sRUFBRSxpQkFBaUIsRUFBRSxNQUFNLG9CQUFvQixDQUFDO0FBQ3ZELE9BQU8sRUFBRSxvQkFBb0IsRUFBRSxNQUFNLFNBQVMsQ0FBQzs7Ozs7O0FBRy9DLE1BQU0sVUFBVSxZQUFZLENBQzFCLGNBQW1CLEVBQ25CLFlBQTJCOztVQUVyQixVQUFVLEdBQUcsb0JBQW9CLENBQUMsY0FBYyxDQUFDLENBQUMsV0FBVyxDQUFDLElBQUk7O1VBRWxFLFlBQVksR0FBc0IsaUJBQWlCLENBQUMsY0FBYyxDQUFDLENBQUMsR0FBRzs7OztJQUMzRSxDQUFDLEVBQ0MsWUFBWSxFQUNaLFFBQVEsRUFDUixrQkFBa0IsR0FDbkIsRUFBa0MsRUFBRTs7Y0FDN0IsV0FBVyxHQUNmLE9BQU8sY0FBYyxDQUFDLFlBQVksQ0FBQyxLQUFLLFVBQVU7WUFDaEQsQ0FBQyxDQUFDLGNBQWMsQ0FBQyxZQUFZLENBQUMsRUFBRTtZQUNoQyxDQUFDLENBQUMsY0FBYyxDQUFDLFlBQVksQ0FBQzs7Y0FFNUIsZUFBZSxHQUFHLGtCQUFrQjtZQUN4QyxDQUFDLENBQUMsd0JBQXdCLENBQUMsV0FBVyxFQUFFLFlBQVksQ0FBQztZQUNyRCxDQUFDLENBQUMsV0FBVztRQUVmLElBQUksUUFBUSxLQUFLLEtBQUssRUFBRTtZQUN0QixPQUFPLGVBQWUsQ0FBQyxJQUFJLENBQUMsY0FBYyxFQUFFLENBQUMsQ0FBQztTQUMvQzs7Y0FFSyxhQUFhLEdBQUcsZUFBZSxDQUFDLElBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQztRQUV6RCxPQUFPLGFBQWEsQ0FBQyxJQUFJLENBQ3ZCLEdBQUc7Ozs7UUFDRCxDQUFDLFlBQWtDLEVBQXNCLEVBQUUsQ0FBQyxDQUFDO1lBQzNELE1BQU0sRUFBRSxjQUFjLENBQUMsWUFBWSxDQUFDO1lBQ3BDLFlBQVk7WUFDWixZQUFZO1lBQ1osVUFBVTtZQUNWLGNBQWM7U0FDZixDQUFDLEVBQ0gsQ0FDRixDQUFDO0lBQ0osQ0FBQyxFQUNGO0lBRUQsT0FBTyxLQUFLLENBQUMsR0FBRyxZQUFZLENBQUMsQ0FBQztBQUNoQyxDQUFDOzs7Ozs7O0FBRUQsU0FBUyx3QkFBd0IsQ0FDL0IsV0FBMEIsRUFDMUIsWUFBMkI7SUFFM0IsT0FBTyxXQUFXLENBQUMsSUFBSSxDQUNyQixVQUFVOzs7O0lBQUMsS0FBSyxDQUFDLEVBQUU7UUFDakIsSUFBSSxZQUFZO1lBQUUsWUFBWSxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUNsRCx5REFBeUQ7UUFDekQsT0FBTyx3QkFBd0IsQ0FBQyxXQUFXLEVBQUUsWUFBWSxDQUFDLENBQUM7SUFDN0QsQ0FBQyxFQUFDLENBQ0gsQ0FBQztBQUNKLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBBY3Rpb24gfSBmcm9tICdAbmdyeC9zdG9yZSc7XG5pbXBvcnQgeyBtZXJnZSwgTm90aWZpY2F0aW9uLCBPYnNlcnZhYmxlIH0gZnJvbSAncnhqcyc7XG5pbXBvcnQgeyBpZ25vcmVFbGVtZW50cywgbWFwLCBtYXRlcmlhbGl6ZSwgY2F0Y2hFcnJvciB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcblxuaW1wb3J0IHsgRWZmZWN0Tm90aWZpY2F0aW9uIH0gZnJvbSAnLi9lZmZlY3Rfbm90aWZpY2F0aW9uJztcbmltcG9ydCB7IGdldFNvdXJjZU1ldGFkYXRhIH0gZnJvbSAnLi9lZmZlY3RzX21ldGFkYXRhJztcbmltcG9ydCB7IGdldFNvdXJjZUZvckluc3RhbmNlIH0gZnJvbSAnLi91dGlscyc7XG5pbXBvcnQgeyBFcnJvckhhbmRsZXIgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuZXhwb3J0IGZ1bmN0aW9uIG1lcmdlRWZmZWN0cyhcbiAgc291cmNlSW5zdGFuY2U6IGFueSxcbiAgZXJyb3JIYW5kbGVyPzogRXJyb3JIYW5kbGVyXG4pOiBPYnNlcnZhYmxlPEVmZmVjdE5vdGlmaWNhdGlvbj4ge1xuICBjb25zdCBzb3VyY2VOYW1lID0gZ2V0U291cmNlRm9ySW5zdGFuY2Uoc291cmNlSW5zdGFuY2UpLmNvbnN0cnVjdG9yLm5hbWU7XG5cbiAgY29uc3Qgb2JzZXJ2YWJsZXMkOiBPYnNlcnZhYmxlPGFueT5bXSA9IGdldFNvdXJjZU1ldGFkYXRhKHNvdXJjZUluc3RhbmNlKS5tYXAoXG4gICAgKHtcbiAgICAgIHByb3BlcnR5TmFtZSxcbiAgICAgIGRpc3BhdGNoLFxuICAgICAgcmVzdWJzY3JpYmVPbkVycm9yLFxuICAgIH0pOiBPYnNlcnZhYmxlPEVmZmVjdE5vdGlmaWNhdGlvbj4gPT4ge1xuICAgICAgY29uc3Qgb2JzZXJ2YWJsZSQ6IE9ic2VydmFibGU8YW55PiA9XG4gICAgICAgIHR5cGVvZiBzb3VyY2VJbnN0YW5jZVtwcm9wZXJ0eU5hbWVdID09PSAnZnVuY3Rpb24nXG4gICAgICAgICAgPyBzb3VyY2VJbnN0YW5jZVtwcm9wZXJ0eU5hbWVdKClcbiAgICAgICAgICA6IHNvdXJjZUluc3RhbmNlW3Byb3BlcnR5TmFtZV07XG5cbiAgICAgIGNvbnN0IHJlc3Vic2NyaWJhYmxlJCA9IHJlc3Vic2NyaWJlT25FcnJvclxuICAgICAgICA/IHJlc3Vic2NyaWJlSW5DYXNlT2ZFcnJvcihvYnNlcnZhYmxlJCwgZXJyb3JIYW5kbGVyKVxuICAgICAgICA6IG9ic2VydmFibGUkO1xuXG4gICAgICBpZiAoZGlzcGF0Y2ggPT09IGZhbHNlKSB7XG4gICAgICAgIHJldHVybiByZXN1YnNjcmliYWJsZSQucGlwZShpZ25vcmVFbGVtZW50cygpKTtcbiAgICAgIH1cblxuICAgICAgY29uc3QgbWF0ZXJpYWxpemVkJCA9IHJlc3Vic2NyaWJhYmxlJC5waXBlKG1hdGVyaWFsaXplKCkpO1xuXG4gICAgICByZXR1cm4gbWF0ZXJpYWxpemVkJC5waXBlKFxuICAgICAgICBtYXAoXG4gICAgICAgICAgKG5vdGlmaWNhdGlvbjogTm90aWZpY2F0aW9uPEFjdGlvbj4pOiBFZmZlY3ROb3RpZmljYXRpb24gPT4gKHtcbiAgICAgICAgICAgIGVmZmVjdDogc291cmNlSW5zdGFuY2VbcHJvcGVydHlOYW1lXSxcbiAgICAgICAgICAgIG5vdGlmaWNhdGlvbixcbiAgICAgICAgICAgIHByb3BlcnR5TmFtZSxcbiAgICAgICAgICAgIHNvdXJjZU5hbWUsXG4gICAgICAgICAgICBzb3VyY2VJbnN0YW5jZSxcbiAgICAgICAgICB9KVxuICAgICAgICApXG4gICAgICApO1xuICAgIH1cbiAgKTtcblxuICByZXR1cm4gbWVyZ2UoLi4ub2JzZXJ2YWJsZXMkKTtcbn1cblxuZnVuY3Rpb24gcmVzdWJzY3JpYmVJbkNhc2VPZkVycm9yPFQgZXh0ZW5kcyBBY3Rpb24+KFxuICBvYnNlcnZhYmxlJDogT2JzZXJ2YWJsZTxUPixcbiAgZXJyb3JIYW5kbGVyPzogRXJyb3JIYW5kbGVyXG4pOiBPYnNlcnZhYmxlPFQ+IHtcbiAgcmV0dXJuIG9ic2VydmFibGUkLnBpcGUoXG4gICAgY2F0Y2hFcnJvcihlcnJvciA9PiB7XG4gICAgICBpZiAoZXJyb3JIYW5kbGVyKSBlcnJvckhhbmRsZXIuaGFuZGxlRXJyb3IoZXJyb3IpO1xuICAgICAgLy8gUmV0dXJuIG9ic2VydmFibGUgdGhhdCBwcm9kdWNlcyB0aGlzIHBhcnRpY3VsYXIgZWZmZWN0XG4gICAgICByZXR1cm4gcmVzdWJzY3JpYmVJbkNhc2VPZkVycm9yKG9ic2VydmFibGUkLCBlcnJvckhhbmRsZXIpO1xuICAgIH0pXG4gICk7XG59XG4iXX0=