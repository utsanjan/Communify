/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { compose } from '@ngrx/store';
import { DEFAULT_EFFECT_CONFIG, } from './models';
import { getSourceForInstance } from './utils';
/** @type {?} */
const METADATA_KEY = '__@ngrx/effects__';
/**
 * @param {?=} config
 * @return {?}
 */
export function Effect(config = {}) {
    return (/**
     * @template T, K
     * @param {?} target
     * @param {?} propertyName
     * @return {?}
     */
    function (target, propertyName) {
        /** @type {?} */
        const metadata = Object.assign({}, DEFAULT_EFFECT_CONFIG, config, { // Overrides any defaults if values are provided
            propertyName });
        addEffectMetadataEntry(target, metadata);
    });
}
/**
 * @template T
 * @param {?} instance
 * @return {?}
 */
export function getEffectDecoratorMetadata(instance) {
    /** @type {?} */
    const effectsDecorators = compose(getEffectMetadataEntries, getSourceForInstance)(instance);
    return effectsDecorators;
}
/**
 * Type guard to detemine whether METADATA_KEY is already present on the Class
 * constructor
 * @template T
 * @param {?} sourceProto
 * @return {?}
 */
function hasMetadataEntries(sourceProto) {
    return sourceProto.constructor.hasOwnProperty(METADATA_KEY);
}
/**
 * Add Effect Metadata to the Effect Class constructor under specific key
 * @template T
 * @param {?} sourceProto
 * @param {?} metadata
 * @return {?}
 */
function addEffectMetadataEntry(sourceProto, metadata) {
    if (hasMetadataEntries(sourceProto)) {
        sourceProto.constructor[METADATA_KEY].push(metadata);
    }
    else {
        Object.defineProperty(sourceProto.constructor, METADATA_KEY, {
            value: [metadata],
        });
    }
}
/**
 * @template T
 * @param {?} sourceProto
 * @return {?}
 */
function getEffectMetadataEntries(sourceProto) {
    return hasMetadataEntries(sourceProto)
        ? sourceProto.constructor[METADATA_KEY]
        : [];
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZWZmZWN0X2RlY29yYXRvci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL21vZHVsZXMvZWZmZWN0cy9zcmMvZWZmZWN0X2RlY29yYXRvci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0FBQUEsT0FBTyxFQUFFLE9BQU8sRUFBRSxNQUFNLGFBQWEsQ0FBQztBQUV0QyxPQUFPLEVBQ0wscUJBQXFCLEdBSXRCLE1BQU0sVUFBVSxDQUFDO0FBQ2xCLE9BQU8sRUFBRSxvQkFBb0IsRUFBRSxNQUFNLFNBQVMsQ0FBQzs7TUFFekMsWUFBWSxHQUFHLG1CQUFtQjs7Ozs7QUFFeEMsTUFBTSxVQUFVLE1BQU0sQ0FBQyxTQUF1QixFQUFFO0lBQzlDOzs7Ozs7SUFBTyxVQUNMLE1BQVMsRUFDVCxZQUFlOztjQUVULFFBQVEscUJBQ1QscUJBQXFCLEVBQ3JCLE1BQU0sSUFBRSxnREFBZ0Q7WUFDM0QsWUFBWSxHQUNiO1FBQ0Qsc0JBQXNCLENBQUksTUFBTSxFQUFFLFFBQVEsQ0FBQyxDQUFDO0lBQzlDLENBQUMsRUFBQztBQUNKLENBQUM7Ozs7OztBQUVELE1BQU0sVUFBVSwwQkFBMEIsQ0FDeEMsUUFBVzs7VUFFTCxpQkFBaUIsR0FBd0IsT0FBTyxDQUNwRCx3QkFBd0IsRUFDeEIsb0JBQW9CLENBQ3JCLENBQUMsUUFBUSxDQUFDO0lBRVgsT0FBTyxpQkFBaUIsQ0FBQztBQUMzQixDQUFDOzs7Ozs7OztBQU1ELFNBQVMsa0JBQWtCLENBQ3pCLFdBQWM7SUFNZCxPQUFPLFdBQVcsQ0FBQyxXQUFXLENBQUMsY0FBYyxDQUFDLFlBQVksQ0FBQyxDQUFDO0FBQzlELENBQUM7Ozs7Ozs7O0FBR0QsU0FBUyxzQkFBc0IsQ0FDN0IsV0FBYyxFQUNkLFFBQTJCO0lBRTNCLElBQUksa0JBQWtCLENBQUMsV0FBVyxDQUFDLEVBQUU7UUFDbkMsV0FBVyxDQUFDLFdBQVcsQ0FBQyxZQUFZLENBQUMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7S0FDdEQ7U0FBTTtRQUNMLE1BQU0sQ0FBQyxjQUFjLENBQUMsV0FBVyxDQUFDLFdBQVcsRUFBRSxZQUFZLEVBQUU7WUFDM0QsS0FBSyxFQUFFLENBQUMsUUFBUSxDQUFDO1NBQ2xCLENBQUMsQ0FBQztLQUNKO0FBQ0gsQ0FBQzs7Ozs7O0FBRUQsU0FBUyx3QkFBd0IsQ0FDL0IsV0FBYztJQUVkLE9BQU8sa0JBQWtCLENBQUMsV0FBVyxDQUFDO1FBQ3BDLENBQUMsQ0FBQyxXQUFXLENBQUMsV0FBVyxDQUFDLFlBQVksQ0FBQztRQUN2QyxDQUFDLENBQUMsRUFBRSxDQUFDO0FBQ1QsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGNvbXBvc2UgfSBmcm9tICdAbmdyeC9zdG9yZSc7XG5cbmltcG9ydCB7XG4gIERFRkFVTFRfRUZGRUNUX0NPTkZJRyxcbiAgRWZmZWN0Q29uZmlnLFxuICBFZmZlY3RNZXRhZGF0YSxcbiAgRWZmZWN0UHJvcGVydHlLZXksXG59IGZyb20gJy4vbW9kZWxzJztcbmltcG9ydCB7IGdldFNvdXJjZUZvckluc3RhbmNlIH0gZnJvbSAnLi91dGlscyc7XG5cbmNvbnN0IE1FVEFEQVRBX0tFWSA9ICdfX0BuZ3J4L2VmZmVjdHNfXyc7XG5cbmV4cG9ydCBmdW5jdGlvbiBFZmZlY3QoY29uZmlnOiBFZmZlY3RDb25maWcgPSB7fSkge1xuICByZXR1cm4gZnVuY3Rpb248VCBleHRlbmRzIE9iamVjdCwgSyBleHRlbmRzIEVmZmVjdFByb3BlcnR5S2V5PFQ+PihcbiAgICB0YXJnZXQ6IFQsXG4gICAgcHJvcGVydHlOYW1lOiBLXG4gICkge1xuICAgIGNvbnN0IG1ldGFkYXRhOiBFZmZlY3RNZXRhZGF0YTxUPiA9IHtcbiAgICAgIC4uLkRFRkFVTFRfRUZGRUNUX0NPTkZJRyxcbiAgICAgIC4uLmNvbmZpZywgLy8gT3ZlcnJpZGVzIGFueSBkZWZhdWx0cyBpZiB2YWx1ZXMgYXJlIHByb3ZpZGVkXG4gICAgICBwcm9wZXJ0eU5hbWUsXG4gICAgfTtcbiAgICBhZGRFZmZlY3RNZXRhZGF0YUVudHJ5PFQ+KHRhcmdldCwgbWV0YWRhdGEpO1xuICB9O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0RWZmZWN0RGVjb3JhdG9yTWV0YWRhdGE8VD4oXG4gIGluc3RhbmNlOiBUXG4pOiBFZmZlY3RNZXRhZGF0YTxUPltdIHtcbiAgY29uc3QgZWZmZWN0c0RlY29yYXRvcnM6IEVmZmVjdE1ldGFkYXRhPFQ+W10gPSBjb21wb3NlKFxuICAgIGdldEVmZmVjdE1ldGFkYXRhRW50cmllcyxcbiAgICBnZXRTb3VyY2VGb3JJbnN0YW5jZVxuICApKGluc3RhbmNlKTtcblxuICByZXR1cm4gZWZmZWN0c0RlY29yYXRvcnM7XG59XG5cbi8qKlxuICogVHlwZSBndWFyZCB0byBkZXRlbWluZSB3aGV0aGVyIE1FVEFEQVRBX0tFWSBpcyBhbHJlYWR5IHByZXNlbnQgb24gdGhlIENsYXNzXG4gKiBjb25zdHJ1Y3RvclxuICovXG5mdW5jdGlvbiBoYXNNZXRhZGF0YUVudHJpZXM8VCBleHRlbmRzIE9iamVjdD4oXG4gIHNvdXJjZVByb3RvOiBUXG4pOiBzb3VyY2VQcm90byBpcyB0eXBlb2Ygc291cmNlUHJvdG8gJiB7XG4gIGNvbnN0cnVjdG9yOiB0eXBlb2Ygc291cmNlUHJvdG8uY29uc3RydWN0b3IgJiB7XG4gICAgW01FVEFEQVRBX0tFWV06IEVmZmVjdE1ldGFkYXRhPFQ+W107XG4gIH07XG59IHtcbiAgcmV0dXJuIHNvdXJjZVByb3RvLmNvbnN0cnVjdG9yLmhhc093blByb3BlcnR5KE1FVEFEQVRBX0tFWSk7XG59XG5cbi8qKiBBZGQgRWZmZWN0IE1ldGFkYXRhIHRvIHRoZSBFZmZlY3QgQ2xhc3MgY29uc3RydWN0b3IgdW5kZXIgc3BlY2lmaWMga2V5ICovXG5mdW5jdGlvbiBhZGRFZmZlY3RNZXRhZGF0YUVudHJ5PFQgZXh0ZW5kcyBvYmplY3Q+KFxuICBzb3VyY2VQcm90bzogVCxcbiAgbWV0YWRhdGE6IEVmZmVjdE1ldGFkYXRhPFQ+XG4pIHtcbiAgaWYgKGhhc01ldGFkYXRhRW50cmllcyhzb3VyY2VQcm90bykpIHtcbiAgICBzb3VyY2VQcm90by5jb25zdHJ1Y3RvcltNRVRBREFUQV9LRVldLnB1c2gobWV0YWRhdGEpO1xuICB9IGVsc2Uge1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShzb3VyY2VQcm90by5jb25zdHJ1Y3RvciwgTUVUQURBVEFfS0VZLCB7XG4gICAgICB2YWx1ZTogW21ldGFkYXRhXSxcbiAgICB9KTtcbiAgfVxufVxuXG5mdW5jdGlvbiBnZXRFZmZlY3RNZXRhZGF0YUVudHJpZXM8VCBleHRlbmRzIG9iamVjdD4oXG4gIHNvdXJjZVByb3RvOiBUXG4pOiBFZmZlY3RNZXRhZGF0YTxUPltdIHtcbiAgcmV0dXJuIGhhc01ldGFkYXRhRW50cmllcyhzb3VyY2VQcm90bylcbiAgICA/IHNvdXJjZVByb3RvLmNvbnN0cnVjdG9yW01FVEFEQVRBX0tFWV1cbiAgICA6IFtdO1xufVxuIl19