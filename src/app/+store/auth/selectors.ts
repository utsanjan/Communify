import { IAuthState } from "./reducer";

export const getLoggedUserInfo = (state: IAuthState) => state.userInfo