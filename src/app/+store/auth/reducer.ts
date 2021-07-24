import { ActionTypes, SignUpSuccess, SignInSuccess, InitializeUserSuccess } from "./actions";
import { Actions } from "./actions";

export interface IAuthState {
  afUserInfo: any;
  userInfo: any;
}

const initialState: IAuthState = {
  afUserInfo: null,
  userInfo: null
};

export function reducer(state = initialState, action: Actions) {
  switch (action.type) {
    case ActionTypes.SignUpSuccess: {
      const data = (action as SignUpSuccess).payload;
      return { ...state, afUserInfo: data };
    }
    case ActionTypes.SignInSuccess: {
      const data = (action as SignInSuccess).payload;
      return { ...state, afUserInfo: data };
    }
    case ActionTypes.InitializeUserSuccess: {
      const data = (action as InitializeUserSuccess).payload;
      return { ...state, userInfo: data ? data : null };
    }
    case ActionTypes.SignOutSuccess: {
      return initialState;
    }
  }
  return state;
}
