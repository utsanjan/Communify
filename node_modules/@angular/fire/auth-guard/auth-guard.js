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
var AngularFireAuthGuard = (function () {
    function AngularFireAuthGuard(afAuth, router) {
        this.afAuth = afAuth;
        this.router = router;
    }
    AngularFireAuthGuard.prototype.canActivate = function (next, state) {
        var _this = this;
        var authPipeFactory = next.data.authGuardPipe || (function () { return loggedIn; });
        return this.afAuth.user.pipe(take(1), authPipeFactory(next, state), map(function (canActivate) { return typeof canActivate == "boolean" ? canActivate : _this.router.createUrlTree(canActivate); }));
    };
    AngularFireAuthGuard = __decorate([
        Injectable(),
        __metadata("design:paramtypes", [AngularFireAuth, Router])
    ], AngularFireAuthGuard);
    return AngularFireAuthGuard;
}());
export { AngularFireAuthGuard };
export var canActivate = function (pipe) { return ({
    canActivate: [AngularFireAuthGuard], data: { authGuardPipe: pipe.name === "" ? pipe : function () { return pipe; } }
}); };
var ɵ0 = function (user) { return !!user; };
export var loggedIn = map(ɵ0);
var ɵ1 = function (user) { return !!user && !user.isAnonymous; };
export var isNotAnonymous = map(ɵ1);
var ɵ2 = function (user) { return user ? user.getIdTokenResult() : of(null); };
export var idTokenResult = switchMap(ɵ2);
var ɵ3 = function (user) { return !!user && user.emailVerified; };
export var emailVerified = map(ɵ3);
var ɵ4 = function (idTokenResult) { return idTokenResult ? idTokenResult.claims : []; };
export var customClaims = pipe(idTokenResult, map(ɵ4));
export var hasCustomClaim = function (claim) { return pipe(customClaims, map(function (claims) { return claims.hasOwnProperty(claim); })); };
export var redirectUnauthorizedTo = function (redirect) { return pipe(loggedIn, map(function (loggedIn) { return loggedIn || redirect; })); };
export var redirectLoggedInTo = function (redirect) { return pipe(loggedIn, map(function (loggedIn) { return loggedIn && redirect || true; })); };
export { ɵ0, ɵ1, ɵ2, ɵ3, ɵ4 };
//# sourceMappingURL=auth-guard.js.map