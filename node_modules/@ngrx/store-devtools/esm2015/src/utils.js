/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import * as Actions from './actions';
/**
 * @param {?} first
 * @param {?} second
 * @return {?}
 */
export function difference(first, second) {
    return first.filter((/**
     * @param {?} item
     * @return {?}
     */
    item => second.indexOf(item) < 0));
}
/**
 * Provides an app's view into the state of the lifted store.
 * @param {?} liftedState
 * @return {?}
 */
export function unliftState(liftedState) {
    const { computedStates, currentStateIndex } = liftedState;
    // At start up NgRx dispatches init actions,
    // When these init actions are being filtered out by the predicate or safe/block list options
    // we don't have a complete computed states yet.
    // At this point it could happen that we're out of bounds, when this happens we fall back to the last known state
    if (currentStateIndex >= computedStates.length) {
        const { state } = computedStates[computedStates.length - 1];
        return state;
    }
    const { state } = computedStates[currentStateIndex];
    return state;
}
/**
 * @param {?} liftedState
 * @return {?}
 */
export function unliftAction(liftedState) {
    return liftedState.actionsById[liftedState.nextActionId - 1];
}
/**
 * Lifts an app's action into an action on the lifted store.
 * @param {?} action
 * @return {?}
 */
export function liftAction(action) {
    return new Actions.PerformAction(action, +Date.now());
}
/**
 * Sanitizes given actions with given function.
 * @param {?} actionSanitizer
 * @param {?} actions
 * @return {?}
 */
export function sanitizeActions(actionSanitizer, actions) {
    return Object.keys(actions).reduce((/**
     * @param {?} sanitizedActions
     * @param {?} actionIdx
     * @return {?}
     */
    (sanitizedActions, actionIdx) => {
        /** @type {?} */
        const idx = Number(actionIdx);
        sanitizedActions[idx] = sanitizeAction(actionSanitizer, actions[idx], idx);
        return sanitizedActions;
    }), (/** @type {?} */ ({})));
}
/**
 * Sanitizes given action with given function.
 * @param {?} actionSanitizer
 * @param {?} action
 * @param {?} actionIdx
 * @return {?}
 */
export function sanitizeAction(actionSanitizer, action, actionIdx) {
    return Object.assign({}, action, { action: actionSanitizer(action.action, actionIdx) });
}
/**
 * Sanitizes given states with given function.
 * @param {?} stateSanitizer
 * @param {?} states
 * @return {?}
 */
export function sanitizeStates(stateSanitizer, states) {
    return states.map((/**
     * @param {?} computedState
     * @param {?} idx
     * @return {?}
     */
    (computedState, idx) => ({
        state: sanitizeState(stateSanitizer, computedState.state, idx),
        error: computedState.error,
    })));
}
/**
 * Sanitizes given state with given function.
 * @param {?} stateSanitizer
 * @param {?} state
 * @param {?} stateIdx
 * @return {?}
 */
export function sanitizeState(stateSanitizer, state, stateIdx) {
    return stateSanitizer(state, stateIdx);
}
/**
 * Read the config and tell if actions should be filtered
 * @param {?} config
 * @return {?}
 */
export function shouldFilterActions(config) {
    return config.predicate || config.actionsSafelist || config.actionsBlocklist;
}
/**
 * Return a full filtered lifted state
 * @param {?} liftedState
 * @param {?=} predicate
 * @param {?=} safelist
 * @param {?=} blocklist
 * @return {?}
 */
export function filterLiftedState(liftedState, predicate, safelist, blocklist) {
    /** @type {?} */
    const filteredStagedActionIds = [];
    /** @type {?} */
    const filteredActionsById = {};
    /** @type {?} */
    const filteredComputedStates = [];
    liftedState.stagedActionIds.forEach((/**
     * @param {?} id
     * @param {?} idx
     * @return {?}
     */
    (id, idx) => {
        /** @type {?} */
        const liftedAction = liftedState.actionsById[id];
        if (!liftedAction)
            return;
        if (idx &&
            isActionFiltered(liftedState.computedStates[idx], liftedAction, predicate, safelist, blocklist)) {
            return;
        }
        filteredActionsById[id] = liftedAction;
        filteredStagedActionIds.push(id);
        filteredComputedStates.push(liftedState.computedStates[idx]);
    }));
    return Object.assign({}, liftedState, { stagedActionIds: filteredStagedActionIds, actionsById: filteredActionsById, computedStates: filteredComputedStates });
}
/**
 * Return true is the action should be ignored
 * @param {?} state
 * @param {?} action
 * @param {?=} predicate
 * @param {?=} safelist
 * @param {?=} blockedlist
 * @return {?}
 */
export function isActionFiltered(state, action, predicate, safelist, blockedlist) {
    /** @type {?} */
    const predicateMatch = predicate && !predicate(state, action.action);
    /** @type {?} */
    const safelistMatch = safelist &&
        !action.action.type.match(safelist.map((/**
         * @param {?} s
         * @return {?}
         */
        s => escapeRegExp(s))).join('|'));
    /** @type {?} */
    const blocklistMatch = blockedlist &&
        action.action.type.match(blockedlist.map((/**
         * @param {?} s
         * @return {?}
         */
        s => escapeRegExp(s))).join('|'));
    return predicateMatch || safelistMatch || blocklistMatch;
}
/**
 * Return string with escaped RegExp special characters
 * https://stackoverflow.com/a/6969486/1337347
 * @param {?} s
 * @return {?}
 */
function escapeRegExp(s) {
    return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9tb2R1bGVzL3N0b3JlLWRldnRvb2xzL3NyYy91dGlscy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0FBRUEsT0FBTyxLQUFLLE9BQU8sTUFBTSxXQUFXLENBQUM7Ozs7OztBQWNyQyxNQUFNLFVBQVUsVUFBVSxDQUFDLEtBQVksRUFBRSxNQUFhO0lBQ3BELE9BQU8sS0FBSyxDQUFDLE1BQU07Ozs7SUFBQyxJQUFJLENBQUMsRUFBRSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFDLENBQUM7QUFDeEQsQ0FBQzs7Ozs7O0FBS0QsTUFBTSxVQUFVLFdBQVcsQ0FBQyxXQUF3QjtVQUM1QyxFQUFFLGNBQWMsRUFBRSxpQkFBaUIsRUFBRSxHQUFHLFdBQVc7SUFFekQsNENBQTRDO0lBQzVDLDZGQUE2RjtJQUM3RixnREFBZ0Q7SUFDaEQsaUhBQWlIO0lBQ2pILElBQUksaUJBQWlCLElBQUksY0FBYyxDQUFDLE1BQU0sRUFBRTtjQUN4QyxFQUFFLEtBQUssRUFBRSxHQUFHLGNBQWMsQ0FBQyxjQUFjLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQztRQUMzRCxPQUFPLEtBQUssQ0FBQztLQUNkO1VBRUssRUFBRSxLQUFLLEVBQUUsR0FBRyxjQUFjLENBQUMsaUJBQWlCLENBQUM7SUFDbkQsT0FBTyxLQUFLLENBQUM7QUFDZixDQUFDOzs7OztBQUVELE1BQU0sVUFBVSxZQUFZLENBQUMsV0FBd0I7SUFDbkQsT0FBTyxXQUFXLENBQUMsV0FBVyxDQUFDLFdBQVcsQ0FBQyxZQUFZLEdBQUcsQ0FBQyxDQUFDLENBQUM7QUFDL0QsQ0FBQzs7Ozs7O0FBS0QsTUFBTSxVQUFVLFVBQVUsQ0FBQyxNQUFjO0lBQ3ZDLE9BQU8sSUFBSSxPQUFPLENBQUMsYUFBYSxDQUFDLE1BQU0sRUFBRSxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUUs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QUFzQjs7VUFFaEIsY0FBYyxHQUFHLFNBQVMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLEVBQUUsTUFBTSxDQUFDLE1BQU0sQ0FBQzs7VUFDOUQsYUFBYSxHQUNqQixRQUFRO1FBQ1IsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLEdBQUc7Ozs7UUFBQyxDQUFDLENBQUMsRUFBRSxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsRUFBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQzs7VUFDbkUsY0FBYyxHQUNsQixXQUFXO1FBQ1gsTUFBTSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLFdBQVcsQ0FBQyxHQUFHOzs7O1FBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDM0UsT0FBTyxjQUFjLElBQUksYUFBYSxJQUFJLGNBQWMsQ0FBQztBQUMzRCxDQUFDOzs7Ozs7O0FBTUQsU0FBUyxZQUFZLENBQUMsQ0FBUztJQUM3QixPQUFPLENBQUMsQ0FBQyxPQUFPLENBQUMscUJBQXFCLEVBQUUsTUFBTSxDQUFDLENBQUM7QUFDbEQsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEFjdGlvbiB9IGZyb20gJ0BuZ3J4L3N0b3JlJztcblxuaW1wb3J0ICogYXMgQWN0aW9ucyBmcm9tICcuL2FjdGlvbnMnO1xuaW1wb3J0IHtcbiAgQWN0aW9uU2FuaXRpemVyLFxuICBTdGF0ZVNhbml0aXplcixcbiAgUHJlZGljYXRlLFxuICBTdG9yZURldnRvb2xzQ29uZmlnLFxufSBmcm9tICcuL2NvbmZpZyc7XG5pbXBvcnQge1xuICBDb21wdXRlZFN0YXRlLFxuICBMaWZ0ZWRBY3Rpb24sXG4gIExpZnRlZEFjdGlvbnMsXG4gIExpZnRlZFN0YXRlLFxufSBmcm9tICcuL3JlZHVjZXInO1xuXG5leHBvcnQgZnVuY3Rpb24gZGlmZmVyZW5jZShmaXJzdDogYW55W10sIHNlY29uZDogYW55W10pIHtcbiAgcmV0dXJuIGZpcnN0LmZpbHRlcihpdGVtID0+IHNlY29uZC5pbmRleE9mKGl0ZW0pIDwgMCk7XG59XG5cbi8qKlxuICogUHJvdmlkZXMgYW4gYXBwJ3MgdmlldyBpbnRvIHRoZSBzdGF0ZSBvZiB0aGUgbGlmdGVkIHN0b3JlLlxuICovXG5leHBvcnQgZnVuY3Rpb24gdW5saWZ0U3RhdGUobGlmdGVkU3RhdGU6IExpZnRlZFN0YXRlKSB7XG4gIGNvbnN0IHsgY29tcHV0ZWRTdGF0ZXMsIGN1cnJlbnRTdGF0ZUluZGV4IH0gPSBsaWZ0ZWRTdGF0ZTtcblxuICAvLyBBdCBzdGFydCB1cCBOZ1J4IGRpc3BhdGNoZXMgaW5pdCBhY3Rpb25zLFxuICAvLyBXaGVuIHRoZXNlIGluaXQgYWN0aW9ucyBhcmUgYmVpbmcgZmlsdGVyZWQgb3V0IGJ5IHRoZSBwcmVkaWNhdGUgb3Igc2FmZS9ibG9jayBsaXN0IG9wdGlvbnNcbiAgLy8gd2UgZG9uJ3QgaGF2ZSBhIGNvbXBsZXRlIGNvbXB1dGVkIHN0YXRlcyB5ZXQuXG4gIC8vIEF0IHRoaXMgcG9pbnQgaXQgY291bGQgaGFwcGVuIHRoYXQgd2UncmUgb3V0IG9mIGJvdW5kcywgd2hlbiB0aGlzIGhhcHBlbnMgd2UgZmFsbCBiYWNrIHRvIHRoZSBsYXN0IGtub3duIHN0YXRlXG4gIGlmIChjdXJyZW50U3RhdGVJbmRleCA+PSBjb21wdXRlZFN0YXRlcy5sZW5ndGgpIHtcbiAgICBjb25zdCB7IHN0YXRlIH0gPSBjb21wdXRlZFN0YXRlc1tjb21wdXRlZFN0YXRlcy5sZW5ndGggLSAxXTtcbiAgICByZXR1cm4gc3RhdGU7XG4gIH1cblxuICBjb25zdCB7IHN0YXRlIH0gPSBjb21wdXRlZFN0YXRlc1tjdXJyZW50U3RhdGVJbmRleF07XG4gIHJldHVybiBzdGF0ZTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHVubGlmdEFjdGlvbihsaWZ0ZWRTdGF0ZTogTGlmdGVkU3RhdGUpOiBMaWZ0ZWRBY3Rpb24ge1xuICByZXR1cm4gbGlmdGVkU3RhdGUuYWN0aW9uc0J5SWRbbGlmdGVkU3RhdGUubmV4dEFjdGlvbklkIC0gMV07XG59XG5cbi8qKlxuICogTGlmdHMgYW4gYXBwJ3MgYWN0aW9uIGludG8gYW4gYWN0aW9uIG9uIHRoZSBsaWZ0ZWQgc3RvcmUuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBsaWZ0QWN0aW9uKGFjdGlvbjogQWN0aW9uKSB7XG4gIHJldHVybiBuZXcgQWN0aW9ucy5QZXJmb3JtQWN0aW9uKGFjdGlvbiwgK0RhdGUubm93KCkpO1xufVxuXG4vKipcbiAqIFNhbml0aXplcyBnaXZlbiBhY3Rpb25zIHdpdGggZ2l2ZW4gZnVuY3Rpb24uXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBzYW5pdGl6ZUFjdGlvbnMoXG4gIGFjdGlvblNhbml0aXplcjogQWN0aW9uU2FuaXRpemVyLFxuICBhY3Rpb25zOiBMaWZ0ZWRBY3Rpb25zXG4pOiBMaWZ0ZWRBY3Rpb25zIHtcbiAgcmV0dXJuIE9iamVjdC5rZXlzKGFjdGlvbnMpLnJlZHVjZShcbiAgICAoc2FuaXRpemVkQWN0aW9ucywgYWN0aW9uSWR4KSA9PiB7XG4gICAgICBjb25zdCBpZHggPSBOdW1iZXIoYWN0aW9uSWR4KTtcbiAgICAgIHNhbml0aXplZEFjdGlvbnNbaWR4XSA9IHNhbml0aXplQWN0aW9uKFxuICAgICAgICBhY3Rpb25TYW5pdGl6ZXIsXG4gICAgICAgIGFjdGlvbnNbaWR4XSxcbiAgICAgICAgaWR4XG4gICAgICApO1xuICAgICAgcmV0dXJuIHNhbml0aXplZEFjdGlvbnM7XG4gICAgfSxcbiAgICA8TGlmdGVkQWN0aW9ucz57fVxuICApO1xufVxuXG4vKipcbiAqIFNhbml0aXplcyBnaXZlbiBhY3Rpb24gd2l0aCBnaXZlbiBmdW5jdGlvbi5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHNhbml0aXplQWN0aW9uKFxuICBhY3Rpb25TYW5pdGl6ZXI6IEFjdGlvblNhbml0aXplcixcbiAgYWN0aW9uOiBMaWZ0ZWRBY3Rpb24sXG4gIGFjdGlvbklkeDogbnVtYmVyXG4pOiBMaWZ0ZWRBY3Rpb24ge1xuICByZXR1cm4ge1xuICAgIC4uLmFjdGlvbixcbiAgICBhY3Rpb246IGFjdGlvblNhbml0aXplcihhY3Rpb24uYWN0aW9uLCBhY3Rpb25JZHgpLFxuICB9O1xufVxuXG4vKipcbiAqIFNhbml0aXplcyBnaXZlbiBzdGF0ZXMgd2l0aCBnaXZlbiBmdW5jdGlvbi5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHNhbml0aXplU3RhdGVzKFxuICBzdGF0ZVNhbml0aXplcjogU3RhdGVTYW5pdGl6ZXIsXG4gIHN0YXRlczogQ29tcHV0ZWRTdGF0ZVtdXG4pOiBDb21wdXRlZFN0YXRlW10ge1xuICByZXR1cm4gc3RhdGVzLm1hcCgoY29tcHV0ZWRTdGF0ZSwgaWR4KSA9PiAoe1xuICAgIHN0YXRlOiBzYW5pdGl6ZVN0YXRlKHN0YXRlU2FuaXRpemVyLCBjb21wdXRlZFN0YXRlLnN0YXRlLCBpZHgpLFxuICAgIGVycm9yOiBjb21wdXRlZFN0YXRlLmVycm9yLFxuICB9KSk7XG59XG5cbi8qKlxuICogU2FuaXRpemVzIGdpdmVuIHN0YXRlIHdpdGggZ2l2ZW4gZnVuY3Rpb24uXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBzYW5pdGl6ZVN0YXRlKFxuICBzdGF0ZVNhbml0aXplcjogU3RhdGVTYW5pdGl6ZXIsXG4gIHN0YXRlOiBhbnksXG4gIHN0YXRlSWR4OiBudW1iZXJcbikge1xuICByZXR1cm4gc3RhdGVTYW5pdGl6ZXIoc3RhdGUsIHN0YXRlSWR4KTtcbn1cblxuLyoqXG4gKiBSZWFkIHRoZSBjb25maWcgYW5kIHRlbGwgaWYgYWN0aW9ucyBzaG91bGQgYmUgZmlsdGVyZWRcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHNob3VsZEZpbHRlckFjdGlvbnMoY29uZmlnOiBTdG9yZURldnRvb2xzQ29uZmlnKSB7XG4gIHJldHVybiBjb25maWcucHJlZGljYXRlIHx8IGNvbmZpZy5hY3Rpb25zU2FmZWxpc3QgfHwgY29uZmlnLmFjdGlvbnNCbG9ja2xpc3Q7XG59XG5cbi8qKlxuICogUmV0dXJuIGEgZnVsbCBmaWx0ZXJlZCBsaWZ0ZWQgc3RhdGVcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGZpbHRlckxpZnRlZFN0YXRlKFxuICBsaWZ0ZWRTdGF0ZTogTGlmdGVkU3RhdGUsXG4gIHByZWRpY2F0ZT86IFByZWRpY2F0ZSxcbiAgc2FmZWxpc3Q/OiBzdHJpbmdbXSxcbiAgYmxvY2tsaXN0Pzogc3RyaW5nW11cbik6IExpZnRlZFN0YXRlIHtcbiAgY29uc3QgZmlsdGVyZWRTdGFnZWRBY3Rpb25JZHM6IG51bWJlcltdID0gW107XG4gIGNvbnN0IGZpbHRlcmVkQWN0aW9uc0J5SWQ6IExpZnRlZEFjdGlvbnMgPSB7fTtcbiAgY29uc3QgZmlsdGVyZWRDb21wdXRlZFN0YXRlczogQ29tcHV0ZWRTdGF0ZVtdID0gW107XG4gIGxpZnRlZFN0YXRlLnN0YWdlZEFjdGlvbklkcy5mb3JFYWNoKChpZCwgaWR4KSA9PiB7XG4gICAgY29uc3QgbGlmdGVkQWN0aW9uID0gbGlmdGVkU3RhdGUuYWN0aW9uc0J5SWRbaWRdO1xuICAgIGlmICghbGlmdGVkQWN0aW9uKSByZXR1cm47XG4gICAgaWYgKFxuICAgICAgaWR4ICYmXG4gICAgICBpc0FjdGlvbkZpbHRlcmVkKFxuICAgICAgICBsaWZ0ZWRTdGF0ZS5jb21wdXRlZFN0YXRlc1tpZHhdLFxuICAgICAgICBsaWZ0ZWRBY3Rpb24sXG4gICAgICAgIHByZWRpY2F0ZSxcbiAgICAgICAgc2FmZWxpc3QsXG4gICAgICAgIGJsb2NrbGlzdFxuICAgICAgKVxuICAgICkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBmaWx0ZXJlZEFjdGlvbnNCeUlkW2lkXSA9IGxpZnRlZEFjdGlvbjtcbiAgICBmaWx0ZXJlZFN0YWdlZEFjdGlvbklkcy5wdXNoKGlkKTtcbiAgICBmaWx0ZXJlZENvbXB1dGVkU3RhdGVzLnB1c2gobGlmdGVkU3RhdGUuY29tcHV0ZWRTdGF0ZXNbaWR4XSk7XG4gIH0pO1xuICByZXR1cm4ge1xuICAgIC4uLmxpZnRlZFN0YXRlLFxuICAgIHN0YWdlZEFjdGlvbklkczogZmlsdGVyZWRTdGFnZWRBY3Rpb25JZHMsXG4gICAgYWN0aW9uc0J5SWQ6IGZpbHRlcmVkQWN0aW9uc0J5SWQsXG4gICAgY29tcHV0ZWRTdGF0ZXM6IGZpbHRlcmVkQ29tcHV0ZWRTdGF0ZXMsXG4gIH07XG59XG5cbi8qKlxuICogUmV0dXJuIHRydWUgaXMgdGhlIGFjdGlvbiBzaG91bGQgYmUgaWdub3JlZFxuICovXG5leHBvcnQgZnVuY3Rpb24gaXNBY3Rpb25GaWx0ZXJlZChcbiAgc3RhdGU6IGFueSxcbiAgYWN0aW9uOiBMaWZ0ZWRBY3Rpb24sXG4gIHByZWRpY2F0ZT86IFByZWRpY2F0ZSxcbiAgc2FmZWxpc3Q/OiBzdHJpbmdbXSxcbiAgYmxvY2tlZGxpc3Q/OiBzdHJpbmdbXVxuKSB7XG4gIGNvbnN0IHByZWRpY2F0ZU1hdGNoID0gcHJlZGljYXRlICYmICFwcmVkaWNhdGUoc3RhdGUsIGFjdGlvbi5hY3Rpb24pO1xuICBjb25zdCBzYWZlbGlzdE1hdGNoID1cbiAgICBzYWZlbGlzdCAmJlxuICAgICFhY3Rpb24uYWN0aW9uLnR5cGUubWF0Y2goc2FmZWxpc3QubWFwKHMgPT4gZXNjYXBlUmVnRXhwKHMpKS5qb2luKCd8JykpO1xuICBjb25zdCBibG9ja2xpc3RNYXRjaCA9XG4gICAgYmxvY2tlZGxpc3QgJiZcbiAgICBhY3Rpb24uYWN0aW9uLnR5cGUubWF0Y2goYmxvY2tlZGxpc3QubWFwKHMgPT4gZXNjYXBlUmVnRXhwKHMpKS5qb2luKCd8JykpO1xuICByZXR1cm4gcHJlZGljYXRlTWF0Y2ggfHwgc2FmZWxpc3RNYXRjaCB8fCBibG9ja2xpc3RNYXRjaDtcbn1cblxuLyoqXG4gKiBSZXR1cm4gc3RyaW5nIHdpdGggZXNjYXBlZCBSZWdFeHAgc3BlY2lhbCBjaGFyYWN0ZXJzXG4gKiBodHRwczovL3N0YWNrb3ZlcmZsb3cuY29tL2EvNjk2OTQ4Ni8xMzM3MzQ3XG4gKi9cbmZ1bmN0aW9uIGVzY2FwZVJlZ0V4cChzOiBzdHJpbmcpOiBzdHJpbmcge1xuICByZXR1cm4gcy5yZXBsYWNlKC9bLiorP14ke30oKXxbXFxdXFxcXF0vZywgJ1xcXFwkJicpO1xufVxuIl19