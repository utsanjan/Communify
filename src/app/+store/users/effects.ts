import { Injectable } from "@angular/core";
import { Actions, Effect, ofType } from "@ngrx/effects";
import { UsersService } from "src/app/users/services/users.service";
import {
  ActionTypes,
  AllUsersSuccess,
  AllUsersFailed,
  CurrentUserSuccess,
  CurrentUserFailed,
  CurrentUser,
  DeleteUser,
  SearchUser,
  SearchUserSuccess,
  SearchUserFailed
} from "./actions";
import {  map, switchMap, catchError } from "rxjs/operators";
import { IUser } from "src/app/shared/interfaces/user";
import { Router } from '@angular/router';

@Injectable({
  providedIn: "root"
})
export class UserEffects {
  constructor(private actions$: Actions, private userService: UsersService) {}

  @Effect() userList$ = this.actions$.pipe(
    ofType(ActionTypes.GetAllUsers),
    switchMap(() => {
      return this.userService.getAllUsers.pipe(
        map((user: IUser) => new AllUsersSuccess(user)),
        catchError(err => [new AllUsersFailed({ error: err })])
      );
    })
  );

  @Effect() currentUser$ = this.actions$.pipe(
    ofType<CurrentUser>(ActionTypes.GetCurrentUser),
    map(data => data.payload),
    switchMap(userId => {
      return this.userService.getUser(userId).pipe(
        map((user: IUser) => new CurrentUserSuccess(user)),
        catchError(err => [new CurrentUserFailed({ error: err })])
      );
    })
  );

  @Effect() deleteUser$ = this.actions$.pipe(
    ofType<DeleteUser>(ActionTypes.DeleteUser),
    map(data => data.payload),
    switchMap(({ userId }) => {
      this.userService.deleteUser(userId);
      return [];
    })
  );

  @Effect() searchUser$ = this.actions$.pipe(
    ofType<SearchUser>(ActionTypes.SearchUser),
    map(data => data.payload),
    switchMap(({ userList, value }) => {
      return this.userService.searchUser(userList, value).pipe(
        map((userList: IUser[]) => new SearchUserSuccess(userList)),
        catchError(err => [new SearchUserFailed({ error: err })])
      );
    })
  );
}
