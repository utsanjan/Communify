import { Injectable } from "@angular/core";
import { IUser } from "../../shared/interfaces/user";
import { auth } from "firebase/app";
import { AngularFireAuth } from "@angular/fire/auth";
import { AngularFirestore } from "@angular/fire/firestore";
import { Router } from "@angular/router";
import { MatSnackBar } from "@angular/material";
import { map } from "rxjs/operators";
import {
  SendVerificationMail,
  InitializeUser,
  SignOut,
  AuthLoginWithProvider
} from "src/app/+store/auth/actions";
import { Store } from "@ngrx/store";
import { IAppState, getUserInfoSelector } from "src/app/+store";

@Injectable({
  providedIn: "root"
})
export class AuthService {
  private _userData: IUser;
  constructor(
    private afDb: AngularFirestore,
    private afAuth: AngularFireAuth,
    private router: Router,
    private snackbar: MatSnackBar,
    private store: Store<IAppState>
  ) {
    this.store.dispatch(new InitializeUser());
    this.store.select(getUserInfoSelector).subscribe(user => {
      this._userData = user ? user : null;
    });
  }

  initializeAuthUser() {
    return this.afAuth.authState;
  }

  get isLoggedIn(): boolean {
    const user = localStorage.getItem("user");
    return user !== null;
    // return !!this._userData;
  }

  // Returns data for logged user
  get userData(): IUser {
    return this._userData;
  }

  // Returns true when user is logged
  private changeEmailVerifiedProp(afUserInfo) {
    return this.afDb
      .collection("users")
      .doc(afUserInfo.user.uid)
      .set({ emailVerified: true }, { merge: true });
  }

  // Get user data from Db
  getUserData(user) {
    return this.afDb
      .collection("users")
      .doc(user.uid)
      .snapshotChanges()
      .pipe(map(user => user.payload.data()));
  }

  /* Sign in with email/password, 
   Check if returned info from angular fire have emailVerified prop
   with value true update property emailVerified in "users" collection */
  signIn({ email, password }) {
    return this.afAuth.auth
      .signInWithEmailAndPassword(email, password)
      .then(afUserInfo => {
        if (afUserInfo.user.emailVerified) {
          this.changeEmailVerifiedProp(afUserInfo);
        }
        return afUserInfo;
      });
  }

  // Sign up with email/password
  signUp({ email, passwordsGroup, name, avatar }) {
    return this.afAuth.auth
      .createUserWithEmailAndPassword(email, passwordsGroup.password)
      .then(afUserInfo => {
        localStorage.setItem("user", "logged");
        this.store.dispatch(new SendVerificationMail());
        this.setUserData(afUserInfo, name, avatar);
        return afUserInfo;
      });
  }

  // Send email verfificaiton when new user sign up
  sendVerificationMail() {
    return this.afAuth.auth.currentUser.sendEmailVerification();
  }

  // Reset Forggot password
  forgotPassword(passwordResetEmail) {
    return this.afAuth.auth.sendPasswordResetEmail(passwordResetEmail);
  }

  // Sign in with Google
  GoogleAuth() {
    return this.authLogin(new auth.GoogleAuthProvider());
    // return this.store.dispatch(
    //   new AuthLoginWithProvider({ provider: new auth.GoogleAuthProvider() })
    // );
  }

  // Auth logic to run auth providers
  authLogin(provider) {
    return this.afAuth.auth
      .signInWithPopup(provider)
      .then(afUserInfo => {
        this.setUserData(afUserInfo);
        this.router.navigate(["post", "list"]);
      })
      .catch(error => {
        this.snackbar.open(error.message, "Undo", {
          duration: 3000
        });
      });
  }

  /* Setting up user data when sign in with username/password, 
  sign up with username/password and sign in with social auth  
  provider in Firestore database using AngularFirestore + AngularFirestoreDocument service */
  private setUserData(afUserInfo, name?: string, avatar?: string) {
    const userData: IUser = {
      id: afUserInfo.user.uid,
      email: afUserInfo.user.email,
      emailVerified: afUserInfo.user.emailVerified,
      name: name || afUserInfo.user.displayName,
      avatar: avatar || afUserInfo.user.photoURL
    };

    return this.afDb.doc(`users/${afUserInfo.user.uid}`).set(userData, {
      merge: true
    });
  }

  // Sign out
  signOut() {
    return this.afAuth.auth.signOut().then(() => {
      this._userData = null;
    });
  }

  deleteUser(userId) {
    window.alert("Are you sure ?");
    return this.afAuth.auth.currentUser
      .delete()
      .then(() => {
        this.store.dispatch(new SignOut());
        this.afDb
          .collection("users")
          .doc(userId)
          .delete();
      })
      .catch(err => console.error(err));
  }
}
