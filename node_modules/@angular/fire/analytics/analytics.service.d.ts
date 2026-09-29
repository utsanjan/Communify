import { NgZone, OnDestroy, ComponentFactoryResolver, Injector } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAnalytics } from './analytics';
import { Title } from '@angular/platform-browser';
export declare class ScreenTrackingService implements OnDestroy {
    private disposable;
    constructor(analytics: AngularFireAnalytics, router: Router, title: Title, componentFactoryResolver: ComponentFactoryResolver, platformId: Object, debugModeEnabled: boolean | null, zone: NgZone, injector: Injector);
    ngOnDestroy(): void;
}
export declare class UserTrackingService implements OnDestroy {
    private disposable;
    constructor(analytics: AngularFireAnalytics, zone: NgZone, platformId: Object);
    ngOnDestroy(): void;
}
