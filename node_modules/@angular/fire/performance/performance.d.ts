import { NgZone, ApplicationRef, InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';
import { performance } from 'firebase/app';
import { FirebaseApp } from '@angular/fire';
export declare const AUTOMATICALLY_TRACE_CORE_NG_METRICS: InjectionToken<boolean>;
export declare const INSTRUMENTATION_ENABLED: InjectionToken<boolean>;
export declare const DATA_COLLECTION_ENABLED: InjectionToken<boolean>;
export declare type TraceOptions = {
    metrics?: {
        [key: string]: number;
    };
    attributes?: {
        [key: string]: string;
    };
    attribute$?: {
        [key: string]: Observable<string>;
    };
    incrementMetric$?: {
        [key: string]: Observable<number | void | null | undefined>;
    };
    metric$?: {
        [key: string]: Observable<number>;
    };
};
export declare class AngularFirePerformance {
    private zone;
    performance: Observable<performance.Performance>;
    constructor(app: FirebaseApp, automaticallyTraceCoreNgMetrics: boolean | null, instrumentationEnabled: boolean | null, dataCollectionEnabled: boolean | null, appRef: ApplicationRef, zone: NgZone);
    trace$: (name: string, options?: TraceOptions | undefined) => Observable<void>;
    traceUntil: <T = any>(name: string, test: (a: T) => boolean, options?: (TraceOptions & {
        orComplete?: boolean | undefined;
    }) | undefined) => (source$: Observable<T>) => Observable<T>;
    traceWhile: <T = any>(name: string, test: (a: T) => boolean, options?: (TraceOptions & {
        orComplete?: boolean | undefined;
    }) | undefined) => (source$: Observable<T>) => Observable<T>;
    traceUntilComplete: <T = any>(name: string, options?: TraceOptions | undefined) => (source$: Observable<T>) => Observable<T>;
    traceUntilFirst: <T = any>(name: string, options?: TraceOptions | undefined) => (source$: Observable<T>) => Observable<T>;
    trace: <T = any>(name: string, options?: TraceOptions | undefined) => (source$: Observable<T>) => Observable<T>;
}
