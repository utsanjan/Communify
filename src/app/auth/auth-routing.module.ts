import { Routes, RouterModule } from "@angular/router";
import { SignInComponent } from "./sign-in/sign-in.component";
import { SecureInnerGuard } from "../shared/guards/secure-inner.guard";
import { SignUpComponent } from "./sign-up/sign-up.component";
import { ForgotPasswordComponent } from "./forgot-password/forgot-password.component";
import { VerifyEmailComponent } from "./verify-email/verify-email.component";
const routes: Routes = [
  {
    path: "auth",
    children: [
      {
        path: "",
        pathMatch: "full",
        redirectTo: "sign-in"
      },
      {
        path: "sign-in",
        component: SignInComponent,
        canActivate: [SecureInnerGuard]
      },
      {
        path: "signup",
        component: SignUpComponent,
        canActivate: [SecureInnerGuard]
      },
      {
        path: "forgot-password",
        component: ForgotPasswordComponent,
      },
      {
        path: "verify-email-address",
        component: VerifyEmailComponent,
      }
    ]
  }
];
export const AuthRoutingModule = RouterModule.forChild(routes);
