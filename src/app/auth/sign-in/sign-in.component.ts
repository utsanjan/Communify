import { Component } from "@angular/core";
import { Store } from "@ngrx/store";
import { IAppState } from "src/app/+store";
import { GoogleAuth, SignIn } from "src/app/+store/auth/actions";

@Component({
  selector: "app-sign-in",
  templateUrl: "./sign-in.component.html",
  styleUrls: ["./sign-in.component.scss"]
})
export class SignInComponent {
  constructor(private store: Store<IAppState>) {}

  signIn(value) {
    this.store.dispatch(new SignIn(value));
  }

  signInGoogle() {
    this.store.dispatch(new GoogleAuth());
  }
}
