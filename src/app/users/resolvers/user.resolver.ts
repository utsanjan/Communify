import { Injectable } from "@angular/core";
import {
  Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from "@angular/router";
import { UsersService } from "../services/users.service";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root"
})
export class UserResolver implements Resolve<any> {
  constructor(private userService: UsersService) {}
  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<any> | Promise<any> | any {
    // return this.userService.getUser(route.params['id']);
    return true;
  }
}
