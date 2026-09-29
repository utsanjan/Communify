import { ErrorHandler } from '@angular/core';
import { Action } from '@ngrx/store';
import { Notification, Observable } from 'rxjs';
export interface EffectNotification {
    effect: Observable<any> | (() => Observable<any>);
    propertyName: PropertyKey;
    sourceName: string;
    sourceInstance: any;
    notification: Notification<Action | null | undefined>;
}
export declare function reportInvalidActions(output: EffectNotification, reporter: ErrorHandler): void;
