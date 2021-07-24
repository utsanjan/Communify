import { IAction } from "src/app/shared/interfaces/action";
import { IUser } from "src/app/shared/interfaces/user";

export const ActionTypes = {
  GetAllUsers: "[USER] Get All Users",
  GetAllUsersSuccess: "[USER] Get All Users Success",
  GetAllUsersFailed: "[USER] Get All Users Failed",

  GetCurrentUser: "[USER] Get Current User",
  GetCurrentUserSuccess: "[USER] Get Current User Success",
  GetCurrentUserFailed: "[USER] Get Current User Failed",

  DeleteUser: "[USER] Delete User",
  DeleteUserSuccess: "[USER] Delete User Success",
  DeleteUserFailed: "[USER] Delete User Failed",

  SearchUser: "[USER] Search user",
  SearchUserSuccess: "[USER] Search user Success",
  SearchUserFailed: "[USER] Search user Failed"
};

/* Get All Users Actions */
export class AllUsers implements IAction<null> {
  type = ActionTypes.GetAllUsers;
  constructor(public payload: null = null) {}
}

export class AllUsersSuccess implements IAction<IUser> {
  type = ActionTypes.GetAllUsersSuccess;
  constructor(public payload: IUser) {}
}

export class AllUsersFailed implements IAction<{ error: any }> {
  type = ActionTypes.GetAllUsersFailed;
  constructor(public payload: { error: any }) {}
}

/* Get Current User Actions */
export class CurrentUser implements IAction<string> {
  type = ActionTypes.GetCurrentUser;
  constructor(public payload: string) {}
}

export class CurrentUserSuccess implements IAction<IUser> {
  type = ActionTypes.GetCurrentUserSuccess;
  constructor(public payload: IUser) {}
}

export class CurrentUserFailed implements IAction<{ error: any }> {
  type = ActionTypes.GetCurrentUserFailed;
  constructor(public payload: { error: any }) {}
}

/*Delete User */
export class DeleteUser implements IAction<{ userId: string }> {
  type = ActionTypes.DeleteUser;
  constructor(public payload: { userId: string }) {}
}

export class DeleteUserSuccess implements IAction<null> {
  type = ActionTypes.DeleteUserSuccess;
  constructor(public payload: null) {}
}

export class DeleteUserFailed implements IAction<{ error: any }> {
  type = ActionTypes.DeleteUserFailed;
  constructor(public payload: { error: any }) {}
}

/* Search User */
export class SearchUser
  implements IAction<{ userList: IUser[]; value: string }> {
  type = ActionTypes.SearchUser;
  constructor(public payload: { userList: IUser[]; value: string }) {}
}

export class SearchUserSuccess implements IAction<IUser[]> {
  type = ActionTypes.SearchUserSuccess;
  constructor(public payload: IUser[]) {}
}

export class SearchUserFailed implements IAction<{ error: any }> {
  type = ActionTypes.SearchUserFailed;
  constructor(public payload: { error: any }) {}
}
export type Actions =
  | AllUsers
  | AllUsersSuccess
  | AllUsersFailed
  | CurrentUser
  | CurrentUserSuccess
  | CurrentUserFailed
  | DeleteUser
  | DeleteUserSuccess
  | DeleteUserSuccess
  | SearchUser
  | SearchUserSuccess
  | SearchUserFailed;
