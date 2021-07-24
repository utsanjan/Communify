import { Component } from "@angular/core";
import { AuthService } from "src/app/auth/services/auth.service";
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { IAppState } from 'src/app/+store';
import { SendVerificationMail } from 'src/app/+store/auth/actions';

@Component({
  selector: "app-verify-email",
  templateUrl: "./verify-email.component.html",
  styleUrls: ["./verify-email.component.scss"]
})
export class VerifyEmailComponent {
  currentUser = this.authService.userData;
  constructor(private authService: AuthService, private router: Router, private store: Store<IAppState>) {
    console.log(this.currentUser)
  }

  sendVerificationMail() {
    this.store.dispatch(new SendVerificationMail())
  }
  
  navigateMyProfile(){
    this.router.navigate(["user", this.currentUser.id])
  }
}
