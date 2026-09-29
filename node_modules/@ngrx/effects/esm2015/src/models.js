/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/**
 * Configures an effect created by `createEffect`.
 * @record
 */
export function EffectConfig() { }
if (false) {
    /**
     * Determines if the action emitted by the effect is dispatched to the store.
     * If false, effect does not need to return type `Observable<Action>`.
     * @type {?|undefined}
     */
    EffectConfig.prototype.dispatch;
    /**
     * Determines if the effect will be resubscribed to if an error occurs in the main actions stream.
     * @type {?|undefined}
     */
    EffectConfig.prototype.resubscribeOnError;
}
/** @type {?} */
export const DEFAULT_EFFECT_CONFIG = {
    dispatch: true,
    resubscribeOnError: true,
};
/** @type {?} */
export const CREATE_EFFECT_METADATA_KEY = '__@ngrx/effects_create__';
/**
 * @record
 */
export function CreateEffectMetadata() { }
if (false) {
    /* Skipping unnamed member:
    [CREATE_EFFECT_METADATA_KEY]: EffectConfig;*/
}
/**
 * @record
 * @template T
 */
export function EffectMetadata() { }
if (false) {
    /** @type {?} */
    EffectMetadata.prototype.propertyName;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW9kZWxzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vbW9kdWxlcy9lZmZlY3RzL3NyYy9tb2RlbHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFHQSxrQ0FVQzs7Ozs7OztJQUxDLGdDQUFtQjs7Ozs7SUFJbkIsMENBQTZCOzs7QUFHL0IsTUFBTSxPQUFPLHFCQUFxQixHQUFxQztJQUNyRSxRQUFRLEVBQUUsSUFBSTtJQUNkLGtCQUFrQixFQUFFLElBQUk7Q0FDekI7O0FBRUQsTUFBTSxPQUFPLDBCQUEwQixHQUFHLDBCQUEwQjs7OztBQUVwRSwwQ0FFQzs7Ozs7Ozs7O0FBT0Qsb0NBR0M7OztJQURDLHNDQUFtQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQ29uZmlndXJlcyBhbiBlZmZlY3QgY3JlYXRlZCBieSBgY3JlYXRlRWZmZWN0YC5cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBFZmZlY3RDb25maWcge1xuICAvKipcbiAgICogRGV0ZXJtaW5lcyBpZiB0aGUgYWN0aW9uIGVtaXR0ZWQgYnkgdGhlIGVmZmVjdCBpcyBkaXNwYXRjaGVkIHRvIHRoZSBzdG9yZS5cbiAgICogSWYgZmFsc2UsIGVmZmVjdCBkb2VzIG5vdCBuZWVkIHRvIHJldHVybiB0eXBlIGBPYnNlcnZhYmxlPEFjdGlvbj5gLlxuICAgKi9cbiAgZGlzcGF0Y2g/OiBib29sZWFuO1xuICAvKipcbiAgICogRGV0ZXJtaW5lcyBpZiB0aGUgZWZmZWN0IHdpbGwgYmUgcmVzdWJzY3JpYmVkIHRvIGlmIGFuIGVycm9yIG9jY3VycyBpbiB0aGUgbWFpbiBhY3Rpb25zIHN0cmVhbS5cbiAgICovXG4gIHJlc3Vic2NyaWJlT25FcnJvcj86IGJvb2xlYW47XG59XG5cbmV4cG9ydCBjb25zdCBERUZBVUxUX0VGRkVDVF9DT05GSUc6IFJlYWRvbmx5PFJlcXVpcmVkPEVmZmVjdENvbmZpZz4+ID0ge1xuICBkaXNwYXRjaDogdHJ1ZSxcbiAgcmVzdWJzY3JpYmVPbkVycm9yOiB0cnVlLFxufTtcblxuZXhwb3J0IGNvbnN0IENSRUFURV9FRkZFQ1RfTUVUQURBVEFfS0VZID0gJ19fQG5ncngvZWZmZWN0c19jcmVhdGVfXyc7XG5cbmV4cG9ydCBpbnRlcmZhY2UgQ3JlYXRlRWZmZWN0TWV0YWRhdGEge1xuICBbQ1JFQVRFX0VGRkVDVF9NRVRBREFUQV9LRVldOiBFZmZlY3RDb25maWc7XG59XG5cbmV4cG9ydCB0eXBlIEVmZmVjdFByb3BlcnR5S2V5PFQgZXh0ZW5kcyBPYmplY3Q+ID0gRXhjbHVkZTxcbiAga2V5b2YgVCxcbiAga2V5b2YgT2JqZWN0XG4+O1xuXG5leHBvcnQgaW50ZXJmYWNlIEVmZmVjdE1ldGFkYXRhPFQgZXh0ZW5kcyBPYmplY3Q+XG4gIGV4dGVuZHMgUmVxdWlyZWQ8RWZmZWN0Q29uZmlnPiB7XG4gIHByb3BlcnR5TmFtZTogRWZmZWN0UHJvcGVydHlLZXk8VD47XG59XG5cbmV4cG9ydCB0eXBlIEVmZmVjdHNNZXRhZGF0YTxUPiA9IHtcbiAgW2tleSBpbiBFZmZlY3RQcm9wZXJ0eUtleTxUPl0/OiBFZmZlY3RDb25maWdcbn07XG4iXX0=