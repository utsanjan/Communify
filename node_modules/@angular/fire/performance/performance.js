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
export var AUTOMATICALLY_TRACE_CORE_NG_METRICS = new InjectionToken('angularfire2.performance.auto_trace');
export var INSTRUMENTATION_ENABLED = new InjectionToken('angularfire2.performance.instrumentationEnabled');
export var DATA_COLLECTION_ENABLED = new InjectionToken('angularfire2.performance.dataCollectionEnabled');
var AngularFirePerformance = (function () {
    function AngularFirePerformance(app, automaticallyTraceCoreNgMetrics, instrumentationEnabled, dataCollectionEnabled, appRef, zone) {
        var _this = this;
        this.zone = zone;
        this.trace$ = function (name, options) {
            return _this.performance.pipe(switchMap(function (performance) {
                return new Observable(function (emitter) {
                    return _this.zone.runOutsideAngular(function () {
                        var trace = performance.trace(name);
                        options && options.metrics && Object.keys(options.metrics).forEach(function (metric) {
                            trace.putMetric(metric, options.metrics[metric]);
                        });
                        options && options.attributes && Object.keys(options.attributes).forEach(function (attribute) {
                            trace.putAttribute(attribute, options.attributes[attribute]);
                        });
                        var attributeSubscriptions = options && options.attribute$ ? Object.keys(options.attribute$).map(function (attribute) {
                            return options.attribute$[attribute].subscribe(function (next) { return trace.putAttribute(attribute, next); });
                        }) : [];
                        var metricSubscriptions = options && options.metric$ ? Object.keys(options.metric$).map(function (metric) {
                            return options.metric$[metric].subscribe(function (next) { return trace.putMetric(metric, next); });
                        }) : [];
                        var incrementOnSubscriptions = options && options.incrementMetric$ ? Object.keys(options.incrementMetric$).map(function (metric) {
                            return options.incrementMetric$[metric].subscribe(function (next) { return trace.incrementMetric(metric, next || undefined); });
                        }) : [];
                        emitter.next(trace.start());
                        return { unsubscribe: function () {
                                trace.stop();
                                metricSubscriptions.forEach(function (m) { return m.unsubscribe(); });
                                incrementOnSubscriptions.forEach(function (m) { return m.unsubscribe(); });
                                attributeSubscriptions.forEach(function (m) { return m.unsubscribe(); });
                            } };
                    });
                });
            }));
        };
        this.traceUntil = function (name, test, options) { return function (source$) { return new Observable(function (subscriber) {
            var traceSubscription = _this.trace$(name, options).subscribe();
            return source$.pipe(tap(function (a) { return test(a) && traceSubscription.unsubscribe(); }, function () { }, function () { return options && options.orComplete && traceSubscription.unsubscribe(); })).subscribe(subscriber);
        }); }; };
        this.traceWhile = function (name, test, options) { return function (source$) { return new Observable(function (subscriber) {
            var traceSubscription;
            return source$.pipe(tap(function (a) {
                if (test(a)) {
                    traceSubscription = traceSubscription || _this.trace$(name, options).subscribe();
                }
                else {
                    traceSubscription && traceSubscription.unsubscribe();
                    traceSubscription = undefined;
                }
            }, function () { }, function () { return options && options.orComplete && traceSubscription && traceSubscription.unsubscribe(); })).subscribe(subscriber);
        }); }; };
        this.traceUntilComplete = function (name, options) { return function (source$) { return new Observable(function (subscriber) {
            var traceSubscription = _this.trace$(name, options).subscribe();
            return source$.pipe(tap(function () { }, function () { }, function () { return traceSubscription.unsubscribe(); })).subscribe(subscriber);
        }); }; };
        this.traceUntilFirst = function (name, options) { return function (source$) { return new Observable(function (subscriber) {
            var traceSubscription = _this.trace$(name, options).subscribe();
            return source$.pipe(tap(function () { return traceSubscription.unsubscribe(); }, function () { }, function () { })).subscribe(subscriber);
        }); }; };
        this.trace = function (name, options) { return function (source$) { return new Observable(function (subscriber) {
            var traceSubscription = _this.trace$(name, options).subscribe();
            return source$.pipe(tap(function () { return traceSubscription.unsubscribe(); }, function () { }, function () { return traceSubscription.unsubscribe(); })).subscribe(subscriber);
        }); }; };
        var requirePerformance = from(zone.runOutsideAngular(function () { return import('firebase/performance'); }));
        this.performance = requirePerformance.pipe(map(function () { return zone.runOutsideAngular(function () { return app.performance(); }); }), tap(function (performance) {
            if (instrumentationEnabled == false) {
                performance.instrumentationEnabled = false;
            }
            if (dataCollectionEnabled == false) {
                performance.dataCollectionEnabled = false;
            }
        }), shareReplay(1));
        if (automaticallyTraceCoreNgMetrics != false) {
            appRef.isStable.pipe(first(function (it) { return it; }), this.traceUntilComplete('isStable')).subscribe();
        }
    }
    AngularFirePerformance = __decorate([
        Injectable(),
        __param(1, Optional()), __param(1, Inject(AUTOMATICALLY_TRACE_CORE_NG_METRICS)),
        __param(2, Optional()), __param(2, Inject(INSTRUMENTATION_ENABLED)),
        __param(3, Optional()), __param(3, Inject(DATA_COLLECTION_ENABLED)),
        __metadata("design:paramtypes", [FirebaseApp, Object, Object, Object, ApplicationRef,
            NgZone])
    ], AngularFirePerformance);
    return AngularFirePerformance;
}());
export { AngularFirePerformance };
//# sourceMappingURL=performance.js.map