/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { NgModule, Optional, SkipSelf, } from '@angular/core';
import { EffectSources } from './effect_sources';
import { Actions } from './actions';
import { ROOT_EFFECTS, FEATURE_EFFECTS, _ROOT_EFFECTS_GUARD } from './tokens';
import { EffectsFeatureModule } from './effects_feature_module';
import { EffectsRootModule } from './effects_root_module';
import { EffectsRunner } from './effects_runner';
export class EffectsModule {
    /**
     * @param {?} featureEffects
     * @return {?}
     */
    static forFeature(featureEffects) {
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
    }
    /**
     * @param {?} rootEffects
     * @return {?}
     */
    static forRoot(rootEffects) {
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
    }
}
EffectsModule.decorators = [
    { type: NgModule, args: [{},] }
];
/**
 * @param {...?} instances
 * @return {?}
 */
export function createSourceInstances(...instances) {
    return instances;
}
/**
 * @param {?} runner
 * @return {?}
 */
export function _provideForRootGuard(runner) {
    if (runner) {
        throw new TypeError(`EffectsModule.forRoot() called twice. Feature modules should use EffectsModule.forFeature() instead.`);
    }
    return 'guarded';
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZWZmZWN0c19tb2R1bGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9tb2R1bGVzL2VmZmVjdHMvc3JjL2VmZmVjdHNfbW9kdWxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7QUFBQSxPQUFPLEVBQ0wsUUFBUSxFQUdSLFFBQVEsRUFDUixRQUFRLEdBQ1QsTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUFFLGFBQWEsRUFBRSxNQUFNLGtCQUFrQixDQUFDO0FBQ2pELE9BQU8sRUFBRSxPQUFPLEVBQUUsTUFBTSxXQUFXLENBQUM7QUFDcEMsT0FBTyxFQUFFLFlBQVksRUFBRSxlQUFlLEVBQUUsbUJBQW1CLEVBQUUsTUFBTSxVQUFVLENBQUM7QUFDOUUsT0FBTyxFQUFFLG9CQUFvQixFQUFFLE1BQU0sMEJBQTBCLENBQUM7QUFDaEUsT0FBTyxFQUFFLGlCQUFpQixFQUFFLE1BQU0sdUJBQXVCLENBQUM7QUFDMUQsT0FBTyxFQUFFLGFBQWEsRUFBRSxNQUFNLGtCQUFrQixDQUFDO0FBR2pELE1BQU0sT0FBTyxhQUFhOzs7OztJQUN4QixNQUFNLENBQUMsVUFBVSxDQUNmLGNBQTJCO1FBRTNCLE9BQU87WUFDTCxRQUFRLEVBQUUsb0JBQW9CO1lBQzlCLFNBQVMsRUFBRTtnQkFDVCxjQUFjO2dCQUNkO29CQUNFLE9BQU8sRUFBRSxlQUFlO29CQUN4QixLQUFLLEVBQUUsSUFBSTtvQkFDWCxJQUFJLEVBQUUsY0FBYztvQkFDcEIsVUFBVSxFQUFFLHFCQUFxQjtpQkFDbEM7YUFDRjtTQUNGLENBQUM7SUFDSixDQUFDOzs7OztJQUVELE1BQU0sQ0FBQyxPQUFPLENBQ1osV0FBd0I7UUFFeEIsT0FBTztZQUNMLFFBQVEsRUFBRSxpQkFBaUI7WUFDM0IsU0FBUyxFQUFFO2dCQUNUO29CQUNFLE9BQU8sRUFBRSxtQkFBbUI7b0JBQzVCLFVBQVUsRUFBRSxvQkFBb0I7b0JBQ2hDLElBQUksRUFBRSxDQUFDLENBQUMsYUFBYSxFQUFFLElBQUksUUFBUSxFQUFFLEVBQUUsSUFBSSxRQUFRLEVBQUUsQ0FBQyxDQUFDO2lCQUN4RDtnQkFDRCxhQUFhO2dCQUNiLGFBQWE7Z0JBQ2IsT0FBTztnQkFDUCxXQUFXO2dCQUNYO29CQUNFLE9BQU8sRUFBRSxZQUFZO29CQUNyQixJQUFJLEVBQUUsV0FBVztvQkFDakIsVUFBVSxFQUFFLHFCQUFxQjtpQkFDbEM7YUFDRjtTQUNGLENBQUM7SUFDSixDQUFDOzs7WUF6Q0YsUUFBUSxTQUFDLEVBQUU7Ozs7OztBQTRDWixNQUFNLFVBQVUscUJBQXFCLENBQUMsR0FBRyxTQUFnQjtJQUN2RCxPQUFPLFNBQVMsQ0FBQztBQUNuQixDQUFDOzs7OztBQUVELE1BQU0sVUFBVSxvQkFBb0IsQ0FBQyxNQUFxQjtJQUN4RCxJQUFJLE1BQU0sRUFBRTtRQUNWLE1BQU0sSUFBSSxTQUFTLENBQ2pCLHNHQUFzRyxDQUN2RyxDQUFDO0tBQ0g7SUFDRCxPQUFPLFNBQVMsQ0FBQztBQUNuQixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtcbiAgTmdNb2R1bGUsXG4gIE1vZHVsZVdpdGhQcm92aWRlcnMsXG4gIFR5cGUsXG4gIE9wdGlvbmFsLFxuICBTa2lwU2VsZixcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBFZmZlY3RTb3VyY2VzIH0gZnJvbSAnLi9lZmZlY3Rfc291cmNlcyc7XG5pbXBvcnQgeyBBY3Rpb25zIH0gZnJvbSAnLi9hY3Rpb25zJztcbmltcG9ydCB7IFJPT1RfRUZGRUNUUywgRkVBVFVSRV9FRkZFQ1RTLCBfUk9PVF9FRkZFQ1RTX0dVQVJEIH0gZnJvbSAnLi90b2tlbnMnO1xuaW1wb3J0IHsgRWZmZWN0c0ZlYXR1cmVNb2R1bGUgfSBmcm9tICcuL2VmZmVjdHNfZmVhdHVyZV9tb2R1bGUnO1xuaW1wb3J0IHsgRWZmZWN0c1Jvb3RNb2R1bGUgfSBmcm9tICcuL2VmZmVjdHNfcm9vdF9tb2R1bGUnO1xuaW1wb3J0IHsgRWZmZWN0c1J1bm5lciB9IGZyb20gJy4vZWZmZWN0c19ydW5uZXInO1xuXG5ATmdNb2R1bGUoe30pXG5leHBvcnQgY2xhc3MgRWZmZWN0c01vZHVsZSB7XG4gIHN0YXRpYyBmb3JGZWF0dXJlKFxuICAgIGZlYXR1cmVFZmZlY3RzOiBUeXBlPGFueT5bXVxuICApOiBNb2R1bGVXaXRoUHJvdmlkZXJzPEVmZmVjdHNGZWF0dXJlTW9kdWxlPiB7XG4gICAgcmV0dXJuIHtcbiAgICAgIG5nTW9kdWxlOiBFZmZlY3RzRmVhdHVyZU1vZHVsZSxcbiAgICAgIHByb3ZpZGVyczogW1xuICAgICAgICBmZWF0dXJlRWZmZWN0cyxcbiAgICAgICAge1xuICAgICAgICAgIHByb3ZpZGU6IEZFQVRVUkVfRUZGRUNUUyxcbiAgICAgICAgICBtdWx0aTogdHJ1ZSxcbiAgICAgICAgICBkZXBzOiBmZWF0dXJlRWZmZWN0cyxcbiAgICAgICAgICB1c2VGYWN0b3J5OiBjcmVhdGVTb3VyY2VJbnN0YW5jZXMsXG4gICAgICAgIH0sXG4gICAgICBdLFxuICAgIH07XG4gIH1cblxuICBzdGF0aWMgZm9yUm9vdChcbiAgICByb290RWZmZWN0czogVHlwZTxhbnk+W11cbiAgKTogTW9kdWxlV2l0aFByb3ZpZGVyczxFZmZlY3RzUm9vdE1vZHVsZT4ge1xuICAgIHJldHVybiB7XG4gICAgICBuZ01vZHVsZTogRWZmZWN0c1Jvb3RNb2R1bGUsXG4gICAgICBwcm92aWRlcnM6IFtcbiAgICAgICAge1xuICAgICAgICAgIHByb3ZpZGU6IF9ST09UX0VGRkVDVFNfR1VBUkQsXG4gICAgICAgICAgdXNlRmFjdG9yeTogX3Byb3ZpZGVGb3JSb290R3VhcmQsXG4gICAgICAgICAgZGVwczogW1tFZmZlY3RzUnVubmVyLCBuZXcgT3B0aW9uYWwoKSwgbmV3IFNraXBTZWxmKCldXSxcbiAgICAgICAgfSxcbiAgICAgICAgRWZmZWN0c1J1bm5lcixcbiAgICAgICAgRWZmZWN0U291cmNlcyxcbiAgICAgICAgQWN0aW9ucyxcbiAgICAgICAgcm9vdEVmZmVjdHMsXG4gICAgICAgIHtcbiAgICAgICAgICBwcm92aWRlOiBST09UX0VGRkVDVFMsXG4gICAgICAgICAgZGVwczogcm9vdEVmZmVjdHMsXG4gICAgICAgICAgdXNlRmFjdG9yeTogY3JlYXRlU291cmNlSW5zdGFuY2VzLFxuICAgICAgICB9LFxuICAgICAgXSxcbiAgICB9O1xuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVTb3VyY2VJbnN0YW5jZXMoLi4uaW5zdGFuY2VzOiBhbnlbXSkge1xuICByZXR1cm4gaW5zdGFuY2VzO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gX3Byb3ZpZGVGb3JSb290R3VhcmQocnVubmVyOiBFZmZlY3RzUnVubmVyKTogYW55IHtcbiAgaWYgKHJ1bm5lcikge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXG4gICAgICBgRWZmZWN0c01vZHVsZS5mb3JSb290KCkgY2FsbGVkIHR3aWNlLiBGZWF0dXJlIG1vZHVsZXMgc2hvdWxkIHVzZSBFZmZlY3RzTW9kdWxlLmZvckZlYXR1cmUoKSBpbnN0ZWFkLmBcbiAgICApO1xuICB9XG4gIHJldHVybiAnZ3VhcmRlZCc7XG59XG4iXX0=