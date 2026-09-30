import { Injectable } from "@angular/core";
import { Actions, Effect, ofType } from "@ngrx/effects";
import {
  SignUp,
  ActionTypes,
  SignUpSuccess,
  GoogleAuth,
  GoogleAuthFailed,
  SignIn,
  ForgotPassword,
  SendVerificationMail,
  SignOut,
  InitializeUser,
  InitializeUserSuccess,
  InitializeUserFailed,
  SignOutSuccess,
  SendVerificationMailFailed,
  AuthLoginWithProvider,
  AuthLoginWithProviderFailed,
  AuthLoginWithProviderSuccess
} from "./auth.actions";
import { map, switchMap, tap, filter } from "rxjs/operators";
import { AuthService } from "../../auth/services/auth.service";
import { MatSnackBar } from "@angular/material";
import { Router } from "@angular/router";

@Injectable({
  providedIn: "root"
})
export class AuthEffects {
  constructor(
    private actions$: Actions,
    private authService: AuthService,
    private snackbar: MatSnackBar,
    private router: Router
  ) {}

  @Effect() signUp$ = this.actions$.pipe(
    ofType<SignUp>(ActionTypes.SignUp),
    map(data => data.payload),
    switchMap(data => {
      return this.authService
        .signUp(data)
        .then(userCredential => {
          return new InitializeUser();
        })
        .catch(error => {
          this.snackbar.open(error.message, "Undo", {
            duration: 3000
          });
          return new InitializeUserFailed({ error });
        });
    })
  );

  @Effect() signIn$ = this.actions$.pipe(
    ofType<SignIn>(ActionTypes.SignIn),
    map(data => data.payload),
    switchMap(({ email, password }) => {
      return this.authService
        .signIn({ email, password })
        .then(userCredential => {
          localStorage.setItem("user", "logged");
          // Navigation is handled by InitializeUserSuccess$ after user data is loaded
          return new InitializeUser();
        })
        .catch(error => {
          this.snackbar.open(error.message, "Undo", {
            duration: 3000
          });
          return new InitializeUserFailed({ error });
        });
    })
  );

  @Effect() googleAuth$ = this.actions$.pipe(
    ofType<GoogleAuth>(ActionTypes.GoogleAuth),
    switchMap(() => {
      return this.authService
        .GoogleAuth()
        .then(() => {
          localStorage.setItem("user", "logged");
          // Navigation is handled by InitializeUserSuccess$ after user data is loaded
          return new InitializeUser();
        })
        .catch(err => new GoogleAuthFailed({ error: err }));
    })
  );

  // Navigate to /post/list only after user data is fully loaded from Firestore.
  // This prevents the blank page caused by dispatching AllPosts before the
  // Firebase auth token is attached to the Firestore client.
  @Effect({ dispatch: false }) InitializeUserSuccess$ = this.actions$.pipe(
    ofType<InitializeUserSuccess>(ActionTypes.InitializeUserSuccess),
    filter(() => localStorage.getItem("user") !== null),
    tap(() => {
      // Only navigate if not already on a post/user page (avoids redirect loop on refresh)
      const currentUrl = this.router.url;
      if (currentUrl === '/' || currentUrl === '/home' || currentUrl.startsWith('/auth')) {
        this.router.navigate(["post", "list"]);
      }
    })
  );

  @Effect() forgotPassword$ = this.actions$.pipe(
    ofType<ForgotPassword>(ActionTypes.ForgotPassword),
    map(data => data.payload),
    switchMap(({ email }) => {
      this.authService
        .forgotPassword(email)
        .then(() => {
          this.snackbar.open(
            "Password reset email sent, check your inbox.",
            "Undo",
            {
              duration: 3000
            }
          );
        })
        .catch(err => {
          this.snackbar.open(err.message, "Undo", {
            duration: 3000
          });
        });
      return [];
    })
  );

  @Effect() verificationMail$ = this.actions$.pipe(
    ofType<SendVerificationMail>(ActionTypes.SendVerificationMail),
    switchMap(() => {
      return this.authService
        .sendVerificationMail()
        .then(() => {
          this.router.navigate(["auth", "verify-email-address"]);
          return new InitializeUser();
        })
        .catch(err => {
          this.snackbar.open(err.message, "Undo", {
            duration: 3000
          });
          return new SendVerificationMailFailed({ error: err });
        });
    })
  );

  @Effect() signOut$ = this.actions$.pipe(
    ofType<SignOut>(ActionTypes.SignOut),
    switchMap(() => {
      return this.authService
        .signOut()
        .then(() => {
          localStorage.removeItem("user");
          this.router.navigate(["/"]);
          return new SignOutSuccess();
        })
        .catch(err => console.error(err));
    })
  );

  @Effect() InitializeUser$ = this.actions$.pipe(
    ofType<InitializeUser>(ActionTypes.InitializeUser),
    switchMap(() => {
      return this.authService.initializeAuthUser().pipe(
        switchMap(afUserInfo => {
          if (afUserInfo) {
            return this.authService
              .getUserData(afUserInfo)
              .pipe(map(user => new InitializeUserSuccess(user)));
          } else {
            return [new InitializeUserFailed({ error: null })];
          }
        })
      );
    })
  );

  @Effect() AuthLoginWithProvider$ = this.actions$.pipe(
    ofType<AuthLoginWithProvider>(ActionTypes.AuthLoginWithProvider),
    map(data => data.payload),
    switchMap(({ provider }) => {
      return this.authService
        .authLogin(provider)
        .then(() => {
          return new AuthLoginWithProviderSuccess()
        })
        .catch(error => {
          this.snackbar.open(error.message, "Undo", {
            duration: 3000
          });
          return new AuthLoginWithProviderFailed({ error });
        });
    })
  );

  //   @Effect() init$ = this.actions$.pipe(
  //       ofType('@ngrx/effects/init'),
  //       map(() => new InitializeUser())
  //   )
}
