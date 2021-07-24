import { IUser } from "../../shared/interfaces/user";
import {
  Actions,
  ActionTypes,
  AllUsersSuccess,
  SearchUserSuccess
} from "./actions";

export interface IUserState {
  userList: IUser[];
  currentUser: IUser;
  foundUsers: IUser[];
}

const initialState: IUserState = {
  userList: [],
  currentUser: null,
  foundUsers: null
};

export function reducer(state = initialState, action: Actions) {
  switch (action.type) {
    case ActionTypes.GetAllUsersSuccess: {
      const data: IUser = (action as AllUsersSuccess).payload;
      let list = state.userList;
      const foundUser = list.find(u => u.email === data.email)
      if (foundUser) {
        list = list.filter(u => u !== foundUser)
        list = list.concat(data)
      }else {
        list = list.concat(data);
      }
      return { ...state, userList: list };
    }
    case ActionTypes.GetCurrentUserSuccess: {
      const currentUser = action.payload;
      return { ...state, currentUser };
    }
    case ActionTypes.SearchUserSuccess: {
      const data = (action as SearchUserSuccess).payload;
      return { ...state, foundUsers: data };
    }
  }
  return state;
}
