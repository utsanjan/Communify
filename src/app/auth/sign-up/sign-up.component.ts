import { Component } from "@angular/core";
import { Store } from '@ngrx/store';
import { IAppState } from 'src/app/+store';
import { SignUp, GoogleAuth } from 'src/app/+store/auth/actions';

@Component({
  selector: "app-sign-up",
  templateUrl: "./sign-up.component.html",
  styleUrls: ["./sign-up.component.scss"]
})
export class SignUpComponent {
  avatars: { value: string; link: string }[] = [
    {
      value: "Man",
      link: "assets/images/avatar-man.png"
    },
    {
      value: "Women",
      link: "assets/images/avatar-women.png"
    }
  ];

  constructor( private store: Store<IAppState>) {}

  signUp(value) {
    this.store.dispatch(new SignUp(value))
  }

  signUpGoogle() {
    this.store.dispatch(new GoogleAuth())
  }
}
