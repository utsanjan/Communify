/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { InjectionToken } from '@angular/core';
/**
 * @record
 */
export function DevToolsFeatureOptions() { }
if (false) {
    /** @type {?|undefined} */
    DevToolsFeatureOptions.prototype.pause;
    /** @type {?|undefined} */
    DevToolsFeatureOptions.prototype.lock;
    /** @type {?|undefined} */
    DevToolsFeatureOptions.prototype.persist;
    /** @type {?|undefined} */
    DevToolsFeatureOptions.prototype.export;
    /** @type {?|undefined} */
    DevToolsFeatureOptions.prototype.import;
    /** @type {?|undefined} */
    DevToolsFeatureOptions.prototype.jump;
    /** @type {?|undefined} */
    DevToolsFeatureOptions.prototype.skip;
    /** @type {?|undefined} */
    DevToolsFeatureOptions.prototype.reorder;
    /** @type {?|undefined} */
    DevToolsFeatureOptions.prototype.dispatch;
    /** @type {?|undefined} */
    DevToolsFeatureOptions.prototype.test;
}
export class StoreDevtoolsConfig {
}
if (false) {
    /** @type {?} */
    StoreDevtoolsConfig.prototype.maxAge;
    /** @type {?} */
    StoreDevtoolsConfig.prototype.monitor;
    /** @type {?} */
    StoreDevtoolsConfig.prototype.actionSanitizer;
    /** @type {?} */
    StoreDevtoolsConfig.prototype.stateSanitizer;
    /** @type {?} */
    StoreDevtoolsConfig.prototype.name;
    /** @type {?} */
    StoreDevtoolsConfig.prototype.serialize;
    /** @type {?} */
    StoreDevtoolsConfig.prototype.logOnly;
    /** @type {?} */
    StoreDevtoolsConfig.prototype.features;
    /** @type {?} */
    StoreDevtoolsConfig.prototype.actionsBlocklist;
    /** @type {?} */
    StoreDevtoolsConfig.prototype.actionsSafelist;
    /** @type {?} */
    StoreDevtoolsConfig.prototype.predicate;
}
/** @type {?} */
export const STORE_DEVTOOLS_CONFIG = new InjectionToken('@ngrx/devtools Options');
/** @type {?} */
export const INITIAL_OPTIONS = new InjectionToken('@ngrx/devtools Initial Config');
/**
 * @return {?}
 */
export function noMonitor() {
    return null;
}
/** @type {?} */
export const DEFAULT_NAME = 'NgRx Store DevTools';
/**
 * @param {?} _options
 * @return {?}
 */
export function createConfig(_options) {
    /** @type {?} */
    const DEFAULT_OPTIONS = {
        maxAge: false,
        monitor: noMonitor,
        actionSanitizer: undefined,
        stateSanitizer: undefined,
        name: DEFAULT_NAME,
        serialize: false,
        logOnly: false,
        // Add all features explicitly. This prevent buggy behavior for
        // options like "lock" which might otherwise not show up.
        features: {
            pause: true,
            // start/pause recording of dispatched actions
            lock: true,
            // lock/unlock dispatching actions and side effects
            persist: true,
            // persist states on page reloading
            export: true,
            // export history of actions in a file
            import: 'custom',
            // import history of actions from a file
            jump: true,
            // jump back and forth (time travelling)
            skip: true,
            // skip (cancel) actions
            reorder: true,
            // drag and drop actions in the history list
            dispatch: true,
            // dispatch custom actions or action creators
            test: true,
        },
    };
    /** @type {?} */
    let options = typeof _options === 'function' ? _options() : _options;
    /** @type {?} */
    const logOnly = options.logOnly
        ? { pause: true, export: true, test: true }
        : false;
    /** @type {?} */
    const features = options.features || logOnly || DEFAULT_OPTIONS.features;
    /** @type {?} */
    const config = Object.assign({}, DEFAULT_OPTIONS, { features }, options);
    if (config.maxAge && config.maxAge < 2) {
        throw new Error(`Devtools 'maxAge' cannot be less than 2, got ${config.maxAge}`);
    }
    return config;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29uZmlnLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vbW9kdWxlcy9zdG9yZS1kZXZ0b29scy9zcmMvY29uZmlnLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7QUFDQSxPQUFPLEVBQUUsY0FBYyxFQUFFLE1BQU0sZUFBZSxDQUFDOzs7O0FBWS9DLDRDQVdDOzs7SUFWQyx1Q0FBZ0I7O0lBQ2hCLHNDQUFlOztJQUNmLHlDQUFrQjs7SUFDbEIsd0NBQWlCOztJQUNqQix3Q0FBNEI7O0lBQzVCLHNDQUFlOztJQUNmLHNDQUFlOztJQUNmLHlDQUFrQjs7SUFDbEIsMENBQW1COztJQUNuQixzQ0FBZTs7QUFHakIsTUFBTSxPQUFPLG1CQUFtQjtDQVkvQjs7O0lBWEMscUNBQXVCOztJQUN2QixzQ0FBaUM7O0lBQ2pDLDhDQUFrQzs7SUFDbEMsNkNBQWdDOztJQUNoQyxtQ0FBYzs7SUFDZCx3Q0FBMkM7O0lBQzNDLHNDQUFrQjs7SUFDbEIsdUNBQWtDOztJQUNsQywrQ0FBNEI7O0lBQzVCLDhDQUEyQjs7SUFDM0Isd0NBQXNCOzs7QUFHeEIsTUFBTSxPQUFPLHFCQUFxQixHQUFHLElBQUksY0FBYyxDQUNyRCx3QkFBd0IsQ0FDekI7O0FBQ0QsTUFBTSxPQUFPLGVBQWUsR0FBRyxJQUFJLGNBQWMsQ0FDL0MsK0JBQStCLENBQ2hDOzs7O0FBTUQsTUFBTSxVQUFVLFNBQVM7SUFDdkIsT0FBTyxJQUFJLENBQUM7QUFDZCxDQUFDOztBQUVELE1BQU0sT0FBTyxZQUFZLEdBQUcscUJBQXFCOzs7OztBQUVqRCxNQUFNLFVBQVUsWUFBWSxDQUMxQixRQUE4Qjs7VUFFeEIsZUFBZSxHQUF3QjtRQUMzQyxNQUFNLEVBQUUsS0FBSztRQUNiLE9BQU8sRUFBRSxTQUFTO1FBQ2xCLGVBQWUsRUFBRSxTQUFTO1FBQzFCLGNBQWMsRUFBRSxTQUFTO1FBQ3pCLElBQUksRUFBRSxZQUFZO1FBQ2xCLFNBQVMsRUFBRSxLQUFLO1FBQ2hCLE9BQU8sRUFBRSxLQUFLOzs7UUFHZCxRQUFRLEVBQUU7WUFDUixLQUFLLEVBQUUsSUFBSTs7WUFDWCxJQUFJLEVBQUUsSUFBSTs7WUFDVixPQUFPLEVBQUUsSUFBSTs7WUFDYixNQUFNLEVBQUUsSUFBSTs7WUFDWixNQUFNLEVBQUUsUUFBUTs7WUFDaEIsSUFBSSxFQUFFLElBQUk7O1lBQ1YsSUFBSSxFQUFFLElBQUk7O1lBQ1YsT0FBTyxFQUFFLElBQUk7O1lBQ2IsUUFBUSxFQUFFLElBQUk7O1lBQ2QsSUFBSSxFQUFFLElBQUk7U0FDWDtLQUNGOztRQUVHLE9BQU8sR0FBRyxPQUFPLFFBQVEsS0FBSyxVQUFVLENBQUMsQ0FBQyxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUMsQ0FBQyxRQUFROztVQUM5RCxPQUFPLEdBQUcsT0FBTyxDQUFDLE9BQU87UUFDN0IsQ0FBQyxDQUFDLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUU7UUFDM0MsQ0FBQyxDQUFDLEtBQUs7O1VBQ0gsUUFBUSxHQUFHLE9BQU8sQ0FBQyxRQUFRLElBQUksT0FBTyxJQUFJLGVBQWUsQ0FBQyxRQUFROztVQUNsRSxNQUFNLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxFQUFFLEVBQUUsZUFBZSxFQUFFLEVBQUUsUUFBUSxFQUFFLEVBQUUsT0FBTyxDQUFDO0lBRXhFLElBQUksTUFBTSxDQUFDLE1BQU0sSUFBSSxNQUFNLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTtRQUN0QyxNQUFNLElBQUksS0FBSyxDQUNiLGdEQUFnRCxNQUFNLENBQUMsTUFBTSxFQUFFLENBQ2hFLENBQUM7S0FDSDtJQUVELE9BQU8sTUFBTSxDQUFDO0FBQ2hCLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBBY3Rpb25SZWR1Y2VyLCBBY3Rpb24gfSBmcm9tICdAbmdyeC9zdG9yZSc7XG5pbXBvcnQgeyBJbmplY3Rpb25Ub2tlbiB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5leHBvcnQgdHlwZSBBY3Rpb25TYW5pdGl6ZXIgPSAoYWN0aW9uOiBBY3Rpb24sIGlkOiBudW1iZXIpID0+IEFjdGlvbjtcbmV4cG9ydCB0eXBlIFN0YXRlU2FuaXRpemVyID0gKHN0YXRlOiBhbnksIGluZGV4OiBudW1iZXIpID0+IGFueTtcbmV4cG9ydCB0eXBlIFNlcmlhbGl6YXRpb25PcHRpb25zID0ge1xuICBvcHRpb25zPzogYm9vbGVhbiB8IGFueTtcbiAgcmVwbGFjZXI/OiAoa2V5OiBhbnksIHZhbHVlOiBhbnkpID0+IHt9O1xuICByZXZpdmVyPzogKGtleTogYW55LCB2YWx1ZTogYW55KSA9PiB7fTtcbiAgaW1tdXRhYmxlPzogYW55O1xuICByZWZzPzogQXJyYXk8YW55Pjtcbn07XG5leHBvcnQgdHlwZSBQcmVkaWNhdGUgPSAoc3RhdGU6IGFueSwgYWN0aW9uOiBBY3Rpb24pID0+IGJvb2xlYW47XG5leHBvcnQgaW50ZXJmYWNlIERldlRvb2xzRmVhdHVyZU9wdGlvbnMge1xuICBwYXVzZT86IGJvb2xlYW47XG4gIGxvY2s/OiBib29sZWFuO1xuICBwZXJzaXN0PzogYm9vbGVhbjtcbiAgZXhwb3J0PzogYm9vbGVhbjtcbiAgaW1wb3J0PzogJ2N1c3RvbScgfCBib29sZWFuO1xuICBqdW1wPzogYm9vbGVhbjtcbiAgc2tpcD86IGJvb2xlYW47XG4gIHJlb3JkZXI/OiBib29sZWFuO1xuICBkaXNwYXRjaD86IGJvb2xlYW47XG4gIHRlc3Q/OiBib29sZWFuO1xufVxuXG5leHBvcnQgY2xhc3MgU3RvcmVEZXZ0b29sc0NvbmZpZyB7XG4gIG1heEFnZTogbnVtYmVyIHwgZmFsc2U7XG4gIG1vbml0b3I6IEFjdGlvblJlZHVjZXI8YW55LCBhbnk+O1xuICBhY3Rpb25TYW5pdGl6ZXI/OiBBY3Rpb25TYW5pdGl6ZXI7XG4gIHN0YXRlU2FuaXRpemVyPzogU3RhdGVTYW5pdGl6ZXI7XG4gIG5hbWU/OiBzdHJpbmc7XG4gIHNlcmlhbGl6ZT86IGJvb2xlYW4gfCBTZXJpYWxpemF0aW9uT3B0aW9ucztcbiAgbG9nT25seT86IGJvb2xlYW47XG4gIGZlYXR1cmVzPzogRGV2VG9vbHNGZWF0dXJlT3B0aW9ucztcbiAgYWN0aW9uc0Jsb2NrbGlzdD86IHN0cmluZ1tdO1xuICBhY3Rpb25zU2FmZWxpc3Q/OiBzdHJpbmdbXTtcbiAgcHJlZGljYXRlPzogUHJlZGljYXRlO1xufVxuXG5leHBvcnQgY29uc3QgU1RPUkVfREVWVE9PTFNfQ09ORklHID0gbmV3IEluamVjdGlvblRva2VuPFN0b3JlRGV2dG9vbHNDb25maWc+KFxuICAnQG5ncngvZGV2dG9vbHMgT3B0aW9ucydcbik7XG5leHBvcnQgY29uc3QgSU5JVElBTF9PUFRJT05TID0gbmV3IEluamVjdGlvblRva2VuPFN0b3JlRGV2dG9vbHNDb25maWc+KFxuICAnQG5ncngvZGV2dG9vbHMgSW5pdGlhbCBDb25maWcnXG4pO1xuXG5leHBvcnQgdHlwZSBTdG9yZURldnRvb2xzT3B0aW9ucyA9XG4gIHwgUGFydGlhbDxTdG9yZURldnRvb2xzQ29uZmlnPlxuICB8ICgoKSA9PiBQYXJ0aWFsPFN0b3JlRGV2dG9vbHNDb25maWc+KTtcblxuZXhwb3J0IGZ1bmN0aW9uIG5vTW9uaXRvcigpOiBudWxsIHtcbiAgcmV0dXJuIG51bGw7XG59XG5cbmV4cG9ydCBjb25zdCBERUZBVUxUX05BTUUgPSAnTmdSeCBTdG9yZSBEZXZUb29scyc7XG5cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVDb25maWcoXG4gIF9vcHRpb25zOiBTdG9yZURldnRvb2xzT3B0aW9uc1xuKTogU3RvcmVEZXZ0b29sc0NvbmZpZyB7XG4gIGNvbnN0IERFRkFVTFRfT1BUSU9OUzogU3RvcmVEZXZ0b29sc0NvbmZpZyA9IHtcbiAgICBtYXhBZ2U6IGZhbHNlLFxuICAgIG1vbml0b3I6IG5vTW9uaXRvcixcbiAgICBhY3Rpb25TYW5pdGl6ZXI6IHVuZGVmaW5lZCxcbiAgICBzdGF0ZVNhbml0aXplcjogdW5kZWZpbmVkLFxuICAgIG5hbWU6IERFRkFVTFRfTkFNRSxcbiAgICBzZXJpYWxpemU6IGZhbHNlLFxuICAgIGxvZ09ubHk6IGZhbHNlLFxuICAgIC8vIEFkZCBhbGwgZmVhdHVyZXMgZXhwbGljaXRseS4gVGhpcyBwcmV2ZW50IGJ1Z2d5IGJlaGF2aW9yIGZvclxuICAgIC8vIG9wdGlvbnMgbGlrZSBcImxvY2tcIiB3aGljaCBtaWdodCBvdGhlcndpc2Ugbm90IHNob3cgdXAuXG4gICAgZmVhdHVyZXM6IHtcbiAgICAgIHBhdXNlOiB0cnVlLCAvLyBzdGFydC9wYXVzZSByZWNvcmRpbmcgb2YgZGlzcGF0Y2hlZCBhY3Rpb25zXG4gICAgICBsb2NrOiB0cnVlLCAvLyBsb2NrL3VubG9jayBkaXNwYXRjaGluZyBhY3Rpb25zIGFuZCBzaWRlIGVmZmVjdHNcbiAgICAgIHBlcnNpc3Q6IHRydWUsIC8vIHBlcnNpc3Qgc3RhdGVzIG9uIHBhZ2UgcmVsb2FkaW5nXG4gICAgICBleHBvcnQ6IHRydWUsIC8vIGV4cG9ydCBoaXN0b3J5IG9mIGFjdGlvbnMgaW4gYSBmaWxlXG4gICAgICBpbXBvcnQ6ICdjdXN0b20nLCAvLyBpbXBvcnQgaGlzdG9yeSBvZiBhY3Rpb25zIGZyb20gYSBmaWxlXG4gICAgICBqdW1wOiB0cnVlLCAvLyBqdW1wIGJhY2sgYW5kIGZvcnRoICh0aW1lIHRyYXZlbGxpbmcpXG4gICAgICBza2lwOiB0cnVlLCAvLyBza2lwIChjYW5jZWwpIGFjdGlvbnNcbiAgICAgIHJlb3JkZXI6IHRydWUsIC8vIGRyYWcgYW5kIGRyb3AgYWN0aW9ucyBpbiB0aGUgaGlzdG9yeSBsaXN0XG4gICAgICBkaXNwYXRjaDogdHJ1ZSwgLy8gZGlzcGF0Y2ggY3VzdG9tIGFjdGlvbnMgb3IgYWN0aW9uIGNyZWF0b3JzXG4gICAgICB0ZXN0OiB0cnVlLCAvLyBnZW5lcmF0ZSB0ZXN0cyBmb3IgdGhlIHNlbGVjdGVkIGFjdGlvbnNcbiAgICB9LFxuICB9O1xuXG4gIGxldCBvcHRpb25zID0gdHlwZW9mIF9vcHRpb25zID09PSAnZnVuY3Rpb24nID8gX29wdGlvbnMoKSA6IF9vcHRpb25zO1xuICBjb25zdCBsb2dPbmx5ID0gb3B0aW9ucy5sb2dPbmx5XG4gICAgPyB7IHBhdXNlOiB0cnVlLCBleHBvcnQ6IHRydWUsIHRlc3Q6IHRydWUgfVxuICAgIDogZmFsc2U7XG4gIGNvbnN0IGZlYXR1cmVzID0gb3B0aW9ucy5mZWF0dXJlcyB8fCBsb2dPbmx5IHx8IERFRkFVTFRfT1BUSU9OUy5mZWF0dXJlcztcbiAgY29uc3QgY29uZmlnID0gT2JqZWN0LmFzc2lnbih7fSwgREVGQVVMVF9PUFRJT05TLCB7IGZlYXR1cmVzIH0sIG9wdGlvbnMpO1xuXG4gIGlmIChjb25maWcubWF4QWdlICYmIGNvbmZpZy5tYXhBZ2UgPCAyKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgYERldnRvb2xzICdtYXhBZ2UnIGNhbm5vdCBiZSBsZXNzIHRoYW4gMiwgZ290ICR7Y29uZmlnLm1heEFnZX1gXG4gICAgKTtcbiAgfVxuXG4gIHJldHVybiBjb25maWc7XG59XG4iXX0=