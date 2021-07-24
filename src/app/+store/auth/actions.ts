import { IAction } from "../../shared/interfaces/action";

export const ActionTypes = {
  SignUp: "[AUTH] SignUp",
  SignUpSuccess: "[AUTH] SignUp Success",
  SignUpFailed: "[AUTH] SignUp Failed",

  SignIn: "[AUTH] SignIn",
  SignInSuccess: "[AUTH] SignIn Success",
  SignInFailed: "[AUTH] SignIn Failed",

  SignOut: "[AUTH] SignOut",
  SignOutSuccess: "[AUTH] SignOutSuccess",
  SignOutFailed: "[AUTH] SignOutFailed",

  GoogleAuth: "[AUTH] Google Auth",
  GoogleAuthSuccess: "[AUTH] Google Auth Success",
  GoogleAuthFailed: "[AUTH] Google Auth Failed",

  ForgotPassword: "[AUTH] Forgot Password",
  ForgotPasswordSuccess: "[AUTH] Forgot Password Success",
  ForgotPasswordFailed: "[AUTH] Forgot Password Failed",

  SendVerificationMail: "[AUTH] Send Verification Mail",
  SendVerificationMailSuccess: "[AUTH] Send Verification Mail Success",
  SendVerificationMailFailed: "[AUTH] Send Verification Mail Failed",

  InitializeUser: "[AUTH] Initialize Auth User",
  InitializeUserSuccess: "[AUTH] Initialize Auth User Success",
  InitializeUserFailed: "[AUTH] Initialize Auth User Failed",

  AuthLoginWithProvider: "[AUTH] Auth Login With Provider",
  AuthLoginWithProviderSuccess: "[AUTH] Auth Login With Provider Success",
  AuthLoginWithProviderFailed: "[AUTH] Auth Login With Provider Failed"
};

export class SignUp
  implements
    IAction<{
      email: string;
      passwordsGroup: { password: string; repassword: string };
      name: string;
      avatar: string;
    }> {
  type = ActionTypes.SignUp;
  constructor(
    public payload: {
      email: string;
      passwordsGroup: { password: string; repassword: string };
      name: string;
      avatar: string;
    }
  ) {}
}

export class SignUpSuccess implements IAction<any> {
  type = ActionTypes.SignUpSuccess;
  constructor(public payload: any) {}
}

export class SignUpFailed implements IAction<{ error: any }> {
  type = ActionTypes.SignUpFailed;
  constructor(public payload: { error: any }) {}
}

export class SignIn implements IAction<{ email; password }> {
  type = ActionTypes.SignIn;
  constructor(public payload: { email; password }) {}
}

export class SignInSuccess implements IAction<any> {
  type = ActionTypes.SignInSuccess;
  constructor(public payload: any) {}
}

export class SignInFailed implements IAction<{ error: any }> {
  type = ActionTypes.SignInFailed;
  constructor(public payload: { error: any }) {}
}

export class GoogleAuth implements IAction<null> {
  type = ActionTypes.GoogleAuth;
  constructor(public payload: null = null) {}
}

export class GoogleAuthSuccess implements IAction<null> {
  type = ActionTypes.GoogleAuthSuccess;
  constructor(public payload: null = null) {}
}

export class GoogleAuthFailed implements IAction<{ error: any }> {
  type = ActionTypes.SignInFailed;
  constructor(public payload: { error: any }) {}
}

export class ForgotPassword implements IAction<{ email: string }> {
  type = ActionTypes.ForgotPassword;
  constructor(public payload: { email: string }) {}
}

export class ForgotPasswordSuccess implements IAction<null> {
  type = ActionTypes.ForgotPasswordSuccess;
  constructor(public payload: null = null) {}
}

export class ForgotPasswordFailed implements IAction<{ error: any }> {
  type = ActionTypes.ForgotPasswordFailed;
  constructor(public payload: { error: any }) {}
}

export class SendVerificationMail implements IAction<null> {
  type = ActionTypes.SendVerificationMail;
  constructor(public payload: null = null) {}
}

export class SendVerificationMailSuccess implements IAction<null> {
  type = ActionTypes.SendVerificationMailSuccess;
  constructor(public payload: null = null) {}
}

export class SendVerificationMailFailed implements IAction<{ error: any }> {
  type = ActionTypes.SendVerificationMailFailed;
  constructor(public payload: { error: any }) {}
}

export class SignOut implements IAction<null> {
  type = ActionTypes.SignOut;
  constructor(public payload: null = null) {}
}

export class SignOutSuccess implements IAction<null> {
  type = ActionTypes.SignOutSuccess;
  constructor(public payload: null = null) {}
}

export class SignOutFailed implements IAction<{ error: any }> {
  type = ActionTypes.SignOutFailed;
  constructor(public payload: { error: any }) {}
}

export class InitializeUser implements IAction<null> {
  type = ActionTypes.InitializeUser;
  constructor(public payload: null = null) {}
}

export class InitializeUserSuccess implements IAction<any> {
  type = ActionTypes.InitializeUserSuccess;
  constructor(public payload: any) {}
}

export class InitializeUserFailed implements IAction<{ error: any }> {
  type = ActionTypes.InitializeUserFailed;
  constructor(public payload: { error: any }) {}
}

export class AuthLoginWithProvider implements IAction<{ provider: any }> {
  type = ActionTypes.AuthLoginWithProvider;
  constructor(public payload: { provider: any }) {}
}

export class AuthLoginWithProviderSuccess implements IAction<null> {
  type = ActionTypes.AuthLoginWithProviderSuccess;
  constructor(public payload: null = null) {}
}

export class AuthLoginWithProviderFailed implements IAction<{ error: any }> {
  type = ActionTypes.AuthLoginWithProviderFailed;
  constructor(public payload: { error: any }) {}
}

export type Actions =
  | SignUp
  | SignUpSuccess
  | SignUpFailed
  | SignIn
  | SignInSuccess
  | SignInFailed
  | GoogleAuth
  | GoogleAuthSuccess
  | GoogleAuthFailed
  | ForgotPassword
  | ForgotPasswordSuccess
  | ForgotPasswordFailed
  | SendVerificationMail
  | SendVerificationMailSuccess
  | SendVerificationMailFailed
  | SignOut
  | SignOutSuccess
  | SignUpFailed
  | InitializeUser
  | InitializeUserSuccess
  | InitializeUserFailed
  | AuthLoginWithProvider
  | AuthLoginWithProviderSuccess
  | AuthLoginWithProviderFailed;
