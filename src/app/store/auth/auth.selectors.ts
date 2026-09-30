import { IAuthState } from "./auth.reducer";

export const getLoggedUserInfo = (state: IAuthState) => state.userInfo