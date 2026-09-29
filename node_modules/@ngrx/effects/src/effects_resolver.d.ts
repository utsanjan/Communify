import { Observable } from 'rxjs';
import { EffectNotification } from './effect_notification';
import { ErrorHandler } from '@angular/core';
export declare function mergeEffects(sourceInstance: any, errorHandler?: ErrorHandler): Observable<EffectNotification>;
