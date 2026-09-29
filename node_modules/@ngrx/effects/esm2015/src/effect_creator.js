/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { DEFAULT_EFFECT_CONFIG, CREATE_EFFECT_METADATA_KEY, } from './models';
/**
 * \@description
 * Creates an effect from an `Observable` and an `EffectConfig`.
 *
 * \@usageNotes
 *
 * ** Mapping to a different action **
 * ```ts
 * effectName$ = createEffect(
 *   () => this.actions$.pipe(
 *     ofType(FeatureActions.actionOne),
 *     map(() => FeatureActions.actionTwo())
 *   )
 * );
 * ```
 *
 *  ** Non-dispatching effects **
 * ```ts
 * effectName$ = createEffect(
 *   () => this.actions$.pipe(
 *     ofType(FeatureActions.actionOne),
 *     tap(() => console.log('Action One Dispatched'))
 *   ),
 *   { dispatch: false }
 *   // FeatureActions.actionOne is not dispatched
 * );
 * ```
 * @template C, DT, OT, R
 * @param {?} source A function which returns an `Observable`.
 * @param {?=} config A `Partial<EffectConfig>` to configure the effect.  By default, `dispatch` is true and `resubscribeOnError` is true.
 * @return {?} If `EffectConfig`#`dispatch` is true, returns `Observable<Action>`.  Else, returns `Observable<unknown>`.
 *
 */
export function createEffect(source, config) {
    /** @type {?} */
    const effect = source();
    /** @type {?} */
    const value = Object.assign({}, DEFAULT_EFFECT_CONFIG, config);
    Object.defineProperty(effect, CREATE_EFFECT_METADATA_KEY, {
        value,
    });
    return (/** @type {?} */ (effect));
}
/**
 * @template T
 * @param {?} instance
 * @return {?}
 */
export function getCreateEffectMetadata(instance) {
    /** @type {?} */
    const propertyNames = (/** @type {?} */ (Object.getOwnPropertyNames(instance)));
    /** @type {?} */
    const metadata = propertyNames
        .filter((/**
     * @param {?} propertyName
     * @return {?}
     */
    propertyName => instance[propertyName] &&
        instance[propertyName].hasOwnProperty(CREATE_EFFECT_METADATA_KEY)))
        .map((/**
     * @param {?} propertyName
     * @return {?}
     */
    propertyName => {
        /** @type {?} */
        const metaData = ((/** @type {?} */ (instance[propertyName])))[CREATE_EFFECT_METADATA_KEY];
        return Object.assign({ propertyName }, metaData);
    }));
    return metadata;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZWZmZWN0X2NyZWF0b3IuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9tb2R1bGVzL2VmZmVjdHMvc3JjL2VmZmVjdF9jcmVhdG9yLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7QUFFQSxPQUFPLEVBR0wscUJBQXFCLEVBRXJCLDBCQUEwQixHQUMzQixNQUFNLFVBQVUsQ0FBQzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQW9DbEIsTUFBTSxVQUFVLFlBQVksQ0FLMUIsTUFBZSxFQUFFLE1BQW1COztVQUM5QixNQUFNLEdBQUcsTUFBTSxFQUFFOztVQUNqQixLQUFLLHFCQUNOLHFCQUFxQixFQUNyQixNQUFNLENBQ1Y7SUFDRCxNQUFNLENBQUMsY0FBYyxDQUFDLE1BQU0sRUFBRSwwQkFBMEIsRUFBRTtRQUN4RCxLQUFLO0tBQ04sQ0FBQyxDQUFDO0lBQ0gsT0FBTyxtQkFBQSxNQUFNLEVBQXdDLENBQUM7QUFDeEQsQ0FBQzs7Ozs7O0FBRUQsTUFBTSxVQUFVLHVCQUF1QixDQUVyQyxRQUFXOztVQUNMLGFBQWEsR0FBRyxtQkFBQSxNQUFNLENBQUMsbUJBQW1CLENBQUMsUUFBUSxDQUFDLEVBQWtCOztVQUV0RSxRQUFRLEdBQXdCLGFBQWE7U0FDaEQsTUFBTTs7OztJQUNMLFlBQVksQ0FBQyxFQUFFLENBQ2IsUUFBUSxDQUFDLFlBQVksQ0FBQztRQUN0QixRQUFRLENBQUMsWUFBWSxDQUFDLENBQUMsY0FBYyxDQUFDLDBCQUEwQixDQUFDLEVBQ3BFO1NBQ0EsR0FBRzs7OztJQUFDLFlBQVksQ0FBQyxFQUFFOztjQUNaLFFBQVEsR0FBRyxDQUFDLG1CQUFBLFFBQVEsQ0FBQyxZQUFZLENBQUMsRUFBTyxDQUFDLENBQzlDLDBCQUEwQixDQUMzQjtRQUNELHVCQUNFLFlBQVksSUFDVCxRQUFRLEVBQ1g7SUFDSixDQUFDLEVBQUM7SUFFSixPQUFPLFFBQVEsQ0FBQztBQUNsQixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgT2JzZXJ2YWJsZSB9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHsgQWN0aW9uIH0gZnJvbSAnQG5ncngvc3RvcmUnO1xuaW1wb3J0IHtcbiAgRWZmZWN0TWV0YWRhdGEsXG4gIEVmZmVjdENvbmZpZyxcbiAgREVGQVVMVF9FRkZFQ1RfQ09ORklHLFxuICBDcmVhdGVFZmZlY3RNZXRhZGF0YSxcbiAgQ1JFQVRFX0VGRkVDVF9NRVRBREFUQV9LRVksXG59IGZyb20gJy4vbW9kZWxzJztcblxudHlwZSBEaXNwYXRjaFR5cGU8VD4gPSBUIGV4dGVuZHMgeyBkaXNwYXRjaDogaW5mZXIgVSB9ID8gVSA6IHRydWU7XG50eXBlIE9ic2VydmFibGVUeXBlPFQsIE9yaWdpbmFsVHlwZT4gPSBUIGV4dGVuZHMgZmFsc2UgPyBPcmlnaW5hbFR5cGUgOiBBY3Rpb247XG4vKipcbiAqIEBkZXNjcmlwdGlvblxuICogQ3JlYXRlcyBhbiBlZmZlY3QgZnJvbSBhbiBgT2JzZXJ2YWJsZWAgYW5kIGFuIGBFZmZlY3RDb25maWdgLlxuICpcbiAqIEBwYXJhbSBzb3VyY2UgQSBmdW5jdGlvbiB3aGljaCByZXR1cm5zIGFuIGBPYnNlcnZhYmxlYC5cbiAqIEBwYXJhbSBjb25maWcgQSBgUGFydGlhbDxFZmZlY3RDb25maWc+YCB0byBjb25maWd1cmUgdGhlIGVmZmVjdC4gIEJ5IGRlZmF1bHQsIGBkaXNwYXRjaGAgaXMgdHJ1ZSBhbmQgYHJlc3Vic2NyaWJlT25FcnJvcmAgaXMgdHJ1ZS5cbiAqIEByZXR1cm5zIElmIGBFZmZlY3RDb25maWdgI2BkaXNwYXRjaGAgaXMgdHJ1ZSwgcmV0dXJucyBgT2JzZXJ2YWJsZTxBY3Rpb24+YC4gIEVsc2UsIHJldHVybnMgYE9ic2VydmFibGU8dW5rbm93bj5gLlxuICpcbiAqIEB1c2FnZU5vdGVzXG4gKlxuICogKiogTWFwcGluZyB0byBhIGRpZmZlcmVudCBhY3Rpb24gKipcbiAqIGBgYHRzXG4gKiBlZmZlY3ROYW1lJCA9IGNyZWF0ZUVmZmVjdChcbiAqICAgKCkgPT4gdGhpcy5hY3Rpb25zJC5waXBlKFxuICogICAgIG9mVHlwZShGZWF0dXJlQWN0aW9ucy5hY3Rpb25PbmUpLFxuICogICAgIG1hcCgoKSA9PiBGZWF0dXJlQWN0aW9ucy5hY3Rpb25Ud28oKSlcbiAqICAgKVxuICogKTtcbiAqIGBgYFxuICpcbiAqICAqKiBOb24tZGlzcGF0Y2hpbmcgZWZmZWN0cyAqKlxuICogYGBgdHNcbiAqIGVmZmVjdE5hbWUkID0gY3JlYXRlRWZmZWN0KFxuICogICAoKSA9PiB0aGlzLmFjdGlvbnMkLnBpcGUoXG4gKiAgICAgb2ZUeXBlKEZlYXR1cmVBY3Rpb25zLmFjdGlvbk9uZSksXG4gKiAgICAgdGFwKCgpID0+IGNvbnNvbGUubG9nKCdBY3Rpb24gT25lIERpc3BhdGNoZWQnKSlcbiAqICAgKSxcbiAqICAgeyBkaXNwYXRjaDogZmFsc2UgfVxuICogICAvLyBGZWF0dXJlQWN0aW9ucy5hY3Rpb25PbmUgaXMgbm90IGRpc3BhdGNoZWRcbiAqICk7XG4gKiBgYGBcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZUVmZmVjdDxcbiAgQyBleHRlbmRzIEVmZmVjdENvbmZpZyxcbiAgRFQgZXh0ZW5kcyBEaXNwYXRjaFR5cGU8Qz4sXG4gIE9UIGV4dGVuZHMgT2JzZXJ2YWJsZVR5cGU8RFQsIE9UPixcbiAgUiBleHRlbmRzIE9ic2VydmFibGU8T1Q+IHwgKCguLi5hcmdzOiBhbnlbXSkgPT4gT2JzZXJ2YWJsZTxPVD4pXG4+KHNvdXJjZTogKCkgPT4gUiwgY29uZmlnPzogUGFydGlhbDxDPik6IFIgJiBDcmVhdGVFZmZlY3RNZXRhZGF0YSB7XG4gIGNvbnN0IGVmZmVjdCA9IHNvdXJjZSgpO1xuICBjb25zdCB2YWx1ZTogRWZmZWN0Q29uZmlnID0ge1xuICAgIC4uLkRFRkFVTFRfRUZGRUNUX0NPTkZJRyxcbiAgICAuLi5jb25maWcsIC8vIE92ZXJyaWRlcyBhbnkgZGVmYXVsdHMgaWYgdmFsdWVzIGFyZSBwcm92aWRlZFxuICB9O1xuICBPYmplY3QuZGVmaW5lUHJvcGVydHkoZWZmZWN0LCBDUkVBVEVfRUZGRUNUX01FVEFEQVRBX0tFWSwge1xuICAgIHZhbHVlLFxuICB9KTtcbiAgcmV0dXJuIGVmZmVjdCBhcyB0eXBlb2YgZWZmZWN0ICYgQ3JlYXRlRWZmZWN0TWV0YWRhdGE7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRDcmVhdGVFZmZlY3RNZXRhZGF0YTxcbiAgVCBleHRlbmRzIHsgW3Byb3BzIGluIGtleW9mIFRdOiBPYmplY3QgfVxuPihpbnN0YW5jZTogVCk6IEVmZmVjdE1ldGFkYXRhPFQ+W10ge1xuICBjb25zdCBwcm9wZXJ0eU5hbWVzID0gT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXMoaW5zdGFuY2UpIGFzIEFycmF5PGtleW9mIFQ+O1xuXG4gIGNvbnN0IG1ldGFkYXRhOiBFZmZlY3RNZXRhZGF0YTxUPltdID0gcHJvcGVydHlOYW1lc1xuICAgIC5maWx0ZXIoXG4gICAgICBwcm9wZXJ0eU5hbWUgPT5cbiAgICAgICAgaW5zdGFuY2VbcHJvcGVydHlOYW1lXSAmJlxuICAgICAgICBpbnN0YW5jZVtwcm9wZXJ0eU5hbWVdLmhhc093blByb3BlcnR5KENSRUFURV9FRkZFQ1RfTUVUQURBVEFfS0VZKVxuICAgIClcbiAgICAubWFwKHByb3BlcnR5TmFtZSA9PiB7XG4gICAgICBjb25zdCBtZXRhRGF0YSA9IChpbnN0YW5jZVtwcm9wZXJ0eU5hbWVdIGFzIGFueSlbXG4gICAgICAgIENSRUFURV9FRkZFQ1RfTUVUQURBVEFfS0VZXG4gICAgICBdO1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgcHJvcGVydHlOYW1lLFxuICAgICAgICAuLi5tZXRhRGF0YSxcbiAgICAgIH07XG4gICAgfSk7XG5cbiAgcmV0dXJuIG1ldGFkYXRhO1xufVxuIl19