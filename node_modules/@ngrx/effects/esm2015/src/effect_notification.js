/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/**
 * @record
 */
export function EffectNotification() { }
if (false) {
    /** @type {?} */
    EffectNotification.prototype.effect;
    /** @type {?} */
    EffectNotification.prototype.propertyName;
    /** @type {?} */
    EffectNotification.prototype.sourceName;
    /** @type {?} */
    EffectNotification.prototype.sourceInstance;
    /** @type {?} */
    EffectNotification.prototype.notification;
}
/**
 * @param {?} output
 * @param {?} reporter
 * @return {?}
 */
export function reportInvalidActions(output, reporter) {
    if (output.notification.kind === 'N') {
        /** @type {?} */
        const action = output.notification.value;
        /** @type {?} */
        const isInvalidAction = !isAction(action);
        if (isInvalidAction) {
            reporter.handleError(new Error(`Effect ${getEffectName(output)} dispatched an invalid action: ${stringify(action)}`));
        }
    }
}
/**
 * @param {?} action
 * @return {?}
 */
function isAction(action) {
    return (typeof action !== 'function' &&
        action &&
        action.type &&
        typeof action.type === 'string');
}
/**
 * @param {?} __0
 * @return {?}
 */
function getEffectName({ propertyName, sourceInstance, sourceName, }) {
    /** @type {?} */
    const isMethod = typeof sourceInstance[propertyName] === 'function';
    return `"${sourceName}.${String(propertyName)}${isMethod ? '()' : ''}"`;
}
/**
 * @param {?} action
 * @return {?}
 */
function stringify(action) {
    try {
        return JSON.stringify(action);
    }
    catch (_a) {
        return action;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZWZmZWN0X25vdGlmaWNhdGlvbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL21vZHVsZXMvZWZmZWN0cy9zcmMvZWZmZWN0X25vdGlmaWNhdGlvbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBSUEsd0NBTUM7OztJQUxDLG9DQUFrRDs7SUFDbEQsMENBQTBCOztJQUMxQix3Q0FBbUI7O0lBQ25CLDRDQUFvQjs7SUFDcEIsMENBQXNEOzs7Ozs7O0FBR3hELE1BQU0sVUFBVSxvQkFBb0IsQ0FDbEMsTUFBMEIsRUFDMUIsUUFBc0I7SUFFdEIsSUFBSSxNQUFNLENBQUMsWUFBWSxDQUFDLElBQUksS0FBSyxHQUFHLEVBQUU7O2NBQzlCLE1BQU0sR0FBRyxNQUFNLENBQUMsWUFBWSxDQUFDLEtBQUs7O2NBQ2xDLGVBQWUsR0FBRyxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUM7UUFFekMsSUFBSSxlQUFlLEVBQUU7WUFDbkIsUUFBUSxDQUFDLFdBQVcsQ0FDbEIsSUFBSSxLQUFLLENBQ1AsVUFBVSxhQUFhLENBQ3JCLE1BQU0sQ0FDUCxrQ0FBa0MsU0FBUyxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQ3ZELENBQ0YsQ0FBQztTQUNIO0tBQ0Y7QUFDSCxDQUFDOzs7OztBQUVELFNBQVMsUUFBUSxDQUFDLE1BQVc7SUFDM0IsT0FBTyxDQUNMLE9BQU8sTUFBTSxLQUFLLFVBQVU7UUFDNUIsTUFBTTtRQUNOLE1BQU0sQ0FBQyxJQUFJO1FBQ1gsT0FBTyxNQUFNLENBQUMsSUFBSSxLQUFLLFFBQVEsQ0FDaEMsQ0FBQztBQUNKLENBQUM7Ozs7O0FBRUQsU0FBUyxhQUFhLENBQUMsRUFDckIsWUFBWSxFQUNaLGNBQWMsRUFDZCxVQUFVLEdBQ1M7O1VBQ2IsUUFBUSxHQUFHLE9BQU8sY0FBYyxDQUFDLFlBQVksQ0FBQyxLQUFLLFVBQVU7SUFFbkUsT0FBTyxJQUFJLFVBQVUsSUFBSSxNQUFNLENBQUMsWUFBWSxDQUFDLEdBQUcsUUFBUSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsR0FBRyxDQUFDO0FBQzFFLENBQUM7Ozs7O0FBRUQsU0FBUyxTQUFTLENBQUMsTUFBaUM7SUFDbEQsSUFBSTtRQUNGLE9BQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsQ0FBQztLQUMvQjtJQUFDLFdBQU07UUFDTixPQUFPLE1BQU0sQ0FBQztLQUNmO0FBQ0gsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEVycm9ySGFuZGxlciB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgQWN0aW9uIH0gZnJvbSAnQG5ncngvc3RvcmUnO1xuaW1wb3J0IHsgTm90aWZpY2F0aW9uLCBPYnNlcnZhYmxlIH0gZnJvbSAncnhqcyc7XG5cbmV4cG9ydCBpbnRlcmZhY2UgRWZmZWN0Tm90aWZpY2F0aW9uIHtcbiAgZWZmZWN0OiBPYnNlcnZhYmxlPGFueT4gfCAoKCkgPT4gT2JzZXJ2YWJsZTxhbnk+KTtcbiAgcHJvcGVydHlOYW1lOiBQcm9wZXJ0eUtleTtcbiAgc291cmNlTmFtZTogc3RyaW5nO1xuICBzb3VyY2VJbnN0YW5jZTogYW55O1xuICBub3RpZmljYXRpb246IE5vdGlmaWNhdGlvbjxBY3Rpb24gfCBudWxsIHwgdW5kZWZpbmVkPjtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHJlcG9ydEludmFsaWRBY3Rpb25zKFxuICBvdXRwdXQ6IEVmZmVjdE5vdGlmaWNhdGlvbixcbiAgcmVwb3J0ZXI6IEVycm9ySGFuZGxlclxuKSB7XG4gIGlmIChvdXRwdXQubm90aWZpY2F0aW9uLmtpbmQgPT09ICdOJykge1xuICAgIGNvbnN0IGFjdGlvbiA9IG91dHB1dC5ub3RpZmljYXRpb24udmFsdWU7XG4gICAgY29uc3QgaXNJbnZhbGlkQWN0aW9uID0gIWlzQWN0aW9uKGFjdGlvbik7XG5cbiAgICBpZiAoaXNJbnZhbGlkQWN0aW9uKSB7XG4gICAgICByZXBvcnRlci5oYW5kbGVFcnJvcihcbiAgICAgICAgbmV3IEVycm9yKFxuICAgICAgICAgIGBFZmZlY3QgJHtnZXRFZmZlY3ROYW1lKFxuICAgICAgICAgICAgb3V0cHV0XG4gICAgICAgICAgKX0gZGlzcGF0Y2hlZCBhbiBpbnZhbGlkIGFjdGlvbjogJHtzdHJpbmdpZnkoYWN0aW9uKX1gXG4gICAgICAgIClcbiAgICAgICk7XG4gICAgfVxuICB9XG59XG5cbmZ1bmN0aW9uIGlzQWN0aW9uKGFjdGlvbjogYW55KTogYWN0aW9uIGlzIEFjdGlvbiB7XG4gIHJldHVybiAoXG4gICAgdHlwZW9mIGFjdGlvbiAhPT0gJ2Z1bmN0aW9uJyAmJlxuICAgIGFjdGlvbiAmJlxuICAgIGFjdGlvbi50eXBlICYmXG4gICAgdHlwZW9mIGFjdGlvbi50eXBlID09PSAnc3RyaW5nJ1xuICApO1xufVxuXG5mdW5jdGlvbiBnZXRFZmZlY3ROYW1lKHtcbiAgcHJvcGVydHlOYW1lLFxuICBzb3VyY2VJbnN0YW5jZSxcbiAgc291cmNlTmFtZSxcbn06IEVmZmVjdE5vdGlmaWNhdGlvbikge1xuICBjb25zdCBpc01ldGhvZCA9IHR5cGVvZiBzb3VyY2VJbnN0YW5jZVtwcm9wZXJ0eU5hbWVdID09PSAnZnVuY3Rpb24nO1xuXG4gIHJldHVybiBgXCIke3NvdXJjZU5hbWV9LiR7U3RyaW5nKHByb3BlcnR5TmFtZSl9JHtpc01ldGhvZCA/ICcoKScgOiAnJ31cImA7XG59XG5cbmZ1bmN0aW9uIHN0cmluZ2lmeShhY3Rpb246IEFjdGlvbiB8IG51bGwgfCB1bmRlZmluZWQpIHtcbiAgdHJ5IHtcbiAgICByZXR1cm4gSlNPTi5zdHJpbmdpZnkoYWN0aW9uKTtcbiAgfSBjYXRjaCB7XG4gICAgcmV0dXJuIGFjdGlvbjtcbiAgfVxufVxuIl19