import * as tslib_1 from "tslib";
import { NgModule, Optional, SkipSelf, } from '@angular/core';
import { EffectSources } from './effect_sources';
import { Actions } from './actions';
import { ROOT_EFFECTS, FEATURE_EFFECTS, _ROOT_EFFECTS_GUARD } from './tokens';
import { EffectsFeatureModule } from './effects_feature_module';
import { EffectsRootModule } from './effects_root_module';
import { EffectsRunner } from './effects_runner';
var EffectsModule = /** @class */ (function () {
    function EffectsModule() {
    }
    EffectsModule.forFeature = function (featureEffects) {
        return {
            ngModule: EffectsFeatureModule,
            providers: [
                featureEffects,
                {
                    provide: FEATURE_EFFECTS,
                    multi: true,
                    deps: featureEffects,
                    useFactory: createSourceInstances,
                },
            ],
        };
    };
    EffectsModule.forRoot = function (rootEffects) {
        return {
            ngModule: EffectsRootModule,
            providers: [
                {
                    provide: _ROOT_EFFECTS_GUARD,
                    useFactory: _provideForRootGuard,
                    deps: [[EffectsRunner, new Optional(), new SkipSelf()]],
                },
                EffectsRunner,
                EffectSources,
                Actions,
                rootEffects,
                {
                    provide: ROOT_EFFECTS,
                    deps: rootEffects,
                    useFactory: createSourceInstances,
                },
            ],
        };
    };
    EffectsModule = tslib_1.__decorate([
        NgModule({})
    ], EffectsModule);
    return EffectsModule;
}());
export { EffectsModule };
export function createSourceInstances() {
    var instances = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        instances[_i] = arguments[_i];
    }
    return instances;
}
export function _provideForRootGuard(runner) {
    if (runner) {
        throw new TypeError("EffectsModule.forRoot() called twice. Feature modules should use EffectsModule.forFeature() instead.");
    }
    return 'guarded';
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZWZmZWN0c19tb2R1bGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9tb2R1bGVzL2VmZmVjdHMvc3JjL2VmZmVjdHNfbW9kdWxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxPQUFPLEVBQ0wsUUFBUSxFQUdSLFFBQVEsRUFDUixRQUFRLEdBQ1QsTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUFFLGFBQWEsRUFBRSxNQUFNLGtCQUFrQixDQUFDO0FBQ2pELE9BQU8sRUFBRSxPQUFPLEVBQUUsTUFBTSxXQUFXLENBQUM7QUFDcEMsT0FBTyxFQUFFLFlBQVksRUFBRSxlQUFlLEVBQUUsbUJBQW1CLEVBQUUsTUFBTSxVQUFVLENBQUM7QUFDOUUsT0FBTyxFQUFFLG9CQUFvQixFQUFFLE1BQU0sMEJBQTBCLENBQUM7QUFDaEUsT0FBTyxFQUFFLGlCQUFpQixFQUFFLE1BQU0sdUJBQXVCLENBQUM7QUFDMUQsT0FBTyxFQUFFLGFBQWEsRUFBRSxNQUFNLGtCQUFrQixDQUFDO0FBR2pEO0lBQUE7SUF5Q0EsQ0FBQztJQXhDUSx3QkFBVSxHQUFqQixVQUNFLGNBQTJCO1FBRTNCLE9BQU87WUFDTCxRQUFRLEVBQUUsb0JBQW9CO1lBQzlCLFNBQVMsRUFBRTtnQkFDVCxjQUFjO2dCQUNkO29CQUNFLE9BQU8sRUFBRSxlQUFlO29CQUN4QixLQUFLLEVBQUUsSUFBSTtvQkFDWCxJQUFJLEVBQUUsY0FBYztvQkFDcEIsVUFBVSxFQUFFLHFCQUFxQjtpQkFDbEM7YUFDRjtTQUNGLENBQUM7SUFDSixDQUFDO0lBRU0scUJBQU8sR0FBZCxVQUNFLFdBQXdCO1FBRXhCLE9BQU87WUFDTCxRQUFRLEVBQUUsaUJBQWlCO1lBQzNCLFNBQVMsRUFBRTtnQkFDVDtvQkFDRSxPQUFPLEVBQUUsbUJBQW1CO29CQUM1QixVQUFVLEVBQUUsb0JBQW9CO29CQUNoQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLGFBQWEsRUFBRSxJQUFJLFFBQVEsRUFBRSxFQUFFLElBQUksUUFBUSxFQUFFLENBQUMsQ0FBQztpQkFDeEQ7Z0JBQ0QsYUFBYTtnQkFDYixhQUFhO2dCQUNiLE9BQU87Z0JBQ1AsV0FBVztnQkFDWDtvQkFDRSxPQUFPLEVBQUUsWUFBWTtvQkFDckIsSUFBSSxFQUFFLFdBQVc7b0JBQ2pCLFVBQVUsRUFBRSxxQkFBcUI7aUJBQ2xDO2FBQ0Y7U0FDRixDQUFDO0lBQ0osQ0FBQztJQXhDVSxhQUFhO1FBRHpCLFFBQVEsQ0FBQyxFQUFFLENBQUM7T0FDQSxhQUFhLENBeUN6QjtJQUFELG9CQUFDO0NBQUEsQUF6Q0QsSUF5Q0M7U0F6Q1ksYUFBYTtBQTJDMUIsTUFBTSxVQUFVLHFCQUFxQjtJQUFDLG1CQUFtQjtTQUFuQixVQUFtQixFQUFuQixxQkFBbUIsRUFBbkIsSUFBbUI7UUFBbkIsOEJBQW1COztJQUN2RCxPQUFPLFNBQVMsQ0FBQztBQUNuQixDQUFDO0FBRUQsTUFBTSxVQUFVLG9CQUFvQixDQUFDLE1BQXFCO0lBQ3hELElBQUksTUFBTSxFQUFFO1FBQ1YsTUFBTSxJQUFJLFNBQVMsQ0FDakIsc0dBQXNHLENBQ3ZHLENBQUM7S0FDSDtJQUNELE9BQU8sU0FBUyxDQUFDO0FBQ25CLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1xuICBOZ01vZHVsZSxcbiAgTW9kdWxlV2l0aFByb3ZpZGVycyxcbiAgVHlwZSxcbiAgT3B0aW9uYWwsXG4gIFNraXBTZWxmLFxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IEVmZmVjdFNvdXJjZXMgfSBmcm9tICcuL2VmZmVjdF9zb3VyY2VzJztcbmltcG9ydCB7IEFjdGlvbnMgfSBmcm9tICcuL2FjdGlvbnMnO1xuaW1wb3J0IHsgUk9PVF9FRkZFQ1RTLCBGRUFUVVJFX0VGRkVDVFMsIF9ST09UX0VGRkVDVFNfR1VBUkQgfSBmcm9tICcuL3Rva2Vucyc7XG5pbXBvcnQgeyBFZmZlY3RzRmVhdHVyZU1vZHVsZSB9IGZyb20gJy4vZWZmZWN0c19mZWF0dXJlX21vZHVsZSc7XG5pbXBvcnQgeyBFZmZlY3RzUm9vdE1vZHVsZSB9IGZyb20gJy4vZWZmZWN0c19yb290X21vZHVsZSc7XG5pbXBvcnQgeyBFZmZlY3RzUnVubmVyIH0gZnJvbSAnLi9lZmZlY3RzX3J1bm5lcic7XG5cbkBOZ01vZHVsZSh7fSlcbmV4cG9ydCBjbGFzcyBFZmZlY3RzTW9kdWxlIHtcbiAgc3RhdGljIGZvckZlYXR1cmUoXG4gICAgZmVhdHVyZUVmZmVjdHM6IFR5cGU8YW55PltdXG4gICk6IE1vZHVsZVdpdGhQcm92aWRlcnM8RWZmZWN0c0ZlYXR1cmVNb2R1bGU+IHtcbiAgICByZXR1cm4ge1xuICAgICAgbmdNb2R1bGU6IEVmZmVjdHNGZWF0dXJlTW9kdWxlLFxuICAgICAgcHJvdmlkZXJzOiBbXG4gICAgICAgIGZlYXR1cmVFZmZlY3RzLFxuICAgICAgICB7XG4gICAgICAgICAgcHJvdmlkZTogRkVBVFVSRV9FRkZFQ1RTLFxuICAgICAgICAgIG11bHRpOiB0cnVlLFxuICAgICAgICAgIGRlcHM6IGZlYXR1cmVFZmZlY3RzLFxuICAgICAgICAgIHVzZUZhY3Rvcnk6IGNyZWF0ZVNvdXJjZUluc3RhbmNlcyxcbiAgICAgICAgfSxcbiAgICAgIF0sXG4gICAgfTtcbiAgfVxuXG4gIHN0YXRpYyBmb3JSb290KFxuICAgIHJvb3RFZmZlY3RzOiBUeXBlPGFueT5bXVxuICApOiBNb2R1bGVXaXRoUHJvdmlkZXJzPEVmZmVjdHNSb290TW9kdWxlPiB7XG4gICAgcmV0dXJuIHtcbiAgICAgIG5nTW9kdWxlOiBFZmZlY3RzUm9vdE1vZHVsZSxcbiAgICAgIHByb3ZpZGVyczogW1xuICAgICAgICB7XG4gICAgICAgICAgcHJvdmlkZTogX1JPT1RfRUZGRUNUU19HVUFSRCxcbiAgICAgICAgICB1c2VGYWN0b3J5OiBfcHJvdmlkZUZvclJvb3RHdWFyZCxcbiAgICAgICAgICBkZXBzOiBbW0VmZmVjdHNSdW5uZXIsIG5ldyBPcHRpb25hbCgpLCBuZXcgU2tpcFNlbGYoKV1dLFxuICAgICAgICB9LFxuICAgICAgICBFZmZlY3RzUnVubmVyLFxuICAgICAgICBFZmZlY3RTb3VyY2VzLFxuICAgICAgICBBY3Rpb25zLFxuICAgICAgICByb290RWZmZWN0cyxcbiAgICAgICAge1xuICAgICAgICAgIHByb3ZpZGU6IFJPT1RfRUZGRUNUUyxcbiAgICAgICAgICBkZXBzOiByb290RWZmZWN0cyxcbiAgICAgICAgICB1c2VGYWN0b3J5OiBjcmVhdGVTb3VyY2VJbnN0YW5jZXMsXG4gICAgICAgIH0sXG4gICAgICBdLFxuICAgIH07XG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZVNvdXJjZUluc3RhbmNlcyguLi5pbnN0YW5jZXM6IGFueVtdKSB7XG4gIHJldHVybiBpbnN0YW5jZXM7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBfcHJvdmlkZUZvclJvb3RHdWFyZChydW5uZXI6IEVmZmVjdHNSdW5uZXIpOiBhbnkge1xuICBpZiAocnVubmVyKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcbiAgICAgIGBFZmZlY3RzTW9kdWxlLmZvclJvb3QoKSBjYWxsZWQgdHdpY2UuIEZlYXR1cmUgbW9kdWxlcyBzaG91bGQgdXNlIEVmZmVjdHNNb2R1bGUuZm9yRmVhdHVyZSgpIGluc3RlYWQuYFxuICAgICk7XG4gIH1cbiAgcmV0dXJuICdndWFyZGVkJztcbn1cbiJdfQ==