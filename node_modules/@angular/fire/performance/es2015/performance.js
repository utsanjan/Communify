var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import { Injectable, NgZone, ApplicationRef, InjectionToken, Inject, Optional } from '@angular/core';
import { Observable, from } from 'rxjs';
import { first, tap, map, shareReplay, switchMap } from 'rxjs/operators';
import { FirebaseApp } from '@angular/fire';
export const AUTOMATICALLY_TRACE_CORE_NG_METRICS = new InjectionToken('angularfire2.performance.auto_trace');
export const INSTRUMENTATION_ENABLED = new InjectionToken('angularfire2.performance.instrumentationEnabled');
export const DATA_COLLECTION_ENABLED = new InjectionToken('angularfire2.performance.dataCollectionEnabled');
let AngularFirePerformance = class AngularFirePerformance {
    constructor(app, automaticallyTraceCoreNgMetrics, instrumentationEnabled, dataCollectionEnabled, appRef, zone) {
        this.zone = zone;
        this.trace$ = (name, options) => this.performance.pipe(switchMap(performance => new Observable(emitter => this.zone.runOutsideAngular(() => {
            const trace = performance.trace(name);
            options && options.metrics && Object.keys(options.metrics).forEach(metric => {
                trace.putMetric(metric, options.metrics[metric]);
            });
            options && options.attributes && Object.keys(options.attributes).forEach(attribute => {
                trace.putAttribute(attribute, options.attributes[attribute]);
            });
            const attributeSubscriptions = options && options.attribute$ ? Object.keys(options.attribute$).map(attribute => options.attribute$[attribute].subscribe(next => trace.putAttribute(attribute, next))) : [];
            const metricSubscriptions = options && options.metric$ ? Object.keys(options.metric$).map(metric => options.metric$[metric].subscribe(next => trace.putMetric(metric, next))) : [];
            const incrementOnSubscriptions = options && options.incrementMetric$ ? Object.keys(options.incrementMetric$).map(metric => options.incrementMetric$[metric].subscribe(next => trace.incrementMetric(metric, next || undefined))) : [];
            emitter.next(trace.start());
            return { unsubscribe: () => {
                    trace.stop();
                    metricSubscriptions.forEach(m => m.unsubscribe());
                    incrementOnSubscriptions.forEach(m => m.unsubscribe());
                    attributeSubscriptions.forEach(m => m.unsubscribe());
                } };
        }))));
        this.traceUntil = (name, test, options) => (source$) => new Observable(subscriber => {
            const traceSubscription = this.trace$(name, options).subscribe();
            return source$.pipe(tap(a => test(a) && traceSubscription.unsubscribe(), () => { }, () => options && options.orComplete && traceSubscription.unsubscribe())).subscribe(subscriber);
        });
        this.traceWhile = (name, test, options) => (source$) => new Observable(subscriber => {
            let traceSubscription;
            return source$.pipe(tap(a => {
                if (test(a)) {
                    traceSubscription = traceSubscription || this.trace$(name, options).subscribe();
                }
                else {
                    traceSubscription && traceSubscription.unsubscribe();
                    traceSubscription = undefined;
                }
            }, () => { }, () => options && options.orComplete && traceSubscription && traceSubscription.unsubscribe())).subscribe(subscriber);
        });
        this.traceUntilComplete = (name, options) => (source$) => new Observable(subscriber => {
            const traceSubscription = this.trace$(name, options).subscribe();
            return source$.pipe(tap(() => { }, () => { }, () => traceSubscription.unsubscribe())).subscribe(subscriber);
        });
        this.traceUntilFirst = (name, options) => (source$) => new Observable(subscriber => {
            const traceSubscription = this.trace$(name, options).subscribe();
            return source$.pipe(tap(() => traceSubscription.unsubscribe(), () => { }, () => { })).subscribe(subscriber);
        });
        this.trace = (name, options) => (source$) => new Observable(subscriber => {
            const traceSubscription = this.trace$(name, options).subscribe();
            return source$.pipe(tap(() => traceSubscription.unsubscribe(), () => { }, () => traceSubscription.unsubscribe())).subscribe(subscriber);
        });
        const requirePerformance = from(zone.runOutsideAngular(() => import('firebase/performance')));
        this.performance = requirePerformance.pipe(map(() => zone.runOutsideAngular(() => app.performance())), tap(performance => {
            if (instrumentationEnabled == false) {
                performance.instrumentationEnabled = false;
            }
            if (dataCollectionEnabled == false) {
                performance.dataCollectionEnabled = false;
            }
        }), shareReplay(1));
        if (automaticallyTraceCoreNgMetrics != false) {
            appRef.isStable.pipe(first(it => it), this.traceUntilComplete('isStable')).subscribe();
        }
    }
};
AngularFirePerformance = __decorate([
    Injectable(),
    __param(1, Optional()), __param(1, Inject(AUTOMATICALLY_TRACE_CORE_NG_METRICS)),
    __param(2, Optional()), __param(2, Inject(INSTRUMENTATION_ENABLED)),
    __param(3, Optional()), __param(3, Inject(DATA_COLLECTION_ENABLED)),
    __metadata("design:paramtypes", [FirebaseApp, Object, Object, Object, ApplicationRef,
        NgZone])
], AngularFirePerformance);
export { AngularFirePerformance };
//# sourceMappingURL=performance.js.map