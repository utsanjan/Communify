import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable, UnaryFunction } from 'rxjs';
import { User, auth } from 'firebase/app';
import { AngularFireAuth } from '@angular/fire/auth';
export declare type AuthPipeGenerator = (next: ActivatedRouteSnapshot, state: RouterStateSnapshot) => AuthPipe;
export declare type AuthPipe = UnaryFunction<Observable<User | null>, Observable<boolean | any[]>>;
export declare class AngularFireAuthGuard implements CanActivate {
    private afAuth;
    private router;
    constructor(afAuth: AngularFireAuth, router: Router);
    canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree>;
}
export declare const canActivate: (pipe: UnaryFunction<Observable<User | null>, Observable<boolean | any[]>> | AuthPipeGenerator) => {
    canActivate: (typeof AngularFireAuthGuard)[];
    data: {
        authGuardPipe: UnaryFunction<Observable<User | null>, Observable<boolean | any[]>> | AuthPipeGenerator | (() => UnaryFunction<Observable<User | null>, Observable<boolean | any[]>> | AuthPipeGenerator);
    };
};
export declare const loggedIn: AuthPipe;
export declare const isNotAnonymous: AuthPipe;
export declare const idTokenResult: import("rxjs").OperatorFunction<User | null, auth.IdTokenResult | null>;
export declare const emailVerified: AuthPipe;
export declare const customClaims: UnaryFunction<Observable<User | null>, Observable<{
    [key: string]: any;
}>>;
export declare const hasCustomClaim: (claim: string) => UnaryFunction<Observable<User | null>, Observable<boolean>>;
export declare const redirectUnauthorizedTo: (redirect: any[]) => UnaryFunction<Observable<User | null>, Observable<true | any[]>>;
export declare const redirectLoggedInTo: (redirect: any[]) => UnaryFunction<Observable<User | null>, Observable<true | any[]>>;
