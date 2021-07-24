import { Component } from "@angular/core";
import { AuthService } from "src/app/auth/services/auth.service";
import { Store } from "@ngrx/store";
import { IAppState } from "src/app/+store";
import { SignOut } from 'src/app/+store/auth/actions';

@Component({
  selector: "app-sidenav-list",
  templateUrl: "./sidenav-list.component.html",
  styleUrls: ["./sidenav-list.component.scss"]
})
export class SidenavListComponent {
  constructor(
    private authService: AuthService,
    private store: Store<IAppState>
  ) {}

  get isAuth() {
    return this.authService.isLoggedIn;
  }

  get currentUser() {
    return this.authService.userData;
  }
  signOut() {
    this.store.dispatch(new SignOut());
  }
}
