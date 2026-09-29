/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { getCreateEffectMetadata } from './effect_creator';
import { getEffectDecoratorMetadata } from './effect_decorator';
/**
 * @template T
 * @param {?} instance
 * @return {?}
 */
export function getEffectsMetadata(instance) {
    return getSourceMetadata(instance).reduce((/**
     * @param {?} acc
     * @param {?} __1
     * @return {?}
     */
    (acc, { propertyName, dispatch, resubscribeOnError }) => {
        acc[propertyName] = { dispatch, resubscribeOnError };
        return acc;
    }), {});
}
/**
 * @template T
 * @param {?} instance
 * @return {?}
 */
export function getSourceMetadata(instance) {
    /** @type {?} */
    const effects = [
        getEffectDecoratorMetadata,
        getCreateEffectMetadata,
    ];
    return effects.reduce((/**
     * @param {?} sources
     * @param {?} source
     * @return {?}
     */
    (sources, source) => sources.concat(source(instance))), []);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZWZmZWN0c19tZXRhZGF0YS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL21vZHVsZXMvZWZmZWN0cy9zcmMvZWZmZWN0c19tZXRhZGF0YS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0FBQ0EsT0FBTyxFQUFFLHVCQUF1QixFQUFFLE1BQU0sa0JBQWtCLENBQUM7QUFDM0QsT0FBTyxFQUFFLDBCQUEwQixFQUFFLE1BQU0sb0JBQW9CLENBQUM7Ozs7OztBQUVoRSxNQUFNLFVBQVUsa0JBQWtCLENBQUksUUFBVztJQUMvQyxPQUFPLGlCQUFpQixDQUFDLFFBQVEsQ0FBQyxDQUFDLE1BQU07Ozs7O0lBQ3ZDLENBQ0UsR0FBdUIsRUFDdkIsRUFBRSxZQUFZLEVBQUUsUUFBUSxFQUFFLGtCQUFrQixFQUFFLEVBQzlDLEVBQUU7UUFDRixHQUFHLENBQUMsWUFBWSxDQUFDLEdBQUcsRUFBRSxRQUFRLEVBQUUsa0JBQWtCLEVBQUUsQ0FBQztRQUNyRCxPQUFPLEdBQUcsQ0FBQztJQUNiLENBQUMsR0FDRCxFQUFFLENBQ0gsQ0FBQztBQUNKLENBQUM7Ozs7OztBQUVELE1BQU0sVUFBVSxpQkFBaUIsQ0FBSSxRQUFXOztVQUN4QyxPQUFPLEdBQWdEO1FBQzNELDBCQUEwQjtRQUMxQix1QkFBdUI7S0FDeEI7SUFFRCxPQUFPLE9BQU8sQ0FBQyxNQUFNOzs7OztJQUNuQixDQUFDLE9BQU8sRUFBRSxNQUFNLEVBQUUsRUFBRSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDLEdBQ3JELEVBQUUsQ0FDSCxDQUFDO0FBQ0osQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEVmZmVjdE1ldGFkYXRhLCBFZmZlY3RzTWV0YWRhdGEgfSBmcm9tICcuL21vZGVscyc7XG5pbXBvcnQgeyBnZXRDcmVhdGVFZmZlY3RNZXRhZGF0YSB9IGZyb20gJy4vZWZmZWN0X2NyZWF0b3InO1xuaW1wb3J0IHsgZ2V0RWZmZWN0RGVjb3JhdG9yTWV0YWRhdGEgfSBmcm9tICcuL2VmZmVjdF9kZWNvcmF0b3InO1xuXG5leHBvcnQgZnVuY3Rpb24gZ2V0RWZmZWN0c01ldGFkYXRhPFQ+KGluc3RhbmNlOiBUKTogRWZmZWN0c01ldGFkYXRhPFQ+IHtcbiAgcmV0dXJuIGdldFNvdXJjZU1ldGFkYXRhKGluc3RhbmNlKS5yZWR1Y2UoXG4gICAgKFxuICAgICAgYWNjOiBFZmZlY3RzTWV0YWRhdGE8VD4sXG4gICAgICB7IHByb3BlcnR5TmFtZSwgZGlzcGF0Y2gsIHJlc3Vic2NyaWJlT25FcnJvciB9XG4gICAgKSA9PiB7XG4gICAgICBhY2NbcHJvcGVydHlOYW1lXSA9IHsgZGlzcGF0Y2gsIHJlc3Vic2NyaWJlT25FcnJvciB9O1xuICAgICAgcmV0dXJuIGFjYztcbiAgICB9LFxuICAgIHt9XG4gICk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRTb3VyY2VNZXRhZGF0YTxUPihpbnN0YW5jZTogVCk6IEVmZmVjdE1ldGFkYXRhPFQ+W10ge1xuICBjb25zdCBlZmZlY3RzOiBBcnJheTwoaW5zdGFuY2U6IFQpID0+IEVmZmVjdE1ldGFkYXRhPFQ+W10+ID0gW1xuICAgIGdldEVmZmVjdERlY29yYXRvck1ldGFkYXRhLFxuICAgIGdldENyZWF0ZUVmZmVjdE1ldGFkYXRhLFxuICBdO1xuXG4gIHJldHVybiBlZmZlY3RzLnJlZHVjZTxFZmZlY3RNZXRhZGF0YTxUPltdPihcbiAgICAoc291cmNlcywgc291cmNlKSA9PiBzb3VyY2VzLmNvbmNhdChzb3VyY2UoaW5zdGFuY2UpKSxcbiAgICBbXVxuICApO1xufVxuIl19