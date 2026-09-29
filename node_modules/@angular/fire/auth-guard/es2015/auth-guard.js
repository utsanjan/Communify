var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { of, pipe } from 'rxjs';
import { map, switchMap, take } from 'rxjs/operators';
import { AngularFireAuth } from '@angular/fire/auth';
let AngularFireAuthGuard = class AngularFireAuthGuard {
    constructor(afAuth, router) {
        this.afAuth = afAuth;
        this.router = router;
    }
    canActivate(next, state) {
        const authPipeFactory = next.data.authGuardPipe || (() => loggedIn);
        return this.afAuth.user.pipe(take(1), authPipeFactory(next, state), map(canActivate => typeof canActivate == "boolean" ? canActivate : this.router.createUrlTree(canActivate)));
    }
};
AngularFireAuthGuard = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [AngularFireAuth, Router])
], AngularFireAuthGuard);
export { AngularFireAuthGuard };
export const canActivate = (pipe) => ({
    canActivate: [AngularFireAuthGuard], data: { authGuardPipe: pipe.name === "" ? pipe : () => pipe }
});
const ɵ0 = user => !!user;
export const loggedIn = map(ɵ0);
const ɵ1 = user => !!user && !user.isAnonymous;
export const isNotAnonymous = map(ɵ1);
const ɵ2 = (user) => user ? user.getIdTokenResult() : of(null);
export const idTokenResult = switchMap(ɵ2);
const ɵ3 = user => !!user && user.emailVerified;
export const emailVerified = map(ɵ3);
const ɵ4 = idTokenResult => idTokenResult ? idTokenResult.claims : [];
export const customClaims = pipe(idTokenResult, map(ɵ4));
export const hasCustomClaim = (claim) => pipe(customClaims, map(claims => claims.hasOwnProperty(claim)));
export const redirectUnauthorizedTo = (redirect) => pipe(loggedIn, map(loggedIn => loggedIn || redirect));
export const redirectLoggedInTo = (redirect) => pipe(loggedIn, map(loggedIn => loggedIn && redirect || true));
export { ɵ0, ɵ1, ɵ2, ɵ3, ɵ4 };
//# sourceMappingURL=auth-guard.js.map