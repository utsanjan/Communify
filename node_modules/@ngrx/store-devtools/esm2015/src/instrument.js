/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { InjectionToken, NgModule } from '@angular/core';
import { ReducerManagerDispatcher, StateObservable } from '@ngrx/store';
import { INITIAL_OPTIONS, STORE_DEVTOOLS_CONFIG, noMonitor, createConfig, } from './config';
import { StoreDevtools } from './devtools';
import { DevtoolsExtension, REDUX_DEVTOOLS_EXTENSION, } from './extension';
import { DevtoolsDispatcher } from './devtools-dispatcher';
/** @type {?} */
export const IS_EXTENSION_OR_MONITOR_PRESENT = new InjectionToken('Is Devtools Extension or Monitor Present');
/**
 * @param {?} extension
 * @param {?} config
 * @return {?}
 */
export function createIsExtensionOrMonitorPresent(extension, config) {
    return Boolean(extension) || config.monitor !== noMonitor;
}
/**
 * @return {?}
 */
export function createReduxDevtoolsExtension() {
    /** @type {?} */
    const extensionKey = '__REDUX_DEVTOOLS_EXTENSION__';
    if (typeof window === 'object' &&
        typeof ((/** @type {?} */ (window)))[extensionKey] !== 'undefined') {
        return ((/** @type {?} */ (window)))[extensionKey];
    }
    else {
        return null;
    }
}
/**
 * @param {?} devtools
 * @return {?}
 */
export function createStateObservable(devtools) {
    return devtools.state;
}
export class StoreDevtoolsModule {
    /**
     * @param {?=} options
     * @return {?}
     */
    static instrument(options = {}) {
        return {
            ngModule: StoreDevtoolsModule,
            providers: [
                DevtoolsExtension,
                DevtoolsDispatcher,
                StoreDevtools,
                {
                    provide: INITIAL_OPTIONS,
                    useValue: options,
                },
                {
                    provide: IS_EXTENSION_OR_MONITOR_PRESENT,
                    deps: [REDUX_DEVTOOLS_EXTENSION, STORE_DEVTOOLS_CONFIG],
                    useFactory: createIsExtensionOrMonitorPresent,
                },
                {
                    provide: REDUX_DEVTOOLS_EXTENSION,
                    useFactory: createReduxDevtoolsExtension,
                },
                {
                    provide: STORE_DEVTOOLS_CONFIG,
                    deps: [INITIAL_OPTIONS],
                    useFactory: createConfig,
                },
                {
                    provide: StateObservable,
                    deps: [StoreDevtools],
                    useFactory: createStateObservable,
                },
                {
                    provide: ReducerManagerDispatcher,
                    useExisting: DevtoolsDispatcher,
                },
            ],
        };
    }
}
StoreDevtoolsModule.decorators = [
    { type: NgModule, args: [{},] }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5zdHJ1bWVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL21vZHVsZXMvc3RvcmUtZGV2dG9vbHMvc3JjL2luc3RydW1lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLE9BQU8sRUFBRSxjQUFjLEVBQXVCLFFBQVEsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUM5RSxPQUFPLEVBQUUsd0JBQXdCLEVBQUUsZUFBZSxFQUFFLE1BQU0sYUFBYSxDQUFDO0FBR3hFLE9BQU8sRUFDTCxlQUFlLEVBQ2YscUJBQXFCLEVBR3JCLFNBQVMsRUFDVCxZQUFZLEdBQ2IsTUFBTSxVQUFVLENBQUM7QUFDbEIsT0FBTyxFQUFFLGFBQWEsRUFBRSxNQUFNLFlBQVksQ0FBQztBQUMzQyxPQUFPLEVBQ0wsaUJBQWlCLEVBQ2pCLHdCQUF3QixHQUV6QixNQUFNLGFBQWEsQ0FBQztBQUNyQixPQUFPLEVBQUUsa0JBQWtCLEVBQUUsTUFBTSx1QkFBdUIsQ0FBQzs7QUFFM0QsTUFBTSxPQUFPLCtCQUErQixHQUFHLElBQUksY0FBYyxDQUMvRCwwQ0FBMEMsQ0FDM0M7Ozs7OztBQUVELE1BQU0sVUFBVSxpQ0FBaUMsQ0FDL0MsU0FBd0MsRUFDeEMsTUFBMkI7SUFFM0IsT0FBTyxPQUFPLENBQUMsU0FBUyxDQUFDLElBQUksTUFBTSxDQUFDLE9BQU8sS0FBSyxTQUFTLENBQUM7QUFDNUQsQ0FBQzs7OztBQUVELE1BQU0sVUFBVSw0QkFBNEI7O1VBQ3BDLFlBQVksR0FBRyw4QkFBOEI7SUFFbkQsSUFDRSxPQUFPLE1BQU0sS0FBSyxRQUFRO1FBQzFCLE9BQU8sQ0FBQyxtQkFBQSxNQUFNLEVBQU8sQ0FBQyxDQUFDLFlBQVksQ0FBQyxLQUFLLFdBQVcsRUFDcEQ7UUFDQSxPQUFPLENBQUMsbUJBQUEsTUFBTSxFQUFPLENBQUMsQ0FBQyxZQUFZLENBQUMsQ0FBQztLQUN0QztTQUFNO1FBQ0wsT0FBTyxJQUFJLENBQUM7S0FDYjtBQUNILENBQUM7Ozs7O0FBRUQsTUFBTSxVQUFVLHFCQUFxQixDQUNuQyxRQUF1QjtJQUV2QixPQUFPLFFBQVEsQ0FBQyxLQUFLLENBQUM7QUFDeEIsQ0FBQztBQUdELE1BQU0sT0FBTyxtQkFBbUI7Ozs7O0lBQzlCLE1BQU0sQ0FBQyxVQUFVLENBQ2YsVUFBZ0MsRUFBRTtRQUVsQyxPQUFPO1lBQ0wsUUFBUSxFQUFFLG1CQUFtQjtZQUM3QixTQUFTLEVBQUU7Z0JBQ1QsaUJBQWlCO2dCQUNqQixrQkFBa0I7Z0JBQ2xCLGFBQWE7Z0JBQ2I7b0JBQ0UsT0FBTyxFQUFFLGVBQWU7b0JBQ3hCLFFBQVEsRUFBRSxPQUFPO2lCQUNsQjtnQkFDRDtvQkFDRSxPQUFPLEVBQUUsK0JBQStCO29CQUN4QyxJQUFJLEVBQUUsQ0FBQyx3QkFBd0IsRUFBRSxxQkFBcUIsQ0FBQztvQkFDdkQsVUFBVSxFQUFFLGlDQUFpQztpQkFDOUM7Z0JBQ0Q7b0JBQ0UsT0FBTyxFQUFFLHdCQUF3QjtvQkFDakMsVUFBVSxFQUFFLDRCQUE0QjtpQkFDekM7Z0JBQ0Q7b0JBQ0UsT0FBTyxFQUFFLHFCQUFxQjtvQkFDOUIsSUFBSSxFQUFFLENBQUMsZUFBZSxDQUFDO29CQUN2QixVQUFVLEVBQUUsWUFBWTtpQkFDekI7Z0JBQ0Q7b0JBQ0UsT0FBTyxFQUFFLGVBQWU7b0JBQ3hCLElBQUksRUFBRSxDQUFDLGFBQWEsQ0FBQztvQkFDckIsVUFBVSxFQUFFLHFCQUFxQjtpQkFDbEM7Z0JBQ0Q7b0JBQ0UsT0FBTyxFQUFFLHdCQUF3QjtvQkFDakMsV0FBVyxFQUFFLGtCQUFrQjtpQkFDaEM7YUFDRjtTQUNGLENBQUM7SUFDSixDQUFDOzs7WUF4Q0YsUUFBUSxTQUFDLEVBQUUiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmplY3Rpb25Ub2tlbiwgTW9kdWxlV2l0aFByb3ZpZGVycywgTmdNb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IFJlZHVjZXJNYW5hZ2VyRGlzcGF0Y2hlciwgU3RhdGVPYnNlcnZhYmxlIH0gZnJvbSAnQG5ncngvc3RvcmUnO1xuaW1wb3J0IHsgT2JzZXJ2YWJsZSB9IGZyb20gJ3J4anMnO1xuXG5pbXBvcnQge1xuICBJTklUSUFMX09QVElPTlMsXG4gIFNUT1JFX0RFVlRPT0xTX0NPTkZJRyxcbiAgU3RvcmVEZXZ0b29sc0NvbmZpZyxcbiAgU3RvcmVEZXZ0b29sc09wdGlvbnMsXG4gIG5vTW9uaXRvcixcbiAgY3JlYXRlQ29uZmlnLFxufSBmcm9tICcuL2NvbmZpZyc7XG5pbXBvcnQgeyBTdG9yZURldnRvb2xzIH0gZnJvbSAnLi9kZXZ0b29scyc7XG5pbXBvcnQge1xuICBEZXZ0b29sc0V4dGVuc2lvbixcbiAgUkVEVVhfREVWVE9PTFNfRVhURU5TSU9OLFxuICBSZWR1eERldnRvb2xzRXh0ZW5zaW9uLFxufSBmcm9tICcuL2V4dGVuc2lvbic7XG5pbXBvcnQgeyBEZXZ0b29sc0Rpc3BhdGNoZXIgfSBmcm9tICcuL2RldnRvb2xzLWRpc3BhdGNoZXInO1xuXG5leHBvcnQgY29uc3QgSVNfRVhURU5TSU9OX09SX01PTklUT1JfUFJFU0VOVCA9IG5ldyBJbmplY3Rpb25Ub2tlbjxib29sZWFuPihcbiAgJ0lzIERldnRvb2xzIEV4dGVuc2lvbiBvciBNb25pdG9yIFByZXNlbnQnXG4pO1xuXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlSXNFeHRlbnNpb25Pck1vbml0b3JQcmVzZW50KFxuICBleHRlbnNpb246IFJlZHV4RGV2dG9vbHNFeHRlbnNpb24gfCBudWxsLFxuICBjb25maWc6IFN0b3JlRGV2dG9vbHNDb25maWdcbikge1xuICByZXR1cm4gQm9vbGVhbihleHRlbnNpb24pIHx8IGNvbmZpZy5tb25pdG9yICE9PSBub01vbml0b3I7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVSZWR1eERldnRvb2xzRXh0ZW5zaW9uKCkge1xuICBjb25zdCBleHRlbnNpb25LZXkgPSAnX19SRURVWF9ERVZUT09MU19FWFRFTlNJT05fXyc7XG5cbiAgaWYgKFxuICAgIHR5cGVvZiB3aW5kb3cgPT09ICdvYmplY3QnICYmXG4gICAgdHlwZW9mICh3aW5kb3cgYXMgYW55KVtleHRlbnNpb25LZXldICE9PSAndW5kZWZpbmVkJ1xuICApIHtcbiAgICByZXR1cm4gKHdpbmRvdyBhcyBhbnkpW2V4dGVuc2lvbktleV07XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZVN0YXRlT2JzZXJ2YWJsZShcbiAgZGV2dG9vbHM6IFN0b3JlRGV2dG9vbHNcbik6IE9ic2VydmFibGU8YW55PiB7XG4gIHJldHVybiBkZXZ0b29scy5zdGF0ZTtcbn1cblxuQE5nTW9kdWxlKHt9KVxuZXhwb3J0IGNsYXNzIFN0b3JlRGV2dG9vbHNNb2R1bGUge1xuICBzdGF0aWMgaW5zdHJ1bWVudChcbiAgICBvcHRpb25zOiBTdG9yZURldnRvb2xzT3B0aW9ucyA9IHt9XG4gICk6IE1vZHVsZVdpdGhQcm92aWRlcnM8U3RvcmVEZXZ0b29sc01vZHVsZT4ge1xuICAgIHJldHVybiB7XG4gICAgICBuZ01vZHVsZTogU3RvcmVEZXZ0b29sc01vZHVsZSxcbiAgICAgIHByb3ZpZGVyczogW1xuICAgICAgICBEZXZ0b29sc0V4dGVuc2lvbixcbiAgICAgICAgRGV2dG9vbHNEaXNwYXRjaGVyLFxuICAgICAgICBTdG9yZURldnRvb2xzLFxuICAgICAgICB7XG4gICAgICAgICAgcHJvdmlkZTogSU5JVElBTF9PUFRJT05TLFxuICAgICAgICAgIHVzZVZhbHVlOiBvcHRpb25zLFxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgcHJvdmlkZTogSVNfRVhURU5TSU9OX09SX01PTklUT1JfUFJFU0VOVCxcbiAgICAgICAgICBkZXBzOiBbUkVEVVhfREVWVE9PTFNfRVhURU5TSU9OLCBTVE9SRV9ERVZUT09MU19DT05GSUddLFxuICAgICAgICAgIHVzZUZhY3Rvcnk6IGNyZWF0ZUlzRXh0ZW5zaW9uT3JNb25pdG9yUHJlc2VudCxcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIHByb3ZpZGU6IFJFRFVYX0RFVlRPT0xTX0VYVEVOU0lPTixcbiAgICAgICAgICB1c2VGYWN0b3J5OiBjcmVhdGVSZWR1eERldnRvb2xzRXh0ZW5zaW9uLFxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgcHJvdmlkZTogU1RPUkVfREVWVE9PTFNfQ09ORklHLFxuICAgICAgICAgIGRlcHM6IFtJTklUSUFMX09QVElPTlNdLFxuICAgICAgICAgIHVzZUZhY3Rvcnk6IGNyZWF0ZUNvbmZpZyxcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIHByb3ZpZGU6IFN0YXRlT2JzZXJ2YWJsZSxcbiAgICAgICAgICBkZXBzOiBbU3RvcmVEZXZ0b29sc10sXG4gICAgICAgICAgdXNlRmFjdG9yeTogY3JlYXRlU3RhdGVPYnNlcnZhYmxlLFxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgcHJvdmlkZTogUmVkdWNlck1hbmFnZXJEaXNwYXRjaGVyLFxuICAgICAgICAgIHVzZUV4aXN0aW5nOiBEZXZ0b29sc0Rpc3BhdGNoZXIsXG4gICAgICAgIH0sXG4gICAgICBdLFxuICAgIH07XG4gIH1cbn1cbiJdfQ==