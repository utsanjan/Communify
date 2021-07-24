import { IUserState } from "./reducer";

export const getAllUsers = (state: IUserState) => state.userList;
export const getCurrentUser = (state: IUserState) => state.currentUser;
export const foundUsers = (state: IUserState) => state.foundUsers;
