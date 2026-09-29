import * as tslib_1 from "tslib";
import { NgModule, Inject, Optional } from '@angular/core';
import { StoreRootModule, StoreFeatureModule } from '@ngrx/store';
import { EffectsRootModule } from './effects_root_module';
import { FEATURE_EFFECTS } from './tokens';
var EffectsFeatureModule = /** @class */ (function () {
    function EffectsFeatureModule(root, effectSourceGroups, storeRootModule, storeFeatureModule) {
        effectSourceGroups.forEach(function (group) {
            return group.forEach(function (effectSourceInstance) {
                return root.addEffects(effectSourceInstance);
            });
        });
    }
    EffectsFeatureModule = tslib_1.__decorate([
        NgModule({}),
        tslib_1.__param(1, Inject(FEATURE_EFFECTS)),
        tslib_1.__param(2, Optional()),
        tslib_1.__param(3, Optional()),
        tslib_1.__metadata("design:paramtypes", [EffectsRootModule, Array, StoreRootModule,
            StoreFeatureModule])
    ], EffectsFeatureModule);
    return EffectsFeatureModule;
}());
export { EffectsFeatureModule };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZWZmZWN0c19mZWF0dXJlX21vZHVsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL21vZHVsZXMvZWZmZWN0cy9zcmMvZWZmZWN0c19mZWF0dXJlX21vZHVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLEVBQUUsUUFBUSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQzNELE9BQU8sRUFBRSxlQUFlLEVBQUUsa0JBQWtCLEVBQUUsTUFBTSxhQUFhLENBQUM7QUFDbEUsT0FBTyxFQUFFLGlCQUFpQixFQUFFLE1BQU0sdUJBQXVCLENBQUM7QUFDMUQsT0FBTyxFQUFFLGVBQWUsRUFBRSxNQUFNLFVBQVUsQ0FBQztBQUczQztJQUNFLDhCQUNFLElBQXVCLEVBQ0Usa0JBQTJCLEVBQ3hDLGVBQWdDLEVBQ2hDLGtCQUFzQztRQUVsRCxrQkFBa0IsQ0FBQyxPQUFPLENBQUMsVUFBQSxLQUFLO1lBQzlCLE9BQUEsS0FBSyxDQUFDLE9BQU8sQ0FBQyxVQUFBLG9CQUFvQjtnQkFDaEMsT0FBQSxJQUFJLENBQUMsVUFBVSxDQUFDLG9CQUFvQixDQUFDO1lBQXJDLENBQXFDLENBQ3RDO1FBRkQsQ0FFQyxDQUNGLENBQUM7SUFDSixDQUFDO0lBWlUsb0JBQW9CO1FBRGhDLFFBQVEsQ0FBQyxFQUFFLENBQUM7UUFJUixtQkFBQSxNQUFNLENBQUMsZUFBZSxDQUFDLENBQUE7UUFDdkIsbUJBQUEsUUFBUSxFQUFFLENBQUE7UUFDVixtQkFBQSxRQUFRLEVBQUUsQ0FBQTtpREFITCxpQkFBaUIsU0FFTSxlQUFlO1lBQ1osa0JBQWtCO09BTHpDLG9CQUFvQixDQWFoQztJQUFELDJCQUFDO0NBQUEsQUFiRCxJQWFDO1NBYlksb0JBQW9CIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgTmdNb2R1bGUsIEluamVjdCwgT3B0aW9uYWwgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IFN0b3JlUm9vdE1vZHVsZSwgU3RvcmVGZWF0dXJlTW9kdWxlIH0gZnJvbSAnQG5ncngvc3RvcmUnO1xuaW1wb3J0IHsgRWZmZWN0c1Jvb3RNb2R1bGUgfSBmcm9tICcuL2VmZmVjdHNfcm9vdF9tb2R1bGUnO1xuaW1wb3J0IHsgRkVBVFVSRV9FRkZFQ1RTIH0gZnJvbSAnLi90b2tlbnMnO1xuXG5ATmdNb2R1bGUoe30pXG5leHBvcnQgY2xhc3MgRWZmZWN0c0ZlYXR1cmVNb2R1bGUge1xuICBjb25zdHJ1Y3RvcihcbiAgICByb290OiBFZmZlY3RzUm9vdE1vZHVsZSxcbiAgICBASW5qZWN0KEZFQVRVUkVfRUZGRUNUUykgZWZmZWN0U291cmNlR3JvdXBzOiBhbnlbXVtdLFxuICAgIEBPcHRpb25hbCgpIHN0b3JlUm9vdE1vZHVsZTogU3RvcmVSb290TW9kdWxlLFxuICAgIEBPcHRpb25hbCgpIHN0b3JlRmVhdHVyZU1vZHVsZTogU3RvcmVGZWF0dXJlTW9kdWxlXG4gICkge1xuICAgIGVmZmVjdFNvdXJjZUdyb3Vwcy5mb3JFYWNoKGdyb3VwID0+XG4gICAgICBncm91cC5mb3JFYWNoKGVmZmVjdFNvdXJjZUluc3RhbmNlID0+XG4gICAgICAgIHJvb3QuYWRkRWZmZWN0cyhlZmZlY3RTb3VyY2VJbnN0YW5jZSlcbiAgICAgIClcbiAgICApO1xuICB9XG59XG4iXX0=