import * as tslib_1 from "tslib";
import { UPDATE, INIT } from '@ngrx/store';
import { difference, liftAction, isActionFiltered } from './utils';
import * as DevtoolsActions from './actions';
import { PerformAction } from './actions';
export var INIT_ACTION = { type: INIT };
export var RECOMPUTE = '@ngrx/store-devtools/recompute';
export var RECOMPUTE_ACTION = { type: RECOMPUTE };
/**
 * Computes the next entry in the log by applying an action.
 */
function computeNextEntry(reducer, action, state, error, errorHandler) {
    if (error) {
        return {
            state: state,
            error: 'Interrupted by an error up the chain',
        };
    }
    var nextState = state;
    var nextError;
    try {
        nextState = reducer(state, action);
    }
    catch (err) {
        nextError = err.toString();
        errorHandler.handleError(err.stack || err);
    }
    return {
        state: nextState,
        error: nextError,
    };
}
/**
 * Runs the reducer on invalidated actions to get a fresh computation log.
 */
function recomputeStates(computedStates, minInvalidatedStateIndex, reducer, committedState, actionsById, stagedActionIds, skippedActionIds, errorHandler, isPaused) {
    // Optimization: exit early and return the same reference
    // if we know nothing could have changed.
    if (minInvalidatedStateIndex >= computedStates.length &&
        computedStates.length === stagedActionIds.length) {
        return computedStates;
    }
    var nextComputedStates = computedStates.slice(0, minInvalidatedStateIndex);
    // If the recording is paused, recompute all states up until the pause state,
    // else recompute all states.
    var lastIncludedActionId = stagedActionIds.length - (isPaused ? 1 : 0);
    for (var i = minInvalidatedStateIndex; i < lastIncludedActionId; i++) {
        var actionId = stagedActionIds[i];
        var action = actionsById[actionId].action;
        var previousEntry = nextComputedStates[i - 1];
        var previousState = previousEntry ? previousEntry.state : committedState;
        var previousError = previousEntry ? previousEntry.error : undefined;
        var shouldSkip = skippedActionIds.indexOf(actionId) > -1;
        var entry = shouldSkip
            ? previousEntry
            : computeNextEntry(reducer, action, previousState, previousError, errorHandler);
        nextComputedStates.push(entry);
    }
    // If the recording is paused, the last state will not be recomputed,
    // because it's essentially not part of the state history.
    if (isPaused) {
        nextComputedStates.push(computedStates[computedStates.length - 1]);
    }
    return nextComputedStates;
}
export function liftInitialState(initialCommittedState, monitorReducer) {
    return {
        monitorState: monitorReducer(undefined, {}),
        nextActionId: 1,
        actionsById: { 0: liftAction(INIT_ACTION) },
        stagedActionIds: [0],
        skippedActionIds: [],
        committedState: initialCommittedState,
        currentStateIndex: 0,
        computedStates: [],
        isLocked: false,
        isPaused: false,
    };
}
/**
 * Creates a history state reducer from an app's reducer.
 */
export function liftReducerWith(initialCommittedState, initialLiftedState, errorHandler, monitorReducer, options) {
    if (options === void 0) { options = {}; }
    /**
     * Manages how the history actions modify the history state.
     */
    return function (reducer) { return function (liftedState, liftedAction) {
        var _a;
        var _b = liftedState || initialLiftedState, monitorState = _b.monitorState, actionsById = _b.actionsById, nextActionId = _b.nextActionId, stagedActionIds = _b.stagedActionIds, skippedActionIds = _b.skippedActionIds, committedState = _b.committedState, currentStateIndex = _b.currentStateIndex, computedStates = _b.computedStates, isLocked = _b.isLocked, isPaused = _b.isPaused;
        if (!liftedState) {
            // Prevent mutating initialLiftedState
            actionsById = Object.create(actionsById);
        }
        function commitExcessActions(n) {
            // Auto-commits n-number of excess actions.
            var excess = n;
            var idsToDelete = stagedActionIds.slice(1, excess + 1);
            for (var i = 0; i < idsToDelete.length; i++) {
                if (computedStates[i + 1].error) {
                    // Stop if error is found. Commit actions up to error.
                    excess = i;
                    idsToDelete = stagedActionIds.slice(1, excess + 1);
                    break;
                }
                else {
                    delete actionsById[idsToDelete[i]];
                }
            }
            skippedActionIds = skippedActionIds.filter(function (id) { return idsToDelete.indexOf(id) === -1; });
            stagedActionIds = tslib_1.__spread([0], stagedActionIds.slice(excess + 1));
            committedState = computedStates[excess].state;
            computedStates = computedStates.slice(excess);
            currentStateIndex =
                currentStateIndex > excess ? currentStateIndex - excess : 0;
        }
        function commitChanges() {
            // Consider the last committed state the new starting point.
            // Squash any staged actions into a single committed state.
            actionsById = { 0: liftAction(INIT_ACTION) };
            nextActionId = 1;
            stagedActionIds = [0];
            skippedActionIds = [];
            committedState = computedStates[currentStateIndex].state;
            currentStateIndex = 0;
            computedStates = [];
        }
        // By default, aggressively recompute every state whatever happens.
        // This has O(n) performance, so we'll override this to a sensible
        // value whenever we feel like we don't have to recompute the states.
        var minInvalidatedStateIndex = 0;
        switch (liftedAction.type) {
            case DevtoolsActions.LOCK_CHANGES: {
                isLocked = liftedAction.status;
                minInvalidatedStateIndex = Infinity;
                break;
            }
            case DevtoolsActions.PAUSE_RECORDING: {
                isPaused = liftedAction.status;
                if (isPaused) {
                    // Add a pause action to signal the devtools-user the recording is paused.
                    // The corresponding state will be overwritten on each update to always contain
                    // the latest state (see Actions.PERFORM_ACTION).
                    stagedActionIds = tslib_1.__spread(stagedActionIds, [nextActionId]);
                    actionsById[nextActionId] = new PerformAction({
                        type: '@ngrx/devtools/pause',
                    }, +Date.now());
                    nextActionId++;
                    minInvalidatedStateIndex = stagedActionIds.length - 1;
                    computedStates = computedStates.concat(computedStates[computedStates.length - 1]);
                    if (currentStateIndex === stagedActionIds.length - 2) {
                        currentStateIndex++;
                    }
                    minInvalidatedStateIndex = Infinity;
                }
                else {
                    commitChanges();
                }
                break;
            }
            case DevtoolsActions.RESET: {
                // Get back to the state the store was created with.
                actionsById = { 0: liftAction(INIT_ACTION) };
                nextActionId = 1;
                stagedActionIds = [0];
                skippedActionIds = [];
                committedState = initialCommittedState;
                currentStateIndex = 0;
                computedStates = [];
                break;
            }
            case DevtoolsActions.COMMIT: {
                commitChanges();
                break;
            }
            case DevtoolsActions.ROLLBACK: {
                // Forget about any staged actions.
                // Start again from the last committed state.
                actionsById = { 0: liftAction(INIT_ACTION) };
                nextActionId = 1;
                stagedActionIds = [0];
                skippedActionIds = [];
                currentStateIndex = 0;
                computedStates = [];
                break;
            }
            case DevtoolsActions.TOGGLE_ACTION: {
                // Toggle whether an action with given ID is skipped.
                // Being skipped means it is a no-op during the computation.
                var actionId_1 = liftedAction.id;
                var index = skippedActionIds.indexOf(actionId_1);
                if (index === -1) {
                    skippedActionIds = tslib_1.__spread([actionId_1], skippedActionIds);
                }
                else {
                    skippedActionIds = skippedActionIds.filter(function (id) { return id !== actionId_1; });
                }
                // Optimization: we know history before this action hasn't changed
                minInvalidatedStateIndex = stagedActionIds.indexOf(actionId_1);
                break;
            }
            case DevtoolsActions.SET_ACTIONS_ACTIVE: {
                // Toggle whether an action with given ID is skipped.
                // Being skipped means it is a no-op during the computation.
                var start = liftedAction.start, end = liftedAction.end, active = liftedAction.active;
                var actionIds = [];
                for (var i = start; i < end; i++)
                    actionIds.push(i);
                if (active) {
                    skippedActionIds = difference(skippedActionIds, actionIds);
                }
                else {
                    skippedActionIds = tslib_1.__spread(skippedActionIds, actionIds);
                }
                // Optimization: we know history before this action hasn't changed
                minInvalidatedStateIndex = stagedActionIds.indexOf(start);
                break;
            }
            case DevtoolsActions.JUMP_TO_STATE: {
                // Without recomputing anything, move the pointer that tell us
                // which state is considered the current one. Useful for sliders.
                currentStateIndex = liftedAction.index;
                // Optimization: we know the history has not changed.
                minInvalidatedStateIndex = Infinity;
                break;
            }
            case DevtoolsActions.JUMP_TO_ACTION: {
                // Jumps to a corresponding state to a specific action.
                // Useful when filtering actions.
                var index = stagedActionIds.indexOf(liftedAction.actionId);
                if (index !== -1)
                    currentStateIndex = index;
                minInvalidatedStateIndex = Infinity;
                break;
            }
            case DevtoolsActions.SWEEP: {
                // Forget any actions that are currently being skipped.
                stagedActionIds = difference(stagedActionIds, skippedActionIds);
                skippedActionIds = [];
                currentStateIndex = Math.min(currentStateIndex, stagedActionIds.length - 1);
                break;
            }
            case DevtoolsActions.PERFORM_ACTION: {
                // Ignore action and return state as is if recording is locked
                if (isLocked) {
                    return liftedState || initialLiftedState;
                }
                if (isPaused ||
                    (liftedState &&
                        isActionFiltered(liftedState.computedStates[currentStateIndex], liftedAction, options.predicate, options.actionsSafelist, options.actionsBlocklist))) {
                    // If recording is paused or if the action should be ignored, overwrite the last state
                    // (corresponds to the pause action) and keep everything else as is.
                    // This way, the app gets the new current state while the devtools
                    // do not record another action.
                    var lastState = computedStates[computedStates.length - 1];
                    computedStates = tslib_1.__spread(computedStates.slice(0, -1), [
                        computeNextEntry(reducer, liftedAction.action, lastState.state, lastState.error, errorHandler),
                    ]);
                    minInvalidatedStateIndex = Infinity;
                    break;
                }
                // Auto-commit as new actions come in.
                if (options.maxAge && stagedActionIds.length === options.maxAge) {
                    commitExcessActions(1);
                }
                if (currentStateIndex === stagedActionIds.length - 1) {
                    currentStateIndex++;
                }
                var actionId = nextActionId++;
                // Mutation! This is the hottest path, and we optimize on purpose.
                // It is safe because we set a new key in a cache dictionary.
                actionsById[actionId] = liftedAction;
                stagedActionIds = tslib_1.__spread(stagedActionIds, [actionId]);
                // Optimization: we know that only the new action needs computing.
                minInvalidatedStateIndex = stagedActionIds.length - 1;
                break;
            }
            case DevtoolsActions.IMPORT_STATE: {
                // Completely replace everything.
                (_a = liftedAction.nextLiftedState, monitorState = _a.monitorState, actionsById = _a.actionsById, nextActionId = _a.nextActionId, stagedActionIds = _a.stagedActionIds, skippedActionIds = _a.skippedActionIds, committedState = _a.committedState, currentStateIndex = _a.currentStateIndex, computedStates = _a.computedStates, isLocked = _a.isLocked, 
                // prettier-ignore
                isPaused = _a.isPaused);
                break;
            }
            case INIT: {
                // Always recompute states on hot reload and init.
                minInvalidatedStateIndex = 0;
                if (options.maxAge && stagedActionIds.length > options.maxAge) {
                    // States must be recomputed before committing excess.
                    computedStates = recomputeStates(computedStates, minInvalidatedStateIndex, reducer, committedState, actionsById, stagedActionIds, skippedActionIds, errorHandler, isPaused);
                    commitExcessActions(stagedActionIds.length - options.maxAge);
                    // Avoid double computation.
                    minInvalidatedStateIndex = Infinity;
                }
                break;
            }
            case UPDATE: {
                var stateHasErrors = computedStates.filter(function (state) { return state.error; }).length > 0;
                if (stateHasErrors) {
                    // Recompute all states
                    minInvalidatedStateIndex = 0;
                    if (options.maxAge && stagedActionIds.length > options.maxAge) {
                        // States must be recomputed before committing excess.
                        computedStates = recomputeStates(computedStates, minInvalidatedStateIndex, reducer, committedState, actionsById, stagedActionIds, skippedActionIds, errorHandler, isPaused);
                        commitExcessActions(stagedActionIds.length - options.maxAge);
                        // Avoid double computation.
                        minInvalidatedStateIndex = Infinity;
                    }
                }
                else {
                    // If not paused/locked, add a new action to signal devtools-user
                    // that there was a reducer update.
                    if (!isPaused && !isLocked) {
                        if (currentStateIndex === stagedActionIds.length - 1) {
                            currentStateIndex++;
                        }
                        // Add a new action to only recompute state
                        var actionId = nextActionId++;
                        actionsById[actionId] = new PerformAction(liftedAction, +Date.now());
                        stagedActionIds = tslib_1.__spread(stagedActionIds, [actionId]);
                        minInvalidatedStateIndex = stagedActionIds.length - 1;
                        computedStates = recomputeStates(computedStates, minInvalidatedStateIndex, reducer, committedState, actionsById, stagedActionIds, skippedActionIds, errorHandler, isPaused);
                    }
                    // Recompute state history with latest reducer and update action
                    computedStates = computedStates.map(function (cmp) { return (tslib_1.__assign({}, cmp, { state: reducer(cmp.state, RECOMPUTE_ACTION) })); });
                    currentStateIndex = stagedActionIds.length - 1;
                    if (options.maxAge && stagedActionIds.length > options.maxAge) {
                        commitExcessActions(stagedActionIds.length - options.maxAge);
                    }
                    // Avoid double computation.
                    minInvalidatedStateIndex = Infinity;
                }
                break;
            }
            default: {
                // If the action is not recognized, it's a monitor action.
                // Optimization: a monitor action can't change history.
                minInvalidatedStateIndex = Infinity;
                break;
            }
        }
        computedStates = recomputeStates(computedStates, minInvalidatedStateIndex, reducer, committedState, actionsById, stagedActionIds, skippedActionIds, errorHandler, isPaused);
        monitorState = monitorReducer(monitorState, liftedAction);
        return {
            monitorState: monitorState,
            actionsById: actionsById,
            nextActionId: nextActionId,
            stagedActionIds: stagedActionIds,
            skippedActionIds: skippedActionIds,
            committedState: committedState,
            currentStateIndex: currentStateIndex,
            computedStates: computedStates,
            isLocked: isLocked,
            isPaused: isPaused,
        };
    }; };
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVkdWNlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL21vZHVsZXMvc3RvcmUtZGV2dG9vbHMvc3JjL3JlZHVjZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUNBLE9BQU8sRUFBeUIsTUFBTSxFQUFFLElBQUksRUFBRSxNQUFNLGFBQWEsQ0FBQztBQUVsRSxPQUFPLEVBQUUsVUFBVSxFQUFFLFVBQVUsRUFBRSxnQkFBZ0IsRUFBRSxNQUFNLFNBQVMsQ0FBQztBQUNuRSxPQUFPLEtBQUssZUFBZSxNQUFNLFdBQVcsQ0FBQztBQUU3QyxPQUFPLEVBQUUsYUFBYSxFQUFFLE1BQU0sV0FBVyxDQUFDO0FBYTFDLE1BQU0sQ0FBQyxJQUFNLFdBQVcsR0FBRyxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsQ0FBQztBQUUxQyxNQUFNLENBQUMsSUFBTSxTQUFTLEdBQUcsZ0NBQW9FLENBQUM7QUFDOUYsTUFBTSxDQUFDLElBQU0sZ0JBQWdCLEdBQUcsRUFBRSxJQUFJLEVBQUUsU0FBUyxFQUFFLENBQUM7QUE2QnBEOztHQUVHO0FBQ0gsU0FBUyxnQkFBZ0IsQ0FDdkIsT0FBZ0MsRUFDaEMsTUFBYyxFQUNkLEtBQVUsRUFDVixLQUFVLEVBQ1YsWUFBMEI7SUFFMUIsSUFBSSxLQUFLLEVBQUU7UUFDVCxPQUFPO1lBQ0wsS0FBSyxPQUFBO1lBQ0wsS0FBSyxFQUFFLHNDQUFzQztTQUM5QyxDQUFDO0tBQ0g7SUFFRCxJQUFJLFNBQVMsR0FBRyxLQUFLLENBQUM7SUFDdEIsSUFBSSxTQUFTLENBQUM7SUFDZCxJQUFJO1FBQ0YsU0FBUyxHQUFHLE9BQU8sQ0FBQyxLQUFLLEVBQUUsTUFBTSxDQUFDLENBQUM7S0FDcEM7SUFBQyxPQUFPLEdBQUcsRUFBRTtRQUNaLFNBQVMsR0FBRyxHQUFHLENBQUMsUUFBUSxFQUFFLENBQUM7UUFDM0IsWUFBWSxDQUFDLFdBQVcsQ0FBQyxHQUFHLENBQUMsS0FBSyxJQUFJ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QVksY0FBQTtZQUNaLFdBQVcsYUFBQTtZQUNYLFlBQVksY0FBQTtZQUNaLGVBQWUsaUJBQUE7WUFDZixnQkFBZ0Isa0JBQUE7WUFDaEIsY0FBYyxnQkFBQTtZQUNkLGlCQUFpQixtQkFBQTtZQUNqQixjQUFjLGdCQUFBO1lBQ2QsUUFBUSxVQUFBO1lBQ1IsUUFBUSxVQUFBO1NBQ1QsQ0FBQztJQUNKLENBQUMsRUFqWXlDLENBaVl6QyxDQUFDO0FBQ0osQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEVycm9ySGFuZGxlciB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgQWN0aW9uLCBBY3Rpb25SZWR1Y2VyLCBVUERBVEUsIElOSVQgfSBmcm9tICdAbmdyeC9zdG9yZSc7XG5cbmltcG9ydCB7IGRpZmZlcmVuY2UsIGxpZnRBY3Rpb24sIGlzQWN0aW9uRmlsdGVyZWQgfSBmcm9tICcuL3V0aWxzJztcbmltcG9ydCAqIGFzIERldnRvb2xzQWN0aW9ucyBmcm9tICcuL2FjdGlvbnMnO1xuaW1wb3J0IHsgU3RvcmVEZXZ0b29sc0NvbmZpZyB9IGZyb20gJy4vY29uZmlnJztcbmltcG9ydCB7IFBlcmZvcm1BY3Rpb24gfSBmcm9tICcuL2FjdGlvbnMnO1xuXG5leHBvcnQgdHlwZSBJbml0QWN0aW9uID0ge1xuICByZWFkb25seSB0eXBlOiB0eXBlb2YgSU5JVDtcbn07XG5cbmV4cG9ydCB0eXBlIFVwZGF0ZVJlZHVjZXJBY3Rpb24gPSB7XG4gIHJlYWRvbmx5IHR5cGU6IHR5cGVvZiBVUERBVEU7XG59O1xuXG5leHBvcnQgdHlwZSBDb3JlQWN0aW9ucyA9IEluaXRBY3Rpb24gfCBVcGRhdGVSZWR1Y2VyQWN0aW9uO1xuZXhwb3J0IHR5cGUgQWN0aW9ucyA9IERldnRvb2xzQWN0aW9ucy5BbGwgfCBDb3JlQWN0aW9ucztcblxuZXhwb3J0IGNvbnN0IElOSVRfQUNUSU9OID0geyB0eXBlOiBJTklUIH07XG5cbmV4cG9ydCBjb25zdCBSRUNPTVBVVEUgPSAnQG5ncngvc3RvcmUtZGV2dG9vbHMvcmVjb21wdXRlJyBhcyAnQG5ncngvc3RvcmUtZGV2dG9vbHMvcmVjb21wdXRlJztcbmV4cG9ydCBjb25zdCBSRUNPTVBVVEVfQUNUSU9OID0geyB0eXBlOiBSRUNPTVBVVEUgfTtcblxuZXhwb3J0IGludGVyZmFjZSBDb21wdXRlZFN0YXRlIHtcbiAgc3RhdGU6IGFueTtcbiAgZXJyb3I6IGFueTtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBMaWZ0ZWRBY3Rpb24ge1xuICB0eXBlOiBzdHJpbmc7XG4gIGFjdGlvbjogQWN0aW9uO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIExpZnRlZEFjdGlvbnMge1xuICBbaWQ6IG51bWJlcl06IExpZnRlZEFjdGlvbjtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBMaWZ0ZWRTdGF0ZSB7XG4gIG1vbml0b3JTdGF0ZTogYW55O1xuICBuZXh0QWN0aW9uSWQ6IG51bWJlcjtcbiAgYWN0aW9uc0J5SWQ6IExpZnRlZEFjdGlvbnM7XG4gIHN0YWdlZEFjdGlvbklkczogbnVtYmVyW107XG4gIHNraXBwZWRBY3Rpb25JZHM6IG51bWJlcltdO1xuICBjb21taXR0ZWRTdGF0ZTogYW55O1xuICBjdXJyZW50U3RhdGVJbmRleDogbnVtYmVyO1xuICBjb21wdXRlZFN0YXRlczogQ29tcHV0ZWRTdGF0ZVtdO1xuICBpc0xvY2tlZDogYm9vbGVhbjtcbiAgaXNQYXVzZWQ6IGJvb2xlYW47XG59XG5cbi8qKlxuICogQ29tcHV0ZXMgdGhlIG5leHQgZW50cnkgaW4gdGhlIGxvZyBieSBhcHBseWluZyBhbiBhY3Rpb24uXG4gKi9cbmZ1bmN0aW9uIGNvbXB1dGVOZXh0RW50cnkoXG4gIHJlZHVjZXI6IEFjdGlvblJlZHVjZXI8YW55LCBhbnk+LFxuICBhY3Rpb246IEFjdGlvbixcbiAgc3RhdGU6IGFueSxcbiAgZXJyb3I6IGFueSxcbiAgZXJyb3JIYW5kbGVyOiBFcnJvckhhbmRsZXJcbikge1xuICBpZiAoZXJyb3IpIHtcbiAgICByZXR1cm4ge1xuICAgICAgc3RhdGUsXG4gICAgICBlcnJvcjogJ0ludGVycnVwdGVkIGJ5IGFuIGVycm9yIHVwIHRoZSBjaGFpbicsXG4gICAgfTtcbiAgfVxuXG4gIGxldCBuZXh0U3RhdGUgPSBzdGF0ZTtcbiAgbGV0IG5leHRFcnJvcjtcbiAgdHJ5IHtcbiAgICBuZXh0U3RhdGUgPSByZWR1Y2VyKHN0YXRlLCBhY3Rpb24pO1xuICB9IGNhdGNoIChlcnIpIHtcbiAgICBuZXh0RXJyb3IgPSBlcnIudG9TdHJpbmcoKTtcbiAgICBlcnJvckhhbmRsZXIuaGFuZGxlRXJyb3IoZXJyLnN0YWNrIHx8IGVycik7XG4gIH1cblxuICByZXR1cm4ge1xuICAgIHN0YXRlOiBuZXh0U3RhdGUsXG4gICAgZXJyb3I6IG5leHRFcnJvcixcbiAgfTtcbn1cblxuLyoqXG4gKiBSdW5zIHRoZSByZWR1Y2VyIG9uIGludmFsaWRhdGVkIGFjdGlvbnMgdG8gZ2V0IGEgZnJlc2ggY29tcHV0YXRpb24gbG9nLlxuICovXG5mdW5jdGlvbiByZWNvbXB1dGVTdGF0ZXMoXG4gIGNvbXB1dGVkU3RhdGVzOiBDb21wdXRlZFN0YXRlW10sXG4gIG1pbkludmFsaWRhdGVkU3RhdGVJbmRleDogbnVtYmVyLFxuICByZWR1Y2VyOiBBY3Rpb25SZWR1Y2VyPGFueSwgYW55PixcbiAgY29tbWl0dGVkU3RhdGU6IGFueSxcbiAgYWN0aW9uc0J5SWQ6IExpZnRlZEFjdGlvbnMsXG4gIHN0YWdlZEFjdGlvbklkczogbnVtYmVyW10sXG4gIHNraXBwZWRBY3Rpb25JZHM6IG51bWJlcltdLFxuICBlcnJvckhhbmRsZXI6IEVycm9ySGFuZGxlcixcbiAgaXNQYXVzZWQ6IGJvb2xlYW5cbikge1xuICAvLyBPcHRpbWl6YXRpb246IGV4aXQgZWFybHkgYW5kIHJldHVybiB0aGUgc2FtZSByZWZlcmVuY2VcbiAgLy8gaWYgd2Uga25vdyBub3RoaW5nIGNvdWxkIGhhdmUgY2hhbmdlZC5cbiAgaWYgKFxuICAgIG1pbkludmFsaWRhdGVkU3RhdGVJbmRleCA+PSBjb21wdXRlZFN0YXRlcy5sZW5ndGggJiZcbiAgICBjb21wdXRlZFN0YXRlcy5sZW5ndGggPT09IHN0YWdlZEFjdGlvbklkcy5sZW5ndGhcbiAgKSB7XG4gICAgcmV0dXJuIGNvbXB1dGVkU3RhdGVzO1xuICB9XG5cbiAgY29uc3QgbmV4dENvbXB1dGVkU3RhdGVzID0gY29tcHV0ZWRTdGF0ZXMuc2xpY2UoMCwgbWluSW52YWxpZGF0ZWRTdGF0ZUluZGV4KTtcbiAgLy8gSWYgdGhlIHJlY29yZGluZyBpcyBwYXVzZWQsIHJlY29tcHV0ZSBhbGwgc3RhdGVzIHVwIHVudGlsIHRoZSBwYXVzZSBzdGF0ZSxcbiAgLy8gZWxzZSByZWNvbXB1dGUgYWxsIHN0YXRlcy5cbiAgY29uc3QgbGFzdEluY2x1ZGVkQWN0aW9uSWQgPSBzdGFnZWRBY3Rpb25JZHMubGVuZ3RoIC0gKGlzUGF1c2VkID8gMSA6IDApO1xuICBmb3IgKGxldCBpID0gbWluSW52YWxpZGF0ZWRTdGF0ZUluZGV4OyBpIDwgbGFzdEluY2x1ZGVkQWN0aW9uSWQ7IGkrKykge1xuICAgIGNvbnN0IGFjdGlvbklkID0gc3RhZ2VkQWN0aW9uSWRzW2ldO1xuICAgIGNvbnN0IGFjdGlvbiA9IGFjdGlvbnNCeUlkW2FjdGlvbklkXS5hY3Rpb247XG5cbiAgICBjb25zdCBwcmV2aW91c0VudHJ5ID0gbmV4dENvbXB1dGVkU3RhdGVzW2kgLSAxXTtcbiAgICBjb25zdCBwcmV2aW91c1N0YXRlID0gcHJldmlvdXNFbnRyeSA/IHByZXZpb3VzRW50cnkuc3RhdGUgOiBjb21taXR0ZWRTdGF0ZTtcbiAgICBjb25zdCBwcmV2aW91c0Vycm9yID0gcHJldmlvdXNFbnRyeSA/IHByZXZpb3VzRW50cnkuZXJyb3IgOiB1bmRlZmluZWQ7XG5cbiAgICBjb25zdCBzaG91bGRTa2lwID0gc2tpcHBlZEFjdGlvbklkcy5pbmRleE9mKGFjdGlvbklkKSA+IC0xO1xuICAgIGNvbnN0IGVudHJ5OiBDb21wdXRlZFN0YXRlID0gc2hvdWxkU2tpcFxuICAgICAgPyBwcmV2aW91c0VudHJ5XG4gICAgICA6IGNvbXB1dGVOZXh0RW50cnkoXG4gICAgICAgICAgcmVkdWNlcixcbiAgICAgICAgICBhY3Rpb24sXG4gICAgICAgICAgcHJldmlvdXNTdGF0ZSxcbiAgICAgICAgICBwcmV2aW91c0Vycm9yLFxuICAgICAgICAgIGVycm9ySGFuZGxlclxuICAgICAgICApO1xuXG4gICAgbmV4dENvbXB1dGVkU3RhdGVzLnB1c2goZW50cnkpO1xuICB9XG4gIC8vIElmIHRoZSByZWNvcmRpbmcgaXMgcGF1c2VkLCB0aGUgbGFzdCBzdGF0ZSB3aWxsIG5vdCBiZSByZWNvbXB1dGVkLFxuICAvLyBiZWNhdXNlIGl0J3MgZXNzZW50aWFsbHkgbm90IHBhcnQgb2YgdGhlIHN0YXRlIGhpc3RvcnkuXG4gIGlmIChpc1BhdXNlZCkge1xuICAgIG5leHRDb21wdXRlZFN0YXRlcy5wdXNoKGNvbXB1dGVkU3RhdGVzW2NvbXB1dGVkU3RhdGVzLmxlbmd0aCAtIDFdKTtcbiAgfVxuXG4gIHJldHVybiBuZXh0Q29tcHV0ZWRTdGF0ZXM7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBsaWZ0SW5pdGlhbFN0YXRlKFxuICBpbml0aWFsQ29tbWl0dGVkU3RhdGU/OiBhbnksXG4gIG1vbml0b3JSZWR1Y2VyPzogYW55XG4pOiBMaWZ0ZWRTdGF0ZSB7XG4gIHJldHVybiB7XG4gICAgbW9uaXRvclN0YXRlOiBtb25pdG9yUmVkdWNlcih1bmRlZmluZWQsIHt9KSxcbiAgICBuZXh0QWN0aW9uSWQ6IDEsXG4gICAgYWN0aW9uc0J5SWQ6IHsgMDogbGlmdEFjdGlvbihJTklUX0FDVElPTikgfSxcbiAgICBzdGFnZWRBY3Rpb25JZHM6IFswXSxcbiAgICBza2lwcGVkQWN0aW9uSWRzOiBbXSxcbiAgICBjb21taXR0ZWRTdGF0ZTogaW5pdGlhbENvbW1pdHRlZFN0YXRlLFxuICAgIGN1cnJlbnRTdGF0ZUluZGV4OiAwLFxuICAgIGNvbXB1dGVkU3RhdGVzOiBbXSxcbiAgICBpc0xvY2tlZDogZmFsc2UsXG4gICAgaXNQYXVzZWQ6IGZhbHNlLFxuICB9O1xufVxuXG4vKipcbiAqIENyZWF0ZXMgYSBoaXN0b3J5IHN0YXRlIHJlZHVjZXIgZnJvbSBhbiBhcHAncyByZWR1Y2VyLlxuICovXG5leHBvcnQgZnVuY3Rpb24gbGlmdFJlZHVjZXJXaXRoKFxuICBpbml0aWFsQ29tbWl0dGVkU3RhdGU6IGFueSxcbiAgaW5pdGlhbExpZnRlZFN0YXRlOiBMaWZ0ZWRTdGF0ZSxcbiAgZXJyb3JIYW5kbGVyOiBFcnJvckhhbmRsZXIsXG4gIG1vbml0b3JSZWR1Y2VyPzogYW55LFxuICBvcHRpb25zOiBQYXJ0aWFsPFN0b3JlRGV2dG9vbHNDb25maWc+ID0ge31cbikge1xuICAvKipcbiAgICogTWFuYWdlcyBob3cgdGhlIGhpc3RvcnkgYWN0aW9ucyBtb2RpZnkgdGhlIGhpc3Rvcnkgc3RhdGUuXG4gICAqL1xuICByZXR1cm4gKFxuICAgIHJlZHVjZXI6IEFjdGlvblJlZHVjZXI8YW55LCBhbnk+XG4gICk6IEFjdGlvblJlZHVjZXI8TGlmdGVkU3RhdGUsIEFjdGlvbnM+ID0+IChsaWZ0ZWRTdGF0ZSwgbGlmdGVkQWN0aW9uKSA9PiB7XG4gICAgbGV0IHtcbiAgICAgIG1vbml0b3JTdGF0ZSxcbiAgICAgIGFjdGlvbnNCeUlkLFxuICAgICAgbmV4dEFjdGlvbklkLFxuICAgICAgc3RhZ2VkQWN0aW9uSWRzLFxuICAgICAgc2tpcHBlZEFjdGlvbklkcyxcbiAgICAgIGNvbW1pdHRlZFN0YXRlLFxuICAgICAgY3VycmVudFN0YXRlSW5kZXgsXG4gICAgICBjb21wdXRlZFN0YXRlcyxcbiAgICAgIGlzTG9ja2VkLFxuICAgICAgaXNQYXVzZWQsXG4gICAgfSA9XG4gICAgICBsaWZ0ZWRTdGF0ZSB8fCBpbml0aWFsTGlmdGVkU3RhdGU7XG5cbiAgICBpZiAoIWxpZnRlZFN0YXRlKSB7XG4gICAgICAvLyBQcmV2ZW50IG11dGF0aW5nIGluaXRpYWxMaWZ0ZWRTdGF0ZVxuICAgICAgYWN0aW9uc0J5SWQgPSBPYmplY3QuY3JlYXRlKGFjdGlvbnNCeUlkKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBjb21taXRFeGNlc3NBY3Rpb25zKG46IG51bWJlcikge1xuICAgICAgLy8gQXV0by1jb21taXRzIG4tbnVtYmVyIG9mIGV4Y2VzcyBhY3Rpb25zLlxuICAgICAgbGV0IGV4Y2VzcyA9IG47XG4gICAgICBsZXQgaWRzVG9EZWxldGUgPSBzdGFnZWRBY3Rpb25JZHMuc2xpY2UoMSwgZXhjZXNzICsgMSk7XG5cbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgaWRzVG9EZWxldGUubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgaWYgKGNvbXB1dGVkU3RhdGVzW2kgKyAxXS5lcnJvcikge1xuICAgICAgICAgIC8vIFN0b3AgaWYgZXJyb3IgaXMgZm91bmQuIENvbW1pdCBhY3Rpb25zIHVwIHRvIGVycm9yLlxuICAgICAgICAgIGV4Y2VzcyA9IGk7XG4gICAgICAgICAgaWRzVG9EZWxldGUgPSBzdGFnZWRBY3Rpb25JZHMuc2xpY2UoMSwgZXhjZXNzICsgMSk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgZGVsZXRlIGFjdGlvbnNCeUlkW2lkc1RvRGVsZXRlW2ldXTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBza2lwcGVkQWN0aW9uSWRzID0gc2tpcHBlZEFjdGlvbklkcy5maWx0ZXIoXG4gICAgICAgIGlkID0+IGlkc1RvRGVsZXRlLmluZGV4T2YoaWQpID09PSAtMVxuICAgICAgKTtcbiAgICAgIHN0YWdlZEFjdGlvbklkcyA9IFswLCAuLi5zdGFnZWRBY3Rpb25JZHMuc2xpY2UoZXhjZXNzICsgMSldO1xuICAgICAgY29tbWl0dGVkU3RhdGUgPSBjb21wdXRlZFN0YXRlc1tleGNlc3NdLnN0YXRlO1xuICAgICAgY29tcHV0ZWRTdGF0ZXMgPSBjb21wdXRlZFN0YXRlcy5zbGljZShleGNlc3MpO1xuICAgICAgY3VycmVudFN0YXRlSW5kZXggPVxuICAgICAgICBjdXJyZW50U3RhdGVJbmRleCA+IGV4Y2VzcyA/IGN1cnJlbnRTdGF0ZUluZGV4IC0gZXhjZXNzIDogMDtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBjb21taXRDaGFuZ2VzKCkge1xuICAgICAgLy8gQ29uc2lkZXIgdGhlIGxhc3QgY29tbWl0dGVkIHN0YXRlIHRoZSBuZXcgc3RhcnRpbmcgcG9pbnQuXG4gICAgICAvLyBTcXVhc2ggYW55IHN0YWdlZCBhY3Rpb25zIGludG8gYSBzaW5nbGUgY29tbWl0dGVkIHN0YXRlLlxuICAgICAgYWN0aW9uc0J5SWQgPSB7IDA6IGxpZnRBY3Rpb24oSU5JVF9BQ1RJT04pIH07XG4gICAgICBuZXh0QWN0aW9uSWQgPSAxO1xuICAgICAgc3RhZ2VkQWN0aW9uSWRzID0gWzBdO1xuICAgICAgc2tpcHBlZEFjdGlvbklkcyA9IFtdO1xuICAgICAgY29tbWl0dGVkU3RhdGUgPSBjb21wdXRlZFN0YXRlc1tjdXJyZW50U3RhdGVJbmRleF0uc3RhdGU7XG4gICAgICBjdXJyZW50U3RhdGVJbmRleCA9IDA7XG4gICAgICBjb21wdXRlZFN0YXRlcyA9IFtdO1xuICAgIH1cblxuICAgIC8vIEJ5IGRlZmF1bHQsIGFnZ3Jlc3NpdmVseSByZWNvbXB1dGUgZXZlcnkgc3RhdGUgd2hhdGV2ZXIgaGFwcGVucy5cbiAgICAvLyBUaGlzIGhhcyBPKG4pIHBlcmZvcm1hbmNlLCBzbyB3ZSdsbCBvdmVycmlkZSB0aGlzIHRvIGEgc2Vuc2libGVcbiAgICAvLyB2YWx1ZSB3aGVuZXZlciB3ZSBmZWVsIGxpa2Ugd2UgZG9uJ3QgaGF2ZSB0byByZWNvbXB1dGUgdGhlIHN0YXRlcy5cbiAgICBsZXQgbWluSW52YWxpZGF0ZWRTdGF0ZUluZGV4ID0gMDtcblxuICAgIHN3aXRjaCAobGlmdGVkQWN0aW9uLnR5cGUpIHtcbiAgICAgIGNhc2UgRGV2dG9vbHNBY3Rpb25zLkxPQ0tfQ0hBTkdFUzoge1xuICAgICAgICBpc0xvY2tlZCA9IGxpZnRlZEFjdGlvbi5zdGF0dXM7XG4gICAgICAgIG1pbkludmFsaWRhdGVkU3RhdGVJbmRleCA9IEluZmluaXR5O1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICAgIGNhc2UgRGV2dG9vbHNBY3Rpb25zLlBBVVNFX1JFQ09SRElORzoge1xuICAgICAgICBpc1BhdXNlZCA9IGxpZnRlZEFjdGlvbi5zdGF0dXM7XG4gICAgICAgIGlmIChpc1BhdXNlZCkge1xuICAgICAgICAgIC8vIEFkZCBhIHBhdXNlIGFjdGlvbiB0byBzaWduYWwgdGhlIGRldnRvb2xzLXVzZXIgdGhlIHJlY29yZGluZyBpcyBwYXVzZWQuXG4gICAgICAgICAgLy8gVGhlIGNvcnJlc3BvbmRpbmcgc3RhdGUgd2lsbCBiZSBvdmVyd3JpdHRlbiBvbiBlYWNoIHVwZGF0ZSB0byBhbHdheXMgY29udGFpblxuICAgICAgICAgIC8vIHRoZSBsYXRlc3Qgc3RhdGUgKHNlZSBBY3Rpb25zLlBFUkZPUk1fQUNUSU9OKS5cbiAgICAgICAgICBzdGFnZWRBY3Rpb25JZHMgPSBbLi4uc3RhZ2VkQWN0aW9uSWRzLCBuZXh0QWN0aW9uSWRdO1xuICAgICAgICAgIGFjdGlvbnNCeUlkW25leHRBY3Rpb25JZF0gPSBuZXcgUGVyZm9ybUFjdGlvbihcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgdHlwZTogJ0BuZ3J4L2RldnRvb2xzL3BhdXNlJyxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICArRGF0ZS5ub3coKVxuICAgICAgICAgICk7XG4gICAgICAgICAgbmV4dEFjdGlvbklkKys7XG4gICAgICAgICAgbWluSW52YWxpZGF0ZWRTdGF0ZUluZGV4ID0gc3RhZ2VkQWN0aW9uSWRzLmxlbmd0aCAtIDE7XG4gICAgICAgICAgY29tcHV0ZWRTdGF0ZXMgPSBjb21wdXRlZFN0YXRlcy5jb25jYXQoXG4gICAgICAgICAgICBjb21wdXRlZFN0YXRlc1tjb21wdXRlZFN0YXRlcy5sZW5ndGggLSAxXVxuICAgICAgICAgICk7XG5cbiAgICAgICAgICBpZiAoY3VycmVudFN0YXRlSW5kZXggPT09IHN0YWdlZEFjdGlvbklkcy5sZW5ndGggLSAyKSB7XG4gICAgICAgICAgICBjdXJyZW50U3RhdGVJbmRleCsrO1xuICAgICAgICAgIH1cbiAgICAgICAgICBtaW5JbnZhbGlkYXRlZFN0YXRlSW5kZXggPSBJbmZpbml0eTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBjb21taXRDaGFuZ2VzKCk7XG4gICAgICAgIH1cbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgICBjYXNlIERldnRvb2xzQWN0aW9ucy5SRVNFVDoge1xuICAgICAgICAvLyBHZXQgYmFjayB0byB0aGUgc3RhdGUgdGhlIHN0b3JlIHdhcyBjcmVhdGVkIHdpdGguXG4gICAgICAgIGFjdGlvbnNCeUlkID0geyAwOiBsaWZ0QWN0aW9uKElOSVRfQUNUSU9OKSB9O1xuICAgICAgICBuZXh0QWN0aW9uSWQgPSAxO1xuICAgICAgICBzdGFnZWRBY3Rpb25JZHMgPSBbMF07XG4gICAgICAgIHNraXBwZWRBY3Rpb25JZHMgPSBbXTtcbiAgICAgICAgY29tbWl0dGVkU3RhdGUgPSBpbml0aWFsQ29tbWl0dGVkU3RhdGU7XG4gICAgICAgIGN1cnJlbnRTdGF0ZUluZGV4ID0gMDtcbiAgICAgICAgY29tcHV0ZWRTdGF0ZXMgPSBbXTtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgICBjYXNlIERldnRvb2xzQWN0aW9ucy5DT01NSVQ6IHtcbiAgICAgICAgY29tbWl0Q2hhbmdlcygpO1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICAgIGNhc2UgRGV2dG9vbHNBY3Rpb25zLlJPTExCQUNLOiB7XG4gICAgICAgIC8vIEZvcmdldCBhYm91dCBhbnkgc3RhZ2VkIGFjdGlvbnMuXG4gICAgICAgIC8vIFN0YXJ0IGFnYWluIGZyb20gdGhlIGxhc3QgY29tbWl0dGVkIHN0YXRlLlxuICAgICAgICBhY3Rpb25zQnlJZCA9IHsgMDogbGlmdEFjdGlvbihJTklUX0FDVElPTikgfTtcbiAgICAgICAgbmV4dEFjdGlvbklkID0gMTtcbiAgICAgICAgc3RhZ2VkQWN0aW9uSWRzID0gWzBdO1xuICAgICAgICBza2lwcGVkQWN0aW9uSWRzID0gW107XG4gICAgICAgIGN1cnJlbnRTdGF0ZUluZGV4ID0gMDtcbiAgICAgICAgY29tcHV0ZWRTdGF0ZXMgPSBbXTtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgICBjYXNlIERldnRvb2xzQWN0aW9ucy5UT0dHTEVfQUNUSU9OOiB7XG4gICAgICAgIC8vIFRvZ2dsZSB3aGV0aGVyIGFuIGFjdGlvbiB3aXRoIGdpdmVuIElEIGlzIHNraXBwZWQuXG4gICAgICAgIC8vIEJlaW5nIHNraXBwZWQgbWVhbnMgaXQgaXMgYSBuby1vcCBkdXJpbmcgdGhlIGNvbXB1dGF0aW9uLlxuICAgICAgICBjb25zdCB7IGlkOiBhY3Rpb25JZCB9ID0gbGlmdGVkQWN0aW9uO1xuICAgICAgICBjb25zdCBpbmRleCA9IHNraXBwZWRBY3Rpb25JZHMuaW5kZXhPZihhY3Rpb25JZCk7XG4gICAgICAgIGlmIChpbmRleCA9PT0gLTEpIHtcbiAgICAgICAgICBza2lwcGVkQWN0aW9uSWRzID0gW2FjdGlvbklkLCAuLi5za2lwcGVkQWN0aW9uSWRzXTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBza2lwcGVkQWN0aW9uSWRzID0gc2tpcHBlZEFjdGlvbklkcy5maWx0ZXIoaWQgPT4gaWQgIT09IGFjdGlvbklkKTtcbiAgICAgICAgfVxuICAgICAgICAvLyBPcHRpbWl6YXRpb246IHdlIGtub3cgaGlzdG9yeSBiZWZvcmUgdGhpcyBhY3Rpb24gaGFzbid0IGNoYW5nZWRcbiAgICAgICAgbWluSW52YWxpZGF0ZWRTdGF0ZUluZGV4ID0gc3RhZ2VkQWN0aW9uSWRzLmluZGV4T2YoYWN0aW9uSWQpO1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICAgIGNhc2UgRGV2dG9vbHNBY3Rpb25zLlNFVF9BQ1RJT05TX0FDVElWRToge1xuICAgICAgICAvLyBUb2dnbGUgd2hldGhlciBhbiBhY3Rpb24gd2l0aCBnaXZlbiBJRCBpcyBza2lwcGVkLlxuICAgICAgICAvLyBCZWluZyBza2lwcGVkIG1lYW5zIGl0IGlzIGEgbm8tb3AgZHVyaW5nIHRoZSBjb21wdXRhdGlvbi5cbiAgICAgICAgY29uc3QgeyBzdGFydCwgZW5kLCBhY3RpdmUgfSA9IGxpZnRlZEFjdGlvbjtcbiAgICAgICAgY29uc3QgYWN0aW9uSWRzID0gW107XG4gICAgICAgIGZvciAobGV0IGkgPSBzdGFydDsgaSA8IGVuZDsgaSsrKSBhY3Rpb25JZHMucHVzaChpKTtcbiAgICAgICAgaWYgKGFjdGl2ZSkge1xuICAgICAgICAgIHNraXBwZWRBY3Rpb25JZHMgPSBkaWZmZXJlbmNlKHNraXBwZWRBY3Rpb25JZHMsIGFjdGlvbklkcyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgc2tpcHBlZEFjdGlvbklkcyA9IFsuLi5za2lwcGVkQWN0aW9uSWRzLCAuLi5hY3Rpb25JZHNdO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gT3B0aW1pemF0aW9uOiB3ZSBrbm93IGhpc3RvcnkgYmVmb3JlIHRoaXMgYWN0aW9uIGhhc24ndCBjaGFuZ2VkXG4gICAgICAgIG1pbkludmFsaWRhdGVkU3RhdGVJbmRleCA9IHN0YWdlZEFjdGlvbklkcy5pbmRleE9mKHN0YXJ0KTtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgICBjYXNlIERldnRvb2xzQWN0aW9ucy5KVU1QX1RPX1NUQVRFOiB7XG4gICAgICAgIC8vIFdpdGhvdXQgcmVjb21wdXRpbmcgYW55dGhpbmcsIG1vdmUgdGhlIHBvaW50ZXIgdGhhdCB0ZWxsIHVzXG4gICAgICAgIC8vIHdoaWNoIHN0YXRlIGlzIGNvbnNpZGVyZWQgdGhlIGN1cnJlbnQgb25lLiBVc2VmdWwgZm9yIHNsaWRlcnMuXG4gICAgICAgIGN1cnJlbnRTdGF0ZUluZGV4ID0gbGlmdGVkQWN0aW9uLmluZGV4O1xuICAgICAgICAvLyBPcHRpbWl6YXRpb246IHdlIGtub3cgdGhlIGhpc3RvcnkgaGFzIG5vdCBjaGFuZ2VkLlxuICAgICAgICBtaW5JbnZhbGlkYXRlZFN0YXRlSW5kZXggPSBJbmZpbml0eTtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgICBjYXNlIERldnRvb2xzQWN0aW9ucy5KVU1QX1RPX0FDVElPTjoge1xuICAgICAgICAvLyBKdW1wcyB0byBhIGNvcnJlc3BvbmRpbmcgc3RhdGUgdG8gYSBzcGVjaWZpYyBhY3Rpb24uXG4gICAgICAgIC8vIFVzZWZ1bCB3aGVuIGZpbHRlcmluZyBhY3Rpb25zLlxuICAgICAgICBjb25zdCBpbmRleCA9IHN0YWdlZEFjdGlvbklkcy5pbmRleE9mKGxpZnRlZEFjdGlvbi5hY3Rpb25JZCk7XG4gICAgICAgIGlmIChpbmRleCAhPT0gLTEpIGN1cnJlbnRTdGF0ZUluZGV4ID0gaW5kZXg7XG4gICAgICAgIG1pbkludmFsaWRhdGVkU3RhdGVJbmRleCA9IEluZmluaXR5O1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICAgIGNhc2UgRGV2dG9vbHNBY3Rpb25zLlNXRUVQOiB7XG4gICAgICAgIC8vIEZvcmdldCBhbnkgYWN0aW9ucyB0aGF0IGFyZSBjdXJyZW50bHkgYmVpbmcgc2tpcHBlZC5cbiAgICAgICAgc3RhZ2VkQWN0aW9uSWRzID0gZGlmZmVyZW5jZShzdGFnZWRBY3Rpb25JZHMsIHNraXBwZWRBY3Rpb25JZHMpO1xuICAgICAgICBza2lwcGVkQWN0aW9uSWRzID0gW107XG4gICAgICAgIGN1cnJlbnRTdGF0ZUluZGV4ID0gTWF0aC5taW4oXG4gICAgICAgICAgY3VycmVudFN0YXRlSW5kZXgsXG4gICAgICAgICAgc3RhZ2VkQWN0aW9uSWRzLmxlbmd0aCAtIDFcbiAgICAgICAgKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgICBjYXNlIERldnRvb2xzQWN0aW9ucy5QRVJGT1JNX0FDVElPTjoge1xuICAgICAgICAvLyBJZ25vcmUgYWN0aW9uIGFuZCByZXR1cm4gc3RhdGUgYXMgaXMgaWYgcmVjb3JkaW5nIGlzIGxvY2tlZFxuICAgICAgICBpZiAoaXNMb2NrZWQpIHtcbiAgICAgICAgICByZXR1cm4gbGlmdGVkU3RhdGUgfHwgaW5pdGlhbExpZnRlZFN0YXRlO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKFxuICAgICAgICAgIGlzUGF1c2VkIHx8XG4gICAgICAgICAgKGxpZnRlZFN0YXRlICYmXG4gICAgICAgICAgICBpc0FjdGlvbkZpbHRlcmVkKFxuICAgICAgICAgICAgICBsaWZ0ZWRTdGF0ZS5jb21wdXRlZFN0YXRlc1tjdXJyZW50U3RhdGVJbmRleF0sXG4gICAgICAgICAgICAgIGxpZnRlZEFjdGlvbixcbiAgICAgICAgICAgICAgb3B0aW9ucy5wcmVkaWNhdGUsXG4gICAgICAgICAgICAgIG9wdGlvbnMuYWN0aW9uc1NhZmVsaXN0LFxuICAgICAgICAgICAgICBvcHRpb25zLmFjdGlvbnNCbG9ja2xpc3RcbiAgICAgICAgICAgICkpXG4gICAgICAgICkge1xuICAgICAgICAgIC8vIElmIHJlY29yZGluZyBpcyBwYXVzZWQgb3IgaWYgdGhlIGFjdGlvbiBzaG91bGQgYmUgaWdub3JlZCwgb3ZlcndyaXRlIHRoZSBsYXN0IHN0YXRlXG4gICAgICAgICAgLy8gKGNvcnJlc3BvbmRzIHRvIHRoZSBwYXVzZSBhY3Rpb24pIGFuZCBrZWVwIGV2ZXJ5dGhpbmcgZWxzZSBhcyBpcy5cbiAgICAgICAgICAvLyBUaGlzIHdheSwgdGhlIGFwcCBnZXRzIHRoZSBuZXcgY3VycmVudCBzdGF0ZSB3aGlsZSB0aGUgZGV2dG9vbHNcbiAgICAgICAgICAvLyBkbyBub3QgcmVjb3JkIGFub3RoZXIgYWN0aW9uLlxuICAgICAgICAgIGNvbnN0IGxhc3RTdGF0ZSA9IGNvbXB1dGVkU3RhdGVzW2NvbXB1dGVkU3RhdGVzLmxlbmd0aCAtIDFdO1xuICAgICAgICAgIGNvbXB1dGVkU3RhdGVzID0gW1xuICAgICAgICAgICAgLi4uY29tcHV0ZWRTdGF0ZXMuc2xpY2UoMCwgLTEpLFxuICAgICAgICAgICAgY29tcHV0ZU5leHRFbnRyeShcbiAgICAgICAgICAgICAgcmVkdWNlcixcbiAgICAgICAgICAgICAgbGlmdGVkQWN0aW9uLmFjdGlvbixcbiAgICAgICAgICAgICAgbGFzdFN0YXRlLnN0YXRlLFxuICAgICAgICAgICAgICBsYXN0U3RhdGUuZXJyb3IsXG4gICAgICAgICAgICAgIGVycm9ySGFuZGxlclxuICAgICAgICAgICAgKSxcbiAgICAgICAgICBdO1xuICAgICAgICAgIG1pbkludmFsaWRhdGVkU3RhdGVJbmRleCA9IEluZmluaXR5O1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gQXV0by1jb21taXQgYXMgbmV3IGFjdGlvbnMgY29tZSBpbi5cbiAgICAgICAgaWYgKG9wdGlvbnMubWF4QWdlICYmIHN0YWdlZEFjdGlvbklkcy5sZW5ndGggPT09IG9wdGlvbnMubWF4QWdlKSB7XG4gICAgICAgICAgY29tbWl0RXhjZXNzQWN0aW9ucygxKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChjdXJyZW50U3RhdGVJbmRleCA9PT0gc3RhZ2VkQWN0aW9uSWRzLmxlbmd0aCAtIDEpIHtcbiAgICAgICAgICBjdXJyZW50U3RhdGVJbmRleCsrO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IGFjdGlvbklkID0gbmV4dEFjdGlvbklkKys7XG4gICAgICAgIC8vIE11dGF0aW9uISBUaGlzIGlzIHRoZSBob3R0ZXN0IHBhdGgsIGFuZCB3ZSBvcHRpbWl6ZSBvbiBwdXJwb3NlLlxuICAgICAgICAvLyBJdCBpcyBzYWZlIGJlY2F1c2Ugd2Ugc2V0IGEgbmV3IGtleSBpbiBhIGNhY2hlIGRpY3Rpb25hcnkuXG4gICAgICAgIGFjdGlvbnNCeUlkW2FjdGlvbklkXSA9IGxpZnRlZEFjdGlvbjtcblxuICAgICAgICBzdGFnZWRBY3Rpb25JZHMgPSBbLi4uc3RhZ2VkQWN0aW9uSWRzLCBhY3Rpb25JZF07XG4gICAgICAgIC8vIE9wdGltaXphdGlvbjogd2Uga25vdyB0aGF0IG9ubHkgdGhlIG5ldyBhY3Rpb24gbmVlZHMgY29tcHV0aW5nLlxuICAgICAgICBtaW5JbnZhbGlkYXRlZFN0YXRlSW5kZXggPSBzdGFnZWRBY3Rpb25JZHMubGVuZ3RoIC0gMTtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgICBjYXNlIERldnRvb2xzQWN0aW9ucy5JTVBPUlRfU1RBVEU6IHtcbiAgICAgICAgLy8gQ29tcGxldGVseSByZXBsYWNlIGV2ZXJ5dGhpbmcuXG4gICAgICAgICh7XG4gICAgICAgICAgbW9uaXRvclN0YXRlLFxuICAgICAgICAgIGFjdGlvbnNCeUlkLFxuICAgICAgICAgIG5leHRBY3Rpb25JZCxcbiAgICAgICAgICBzdGFnZWRBY3Rpb25JZHMsXG4gICAgICAgICAgc2tpcHBlZEFjdGlvbklkcyxcbiAgICAgICAgICBjb21taXR0ZWRTdGF0ZSxcbiAgICAgICAgICBjdXJyZW50U3RhdGVJbmRleCxcbiAgICAgICAgICBjb21wdXRlZFN0YXRlcyxcbiAgICAgICAgICBpc0xvY2tlZCxcbiAgICAgICAgICAvLyBwcmV0dGllci1pZ25vcmVcbiAgICAgICAgICBpc1BhdXNlZFxuICAgICAgICB9ID0gbGlmdGVkQWN0aW9uLm5leHRMaWZ0ZWRTdGF0ZSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgICAgY2FzZSBJTklUOiB7XG4gICAgICAgIC8vIEFsd2F5cyByZWNvbXB1dGUgc3RhdGVzIG9uIGhvdCByZWxvYWQgYW5kIGluaXQuXG4gICAgICAgIG1pbkludmFsaWRhdGVkU3RhdGVJbmRleCA9IDA7XG5cbiAgICAgICAgaWYgKG9wdGlvbnMubWF4QWdlICYmIHN0YWdlZEFjdGlvbklkcy5sZW5ndGggPiBvcHRpb25zLm1heEFnZSkge1xuICAgICAgICAgIC8vIFN0YXRlcyBtdXN0IGJlIHJlY29tcHV0ZWQgYmVmb3JlIGNvbW1pdHRpbmcgZXhjZXNzLlxuICAgICAgICAgIGNvbXB1dGVkU3RhdGVzID0gcmVjb21wdXRlU3RhdGVzKFxuICAgICAgICAgICAgY29tcHV0ZWRTdGF0ZXMsXG4gICAgICAgICAgICBtaW5JbnZhbGlkYXRlZFN0YXRlSW5kZXgsXG4gICAgICAgICAgICByZWR1Y2VyLFxuICAgICAgICAgICAgY29tbWl0dGVkU3RhdGUsXG4gICAgICAgICAgICBhY3Rpb25zQnlJZCxcbiAgICAgICAgICAgIHN0YWdlZEFjdGlvbklkcyxcbiAgICAgICAgICAgIHNraXBwZWRBY3Rpb25JZHMsXG4gICAgICAgICAgICBlcnJvckhhbmRsZXIsXG4gICAgICAgICAgICBpc1BhdXNlZFxuICAgICAgICAgICk7XG5cbiAgICAgICAgICBjb21taXRFeGNlc3NBY3Rpb25zKHN0YWdlZEFjdGlvbklkcy5sZW5ndGggLSBvcHRpb25zLm1heEFnZSk7XG5cbiAgICAgICAgICAvLyBBdm9pZCBkb3VibGUgY29tcHV0YXRpb24uXG4gICAgICAgICAgbWluSW52YWxpZGF0ZWRTdGF0ZUluZGV4ID0gSW5maW5pdHk7XG4gICAgICAgIH1cblxuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICAgIGNhc2UgVVBEQVRFOiB7XG4gICAgICAgIGNvbnN0IHN0YXRlSGFzRXJyb3JzID1cbiAgICAgICAgICBjb21wdXRlZFN0YXRlcy5maWx0ZXIoc3RhdGUgPT4gc3RhdGUuZXJyb3IpLmxlbmd0aCA+IDA7XG5cbiAgICAgICAgaWYgKHN0YXRlSGFzRXJyb3JzKSB7XG4gICAgICAgICAgLy8gUmVjb21wdXRlIGFsbCBzdGF0ZXNcbiAgICAgICAgICBtaW5JbnZhbGlkYXRlZFN0YXRlSW5kZXggPSAwO1xuXG4gICAgICAgICAgaWYgKG9wdGlvbnMubWF4QWdlICYmIHN0YWdlZEFjdGlvbklkcy5sZW5ndGggPiBvcHRpb25zLm1heEFnZSkge1xuICAgICAgICAgICAgLy8gU3RhdGVzIG11c3QgYmUgcmVjb21wdXRlZCBiZWZvcmUgY29tbWl0dGluZyBleGNlc3MuXG4gICAgICAgICAgICBjb21wdXRlZFN0YXRlcyA9IHJlY29tcHV0ZVN0YXRlcyhcbiAgICAgICAgICAgICAgY29tcHV0ZWRTdGF0ZXMsXG4gICAgICAgICAgICAgIG1pbkludmFsaWRhdGVkU3RhdGVJbmRleCxcbiAgICAgICAgICAgICAgcmVkdWNlcixcbiAgICAgICAgICAgICAgY29tbWl0dGVkU3RhdGUsXG4gICAgICAgICAgICAgIGFjdGlvbnNCeUlkLFxuICAgICAgICAgICAgICBzdGFnZWRBY3Rpb25JZHMsXG4gICAgICAgICAgICAgIHNraXBwZWRBY3Rpb25JZHMsXG4gICAgICAgICAgICAgIGVycm9ySGFuZGxlcixcbiAgICAgICAgICAgICAgaXNQYXVzZWRcbiAgICAgICAgICAgICk7XG5cbiAgICAgICAgICAgIGNvbW1pdEV4Y2Vzc0FjdGlvbnMoc3RhZ2VkQWN0aW9uSWRzLmxlbmd0aCAtIG9wdGlvbnMubWF4QWdlKTtcblxuICAgICAgICAgICAgLy8gQXZvaWQgZG91YmxlIGNvbXB1dGF0aW9uLlxuICAgICAgICAgICAgbWluSW52YWxpZGF0ZWRTdGF0ZUluZGV4ID0gSW5maW5pdHk7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIC8vIElmIG5vdCBwYXVzZWQvbG9ja2VkLCBhZGQgYSBuZXcgYWN0aW9uIHRvIHNpZ25hbCBkZXZ0b29scy11c2VyXG4gICAgICAgICAgLy8gdGhhdCB0aGVyZSB3YXMgYSByZWR1Y2VyIHVwZGF0ZS5cbiAgICAgICAgICBpZiAoIWlzUGF1c2VkICYmICFpc0xvY2tlZCkge1xuICAgICAgICAgICAgaWYgKGN1cnJlbnRTdGF0ZUluZGV4ID09PSBzdGFnZWRBY3Rpb25JZHMubGVuZ3RoIC0gMSkge1xuICAgICAgICAgICAgICBjdXJyZW50U3RhdGVJbmRleCsrO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBBZGQgYSBuZXcgYWN0aW9uIHRvIG9ubHkgcmVjb21wdXRlIHN0YXRlXG4gICAgICAgICAgICBjb25zdCBhY3Rpb25JZCA9IG5leHRBY3Rpb25JZCsrO1xuICAgICAgICAgICAgYWN0aW9uc0J5SWRbYWN0aW9uSWRdID0gbmV3IFBlcmZvcm1BY3Rpb24oXG4gICAgICAgICAgICAgIGxpZnRlZEFjdGlvbixcbiAgICAgICAgICAgICAgK0RhdGUubm93KClcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICBzdGFnZWRBY3Rpb25JZHMgPSBbLi4uc3RhZ2VkQWN0aW9uSWRzLCBhY3Rpb25JZF07XG5cbiAgICAgICAgICAgIG1pbkludmFsaWRhdGVkU3RhdGVJbmRleCA9IHN0YWdlZEFjdGlvbklkcy5sZW5ndGggLSAxO1xuXG4gICAgICAgICAgICBjb21wdXRlZFN0YXRlcyA9IHJlY29tcHV0ZVN0YXRlcyhcbiAgICAgICAgICAgICAgY29tcHV0ZWRTdGF0ZXMsXG4gICAgICAgICAgICAgIG1pbkludmFsaWRhdGVkU3RhdGVJbmRleCxcbiAgICAgICAgICAgICAgcmVkdWNlcixcbiAgICAgICAgICAgICAgY29tbWl0dGVkU3RhdGUsXG4gICAgICAgICAgICAgIGFjdGlvbnNCeUlkLFxuICAgICAgICAgICAgICBzdGFnZWRBY3Rpb25JZHMsXG4gICAgICAgICAgICAgIHNraXBwZWRBY3Rpb25JZHMsXG4gICAgICAgICAgICAgIGVycm9ySGFuZGxlcixcbiAgICAgICAgICAgICAgaXNQYXVzZWRcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgLy8gUmVjb21wdXRlIHN0YXRlIGhpc3Rvcnkgd2l0aCBsYXRlc3QgcmVkdWNlciBhbmQgdXBkYXRlIGFjdGlvblxuICAgICAgICAgIGNvbXB1dGVkU3RhdGVzID0gY29tcHV0ZWRTdGF0ZXMubWFwKGNtcCA9PiAoe1xuICAgICAgICAgICAgLi4uY21wLFxuICAgICAgICAgICAgc3RhdGU6IHJlZHVjZXIoY21wLnN0YXRlLCBSRUNPTVBVVEVfQUNUSU9OKSxcbiAgICAgICAgICB9KSk7XG5cbiAgICAgICAgICBjdXJyZW50U3RhdGVJbmRleCA9IHN0YWdlZEFjdGlvbklkcy5sZW5ndGggLSAxO1xuXG4gICAgICAgICAgaWYgKG9wdGlvbnMubWF4QWdlICYmIHN0YWdlZEFjdGlvbklkcy5sZW5ndGggPiBvcHRpb25zLm1heEFnZSkge1xuICAgICAgICAgICAgY29tbWl0RXhjZXNzQWN0aW9ucyhzdGFnZWRBY3Rpb25JZHMubGVuZ3RoIC0gb3B0aW9ucy5tYXhBZ2UpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIC8vIEF2b2lkIGRvdWJsZSBjb21wdXRhdGlvbi5cbiAgICAgICAgICBtaW5JbnZhbGlkYXRlZFN0YXRlSW5kZXggPSBJbmZpbml0eTtcbiAgICAgICAgfVxuXG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgICAgZGVmYXVsdDoge1xuICAgICAgICAvLyBJZiB0aGUgYWN0aW9uIGlzIG5vdCByZWNvZ25pemVkLCBpdCdzIGEgbW9uaXRvciBhY3Rpb24uXG4gICAgICAgIC8vIE9wdGltaXphdGlvbjogYSBtb25pdG9yIGFjdGlvbiBjYW4ndCBjaGFuZ2UgaGlzdG9yeS5cbiAgICAgICAgbWluSW52YWxpZGF0ZWRTdGF0ZUluZGV4ID0gSW5maW5pdHk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH1cblxuICAgIGNvbXB1dGVkU3RhdGVzID0gcmVjb21wdXRlU3RhdGVzKFxuICAgICAgY29tcHV0ZWRTdGF0ZXMsXG4gICAgICBtaW5JbnZhbGlkYXRlZFN0YXRlSW5kZXgsXG4gICAgICByZWR1Y2VyLFxuICAgICAgY29tbWl0dGVkU3RhdGUsXG4gICAgICBhY3Rpb25zQnlJZCxcbiAgICAgIHN0YWdlZEFjdGlvbklkcyxcbiAgICAgIHNraXBwZWRBY3Rpb25JZHMsXG4gICAgICBlcnJvckhhbmRsZXIsXG4gICAgICBpc1BhdXNlZFxuICAgICk7XG4gICAgbW9uaXRvclN0YXRlID0gbW9uaXRvclJlZHVjZXIobW9uaXRvclN0YXRlLCBsaWZ0ZWRBY3Rpb24pO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgIG1vbml0b3JTdGF0ZSxcbiAgICAgIGFjdGlvbnNCeUlkLFxuICAgICAgbmV4dEFjdGlvbklkLFxuICAgICAgc3RhZ2VkQWN0aW9uSWRzLFxuICAgICAgc2tpcHBlZEFjdGlvbklkcyxcbiAgICAgIGNvbW1pdHRlZFN0YXRlLFxuICAgICAgY3VycmVudFN0YXRlSW5kZXgsXG4gICAgICBjb21wdXRlZFN0YXRlcyxcbiAgICAgIGlzTG9ja2VkLFxuICAgICAgaXNQYXVzZWQsXG4gICAgfTtcbiAgfTtcbn1cbiJdfQ==