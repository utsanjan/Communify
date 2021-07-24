import { Component, OnInit, OnDestroy } from "@angular/core";
import { Observable, Subscription } from "rxjs";
import { IUser } from "../../shared/interfaces/user";
import {
  IAppState,
  getAllUsersSelector,
  getFoundUsersSelector
} from "../../+store";
import { Store } from "@ngrx/store";
import { AllUsers, SearchUser } from "../../+store/users/actions";

@Component({
  selector: "app-users-list",
  templateUrl: "./list.component.html",
  styleUrls: ["./list.component.scss"]
})
export class ListComponent implements OnInit, OnDestroy {
  options: { text: string; value: string }[] = [
    { text: "Name", value: "name" },
    { text: "Email", value: "email" },
    { text: "Title", value: "title" }
  ];
  users$: Observable<IUser[]>;
  private subscription: Subscription = new Subscription();
  constructor(private store: Store<IAppState>) {}

  ngOnInit() {
    this.store.dispatch(new AllUsers());
    this.users$ = this.store.select(getAllUsersSelector);
  }

  searchUser(value: string) {
    this.subscription = this.store
      .select(getAllUsersSelector)
      .subscribe(userList => {
        this.store.dispatch(new SearchUser({ userList, value }));
        this.users$ = this.store.select(getFoundUsersSelector);
      });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
