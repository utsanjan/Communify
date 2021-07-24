import { Component } from "@angular/core";
import { AuthService } from "src/app/auth/services/auth.service";
import { Store } from "@ngrx/store";
import { IAppState } from "src/app/+store";
import { ForgotPassword } from "src/app/+store/auth/actions";

@Component({
  selector: "app-forgot-password",
  templateUrl: "./forgot-password.component.html",
  styleUrls: ["./forgot-password.component.scss"]
})
export class ForgotPasswordComponent {
  isAuth = this.authService.isLoggedIn;
  constructor(
    private authService: AuthService,
    private store: Store<IAppState>
  ) {}

  forgotPassword(value) {
    this.store.dispatch(new ForgotPassword(value));
  }
}
