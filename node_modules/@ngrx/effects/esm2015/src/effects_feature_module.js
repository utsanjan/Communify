/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { NgModule, Inject, Optional } from '@angular/core';
import { StoreRootModule, StoreFeatureModule } from '@ngrx/store';
import { EffectsRootModule } from './effects_root_module';
import { FEATURE_EFFECTS } from './tokens';
export class EffectsFeatureModule {
    /**
     * @param {?} root
     * @param {?} effectSourceGroups
     * @param {?} storeRootModule
     * @param {?} storeFeatureModule
     */
    constructor(root, effectSourceGroups, storeRootModule, storeFeatureModule) {
        effectSourceGroups.forEach((/**
         * @param {?} group
         * @return {?}
         */
        group => group.forEach((/**
         * @param {?} effectSourceInstance
         * @return {?}
         */
        effectSourceInstance => root.addEffects(effectSourceInstance)))));
    }
}
EffectsFeatureModule.decorators = [
    { type: NgModule, args: [{},] }
];
/** @nocollapse */
EffectsFeatureModule.ctorParameters = () => [
    { type: EffectsRootModule },
    { type: Array, decorators: [{ type: Inject, args: [FEATURE_EFFECTS,] }] },
    { type: StoreRootModule, decorators: [{ type: Optional }] },
    { type: StoreFeatureModule, decorators: [{ type: Optional }] }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZWZmZWN0c19mZWF0dXJlX21vZHVsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL21vZHVsZXMvZWZmZWN0cy9zcmMvZWZmZWN0c19mZWF0dXJlX21vZHVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0FBQUEsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLEVBQUUsUUFBUSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQzNELE9BQU8sRUFBRSxlQUFlLEVBQUUsa0JBQWtCLEVBQUUsTUFBTSxhQUFhLENBQUM7QUFDbEUsT0FBTyxFQUFFLGlCQUFpQixFQUFFLE1BQU0sdUJBQXVCLENBQUM7QUFDMUQsT0FBTyxFQUFFLGVBQWUsRUFBRSxNQUFNLFVBQVUsQ0FBQztBQUczQyxNQUFNLE9BQU8sb0JBQW9COzs7Ozs7O0lBQy9CLFlBQ0UsSUFBdUIsRUFDRSxrQkFBMkIsRUFDeEMsZUFBZ0MsRUFDaEMsa0JBQXNDO1FBRWxELGtCQUFrQixDQUFDLE9BQU87Ozs7UUFBQyxLQUFLLENBQUMsRUFBRSxDQUNqQyxLQUFLLENBQUMsT0FBTzs7OztRQUFDLG9CQUFvQixDQUFDLEVBQUUsQ0FDbkMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxvQkFBb0IsQ0FBQyxFQUN0QyxFQUNGLENBQUM7SUFDSixDQUFDOzs7WUFiRixRQUFRLFNBQUMsRUFBRTs7OztZQUhILGlCQUFpQjt3Q0FPckIsTUFBTSxTQUFDLGVBQWU7WUFSbEIsZUFBZSx1QkFTbkIsUUFBUTtZQVRhLGtCQUFrQix1QkFVdkMsUUFBUSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IE5nTW9kdWxlLCBJbmplY3QsIE9wdGlvbmFsIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBTdG9yZVJvb3RNb2R1bGUsIFN0b3JlRmVhdHVyZU1vZHVsZSB9IGZyb20gJ0BuZ3J4L3N0b3JlJztcbmltcG9ydCB7IEVmZmVjdHNSb290TW9kdWxlIH0gZnJvbSAnLi9lZmZlY3RzX3Jvb3RfbW9kdWxlJztcbmltcG9ydCB7IEZFQVRVUkVfRUZGRUNUUyB9IGZyb20gJy4vdG9rZW5zJztcblxuQE5nTW9kdWxlKHt9KVxuZXhwb3J0IGNsYXNzIEVmZmVjdHNGZWF0dXJlTW9kdWxlIHtcbiAgY29uc3RydWN0b3IoXG4gICAgcm9vdDogRWZmZWN0c1Jvb3RNb2R1bGUsXG4gICAgQEluamVjdChGRUFUVVJFX0VGRkVDVFMpIGVmZmVjdFNvdXJjZUdyb3VwczogYW55W11bXSxcbiAgICBAT3B0aW9uYWwoKSBzdG9yZVJvb3RNb2R1bGU6IFN0b3JlUm9vdE1vZHVsZSxcbiAgICBAT3B0aW9uYWwoKSBzdG9yZUZlYXR1cmVNb2R1bGU6IFN0b3JlRmVhdHVyZU1vZHVsZVxuICApIHtcbiAgICBlZmZlY3RTb3VyY2VHcm91cHMuZm9yRWFjaChncm91cCA9PlxuICAgICAgZ3JvdXAuZm9yRWFjaChlZmZlY3RTb3VyY2VJbnN0YW5jZSA9PlxuICAgICAgICByb290LmFkZEVmZmVjdHMoZWZmZWN0U291cmNlSW5zdGFuY2UpXG4gICAgICApXG4gICAgKTtcbiAgfVxufVxuIl19