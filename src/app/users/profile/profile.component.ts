import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Observable } from "rxjs";
import { IUser } from "../../shared/interfaces/user";
import { IAppState, getCurrentUserSelector } from "src/app/+store";
import { Store } from "@ngrx/store";
import { CurrentUser, DeleteUser } from "../../+store/users/actions";

@Component({
  selector: "app-profile",
  templateUrl: "./profile.component.html",
  styleUrls: ["./profile.component.scss"]
})
export class ProfileComponent implements OnInit {
  user$: Observable<IUser>;
  constructor(
    private activateRoute: ActivatedRoute,
    private router: Router,
    private store: Store<IAppState>
  ) {}

  ngOnInit() {
    this.store.dispatch(new CurrentUser(this.activateRoute.snapshot.params.id));
    this.user$ = this.store.select(getCurrentUserSelector);
  }

  resetPassword() {
    this.router.navigate(["auth", "forgot-password"]);
  }

  deleteAccount(userId: string) {
    this.store.dispatch(new DeleteUser({ userId }));
  }
}
