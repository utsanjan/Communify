import { Injectable } from "@angular/core";
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router
} from "@angular/router";
import { AuthService } from "../../auth/services/auth.service";
import { MatSnackBar } from "@angular/material";

@Injectable({
  providedIn: "root"
})
export class SecureInnerGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router,
    private snackbar: MatSnackBar
  ) {}
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    if (this.authService.isLoggedIn) {
      this.snackbar.open("You are not allowed to access this URL!", "Undo", {
        duration: 3000
      });
      // window.alert("You are not allowed to access this URL!");
      this.router.navigate(["post", "list"]);
      return false;
    }
    return true;
  }
}
